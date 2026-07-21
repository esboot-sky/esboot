import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';
import kleur from 'kleur';
import { Project, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export interface UpgradeOptions {
  cwd: string;
  keepTailwind3?: boolean;
}

const ESLINT_VERSION = '^10.4.1';
const STYLELINT_VERSION = '^17.13.0';

// Recursively find all files in a folder excluding node_modules and .git
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir))
    return [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getFilesRecursively(fullPath));
      }
    }
    else {
      results.push(fullPath);
    }
  });
  return results;
}

async function getEsbootVersion(): Promise<string> {
  if (process.env['NODE_ENV'] === 'test' || process.env['VITEST']) {
    return 'workspace:*';
  }

  // 1. Try to query using local npm CLI command first because it natively uses the configured registry & auth
  try {
    const { stdout } = await execa('npm', ['view', '@dz-web/esboot', 'version']);
    const version = stdout.trim();
    if (version) {
      return `^${version}`;
    }
  } catch (err) {
    // ignore
  }

  // 2. Try fetching from user's configured registry via HTTP fetch
  try {
    const { stdout: registryStdout } = await execa('npm', ['config', 'get', 'registry']);
    let registry = registryStdout.trim();
    if (registry) {
      if (!registry.endsWith('/')) {
        registry += '/';
      }
      const response = await fetch(`${registry}@dz-web/esboot/latest`);
      if (response.ok) {
        const data = (await response.json()) as { version?: string };
        if (data.version) {
          return `^${data.version}`;
        }
      }
    }
  } catch (err) {
    // ignore
  }

  // 3. Fallback to the version declared in the codemod package itself
  try {
    const selfPkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
    if (fs.existsSync(selfPkgPath)) {
      const selfPkg = fs.readJsonSync(selfPkgPath);
      if (selfPkg.version) {
        return `^${selfPkg.version}`;
      }
    }
  } catch (err) {
    // ignore
  }

  return '^4.0.0'; // final fallback
}

function getMainConfig(sourceFile: SourceFile) {
  const defineConfigCall = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).find(call => {
    const expr = call.getExpression();
    return expr.getText() === 'defineConfig';
  });

  if (!defineConfigCall) {
    return sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)[0];
  }

  const arg = defineConfigCall.getArguments()[0];
  if (!arg) return undefined;

  if (arg.getKind() === SyntaxKind.ObjectLiteralExpression) {
    return arg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  }

  if (arg.getKind() === SyntaxKind.ArrowFunction || arg.getKind() === SyntaxKind.FunctionExpression) {
    const body = arg.getKind() === SyntaxKind.ArrowFunction
      ? arg.asKindOrThrow(SyntaxKind.ArrowFunction).getBody()
      : arg.asKindOrThrow(SyntaxKind.FunctionExpression).getBody();

    if (body.getKind() === SyntaxKind.ObjectLiteralExpression) {
      return body.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    }
    if (body.getKind() === SyntaxKind.Block) {
      const returnStmt = body.asKindOrThrow(SyntaxKind.Block).getStatements().find(s => s.getKind() === SyntaxKind.ReturnStatement);
      if (returnStmt) {
        const expression = returnStmt.asKindOrThrow(SyntaxKind.ReturnStatement).getExpression();
        if (expression) {
          if (expression.getKind() === SyntaxKind.ObjectLiteralExpression) {
            return expression.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
          }
          if (expression.getKind() === SyntaxKind.Identifier) {
            const name = expression.getText();
            const variableDec = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).find(vd => vd.getName() === name);
            if (variableDec) {
              const initializer = variableDec.getInitializer();
              if (initializer && initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
                return initializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
              }
            }
          }
        }
      }
    }
  }

  // Fallback: search for object literals containing typical config keys
  const allObjects = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
  const bestCandidate = allObjects.find(obj => {
    const properties = obj.getProperties().map(p => {
      if (p.getKind() === SyntaxKind.PropertyAssignment) {
        return p.asKindOrThrow(SyntaxKind.PropertyAssignment).getName();
      }
      return '';
    });
    return properties.includes('plugins') || properties.includes('px2rem') || properties.includes('server') || properties.includes('isSP');
  });
  if (bestCandidate) return bestCandidate;

  return allObjects[0];
}

export async function upgradeV4(options: UpgradeOptions) {
  const cwd = resolve(options.cwd);
  const keepTailwind3 = options.keepTailwind3 ?? true;
  const migrationSummary: string[] = [];
  const addSummaryItem = (item: string): void => {
    if (!migrationSummary.includes(item)) {
      migrationSummary.push(item);
    }
  };
  console.log(kleur.cyan(`\n🚀 Starting upgrade to ESBoot v4 in: ${cwd}`));

  // 1. Git workspace cleanliness check
  console.log(kleur.blue('Checking Git workspace status...'));
  try {
    const { stdout } = await execa('git', ['status', '--porcelain'], { cwd });
    if (stdout.trim().length > 0) {
      throw new Error('Your git working directory is not clean. Please commit or stash your changes first.');
    }
  }
  catch (err: any) {
    if (err.message.includes('not a git repository')) {
      console.warn(kleur.yellow('⚠️ Warning: Not a git repository. Proceeding without Git status check.'));
    }
    else {
      throw err;
    }
  }

  // 2. package.json updates
  const pkgPath = join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`package.json not found in ${cwd}`);
  }

  console.log(kleur.blue('Updating package.json dependencies and configurations...'));
  const pkg = fs.readJsonSync(pkgPath);
 
  // Check current ESBoot version
  const currentEsbootVersion = pkg.dependencies?.['@dz-web/esboot'] || pkg.devDependencies?.['@dz-web/esboot'];
  if (!currentEsbootVersion) {
    console.log(kleur.yellow('This directory does not appear to be an ESBoot project. Skipping migration.'));
    return 'not-esboot-project';
  }
 
  if (currentEsbootVersion !== 'workspace:*') {
    const match = currentEsbootVersion.match(/(\d+)\.\d+\.\d+/);
    if (match) {
      const major = Number.parseInt(match[1], 10);
      if (major >= 4) {
        console.log(kleur.green(`Your project is already running ESBoot v${major} (version: ${currentEsbootVersion}). No upgrade needed.`));
        return 'already-latest';
      }
      if (major < 3) {
        throw new Error(`Your project is running ESBoot v${major} (version: ${currentEsbootVersion}). This tool only supports upgrading from ESBoot v3 to v4. Please upgrade to ESBoot v3 first.`);
      }
    } else {
      const simpleMatch = currentEsbootVersion.match(/\d+/);
      if (simpleMatch) {
        const major = Number.parseInt(simpleMatch[0], 10);
        if (major >= 4) {
          console.log(kleur.green(`Your project is already running ESBoot v${major} (version: ${currentEsbootVersion}). No upgrade needed.`));
          return 'already-latest';
        }
        if (major < 3) {
          throw new Error(`Your project is running ESBoot v${major} (version: ${currentEsbootVersion}). This tool only supports upgrading from ESBoot v3 to v4. Please upgrade to ESBoot v3 first.`);
        }
      }
    }
  }

  // Upgrade pinned node and pnpm versions if they exist
  if (pkg.volta) {
    if (pkg.volta.node) {
      pkg.volta.node = '22.13.0';
      console.log(kleur.yellow('Upgraded volta.node config to 22.13.0'));
    }
    if (pkg.volta.pnpm) {
      pkg.volta.pnpm = '10.24.0';
      console.log(kleur.yellow('Upgraded volta.pnpm config to 10.24.0'));
    }
  }

  if (pkg.packageManager) {
    if (pkg.packageManager.startsWith('pnpm@')) {
      pkg.packageManager = 'pnpm@10.24.0';
      console.log(kleur.yellow('Upgraded packageManager config to pnpm@10.24.0'));
    }
  }

  if (pkg.engines) {
    if (pkg.engines.node) {
      pkg.engines.node = '>=22.13.0';
      console.log(kleur.yellow('Upgraded engines.node config to >=22.13.0'));
    }
    if (pkg.engines.pnpm) {
      pkg.engines.pnpm = '>=10.24.0';
      console.log(kleur.yellow('Upgraded engines.pnpm config to >=10.24.0'));
    }
  }

  const nvmrcPath = join(cwd, '.nvmrc');
  if (fs.existsSync(nvmrcPath)) {
    fs.writeFileSync(nvmrcPath, '22.13.0\n', 'utf-8');
    console.log(kleur.yellow('Upgraded .nvmrc node version to 22.13.0'));
  }

  const nodeVersionPath = join(cwd, '.node-version');
  if (fs.existsSync(nodeVersionPath)) {
    fs.writeFileSync(nodeVersionPath, '22.13.0\n', 'utf-8');
    console.log(kleur.yellow('Upgraded .node-version node version to 22.13.0'));
  }

  // Upgrade ESBoot packages to the resolved version
  const esbootVersion = await getEsbootVersion();
  const esbootPackages = [
    '@dz-web/esboot',
    '@dz-web/esboot-bundler-vite',
    '@dz-web/esboot-bundler-webpack',
    '@dz-web/esboot-bundler-rspack',
    '@dz-web/esboot-browser',
    '@dz-web/esboot-browser-react',
    '@dz-web/esboot-plugin-docs',
    '@dz-web/esboot-plugin-vitest',
  ];

  const updateDeps = (depsObj: Record<string, string> | undefined) => {
    if (!depsObj)
      return;
    if (depsObj['@dz-web/esboot-bundler-webpack']) {
      delete depsObj['@dz-web/esboot-bundler-webpack'];
      depsObj['@dz-web/esboot-bundler-rspack'] = esbootVersion;
      addSummaryItem(`replaced @dz-web/esboot-bundler-webpack with @dz-web/esboot-bundler-rspack`);
      console.log(kleur.yellow('Replaced @dz-web/esboot-bundler-webpack with @dz-web/esboot-bundler-rspack in package.json.'));
    }
    for (const pkgName of esbootPackages) {
      if (depsObj[pkgName]) {
        depsObj[pkgName] = esbootVersion;
        addSummaryItem(`upgraded ${pkgName} to ${esbootVersion}`);
      }
    }
    // Remove normalize.css from dependencies
    if (depsObj['normalize.css']) {
      delete depsObj['normalize.css'];
      console.log(kleur.yellow('Removed normalize.css from package.json dependencies (built-in in v4).'));
      addSummaryItem('removed normalize.css');
    }
    if (depsObj.eslint) {
      depsObj.eslint = ESLINT_VERSION;
      console.log(kleur.yellow(`Upgraded eslint dependency to ${ESLINT_VERSION}.`));
      addSummaryItem(`upgraded eslint to ${ESLINT_VERSION}`);
    }
    if (depsObj.stylelint) {
      depsObj.stylelint = STYLELINT_VERSION;
      console.log(kleur.yellow(`Upgraded stylelint dependency to ${STYLELINT_VERSION}.`));
      addSummaryItem(`upgraded stylelint to ${STYLELINT_VERSION}`);
    }
  };

  updateDeps(pkg.dependencies);
  updateDeps(pkg.devDependencies);

  // Upgrade scripts containing webpack to rspack
  if (pkg.scripts) {
    for (const key of Object.keys(pkg.scripts)) {
      let val = pkg.scripts[key];
      let newKey = key;
      let changed = false;

      if (key.includes('webpack')) {
        newKey = key.replace(/webpack/g, 'rspack');
        changed = true;
      } else if (key.includes('Webpack')) {
        newKey = key.replace(/Webpack/g, 'Rspack');
        changed = true;
      }

      if (val.includes('webpack')) {
        val = val.replace(/webpack/g, 'rspack');
        changed = true;
      }
      if (val.includes('Webpack')) {
        val = val.replace(/Webpack/g, 'Rspack');
        changed = true;
      }

      if (changed) {
        delete pkg.scripts[key];
        pkg.scripts[newKey] = val;
        console.log(kleur.yellow(`Updated script: ${key} -> ${newKey}: ${val}`));
        addSummaryItem(`updated script ${key} to ${newKey}`);
      }
    }
  }


  // If keeping Tailwind v3, add compatibility plugin
  if (keepTailwind3) {
    if (!pkg.devDependencies)
      pkg.devDependencies = {};
    pkg.devDependencies['@dz-web/esboot-plugin-tailwind3'] = esbootVersion;
    console.log(kleur.yellow('Added @dz-web/esboot-plugin-tailwind3 dependency for compatibility.'));
  }

  // Remove deprecated eslintConfig
  if (pkg.eslintConfig) {
    delete pkg.eslintConfig;
    console.log(kleur.yellow('Removed legacy eslintConfig block from package.json.'));
  }

  // Update lint/prettier configuration paths
  if (pkg.prettier) {
    pkg.prettier = './node_modules/.cache/esboot/prettier';
  }
  if (pkg.stylelint && pkg.stylelint.extends) {
    pkg.stylelint.extends = ['./node_modules/.cache/esboot/stylelint'];
  }
  if (pkg.commitlint && pkg.commitlint.extends) {
    pkg.commitlint.extends = ['./node_modules/.cache/esboot/commitlint'];
  }

  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

  // 3. Flat Config (eslint.config.mjs)
  console.log(kleur.blue('Setting up ESLint flat configuration...'));
  const eslintConfigPath = join(cwd, 'eslint.config.mjs');
  fs.writeFileSync(
    eslintConfigPath,
    `import { createConfig } from '@dz-web/esboot/eslint';\n\nexport default createConfig();\n`,
  );

  const legacyHuskyPath = join(cwd, '.husky');
  if (fs.existsSync(legacyHuskyPath)) {
    fs.removeSync(legacyHuskyPath);
    console.log(kleur.yellow('Removed legacy root .husky directory.'));
    addSummaryItem('removed legacy root .husky');
  }

  const configHuskyPath = join(cwd, 'config/.husky');
  for (const hookName of ['pre-commit', 'commit-msg']) {
    const hookPath = join(configHuskyPath, hookName);
    if (!fs.existsSync(hookPath)) {
      continue;
    }

    fs.chmodSync(hookPath, 0o755);
    console.log(kleur.yellow(`Set executable permission on config/.husky/${hookName}.`));
    addSummaryItem(`made config/.husky/${hookName} executable`);
  }

  // Delete old eslint files
  const oldEslintFiles = [
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
  ];
  for (const filename of oldEslintFiles) {
    const p = join(cwd, filename);
    if (fs.existsSync(p)) {
      fs.removeSync(p);
      console.log(kleur.yellow(`Deleted legacy configuration: ${filename}`));
    }
  }

  // 4. Stylesheet entry rename and Tailwind directives transition
  console.log(kleur.blue('Migrating stylesheets and entry file imports...'));
  const stylesDir = join(cwd, 'src/styles');
  const mainScssPath = join(stylesDir, 'main.scss');
  const mainCssPath = join(stylesDir, 'main.css');
  const indexScssPath = join(stylesDir, 'index.scss');
  const indexCssPath = join(stylesDir, 'index.css');

  let activeStyleEntry = '';

  if (fs.existsSync(mainScssPath)) {
    fs.renameSync(mainScssPath, indexScssPath);
    activeStyleEntry = indexScssPath;
    console.log(kleur.yellow('Renamed src/styles/main.scss -> index.scss'));
  }
  else if (fs.existsSync(mainCssPath)) {
    fs.renameSync(mainCssPath, indexCssPath);
    activeStyleEntry = indexCssPath;
    console.log(kleur.yellow('Renamed src/styles/main.css -> index.css'));
  }
  else if (fs.existsSync(indexScssPath)) {
    activeStyleEntry = indexScssPath;
  }
  else if (fs.existsSync(indexCssPath)) {
    activeStyleEntry = indexCssPath;
  }

  // Update entry file imports of main.scss/main.css to index.scss/index.css
  const allFiles = getFilesRecursively(join(cwd, 'src'));
  for (const f of allFiles) {
    if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) {
      let content = fs.readFileSync(f, 'utf-8');
      let changed = false;
      if (content.includes('styles/main.scss')) {
        content = content.replace(/styles\/main\.scss/g, 'styles/index.scss');
        changed = true;
      }
      if (content.includes('styles/main.css')) {
        content = content.replace(/styles\/main\.css/g, 'styles/index.css');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(f, content, 'utf-8');
        console.log(kleur.yellow(`Updated style import path in: ${relative(cwd, f)}`));
      }
    }
  }

  // Rewrite Tailwind directives and remove normalize.css from style entry
  if (activeStyleEntry) {
    let styleContent = fs.readFileSync(activeStyleEntry, 'utf-8');

    // Remove normalize.css imports
    const normalizeImportRe = /@import\s+['"]~?normalize\.css(?:\/normalize\.css)?['"];?/g;
    if (normalizeImportRe.test(styleContent)) {
      styleContent = styleContent.replace(normalizeImportRe, '');
      console.log(kleur.yellow(`Removed normalize.css import from: ${relative(cwd, activeStyleEntry)}`));
    }

    const localNormalizeUseRe = /@use\s+['"]\.\/normalize['"];?\s*/g;
    if (localNormalizeUseRe.test(styleContent)) {
      styleContent = styleContent.replace(localNormalizeUseRe, '');
      console.log(kleur.yellow(`Removed local normalize style usage from: ${relative(cwd, activeStyleEntry)}`));
      addSummaryItem('removed local normalize stylesheet usage');
    }

    // Replace Tailwind directives
    const tailwindDirectivesRe = /@tailwind\s+(?:base|components|utilities);?/g;
    if (tailwindDirectivesRe.test(styleContent)) {
      styleContent = styleContent.replace(tailwindDirectivesRe, '');
      styleContent = `@use '@dz-web/esboot-browser';\n${styleContent}`;
      console.log(kleur.yellow(`Upgraded Tailwind CSS directives to @use '@dz-web/esboot-browser' in: ${relative(cwd, activeStyleEntry)}`));
    }

    fs.writeFileSync(activeStyleEntry, styleContent, 'utf-8');
  }

  // Convert @import to @use in all .scss and .css files under src
  for (const f of allFiles) {
    if (f.endsWith('.scss') || f.endsWith('.css')) {
      let content = fs.readFileSync(f, 'utf-8');
      if (content.includes('@import')) {
        content = content.replace(/@import\s+/g, '@use ');
        fs.writeFileSync(f, content, 'utf-8');
        console.log(kleur.yellow(`Updated @import to @use in: ${relative(cwd, f)}`));
        addSummaryItem(`replaced @import with @use in ${relative(cwd, f)}`);
      }
    }
  }

  const legacyLocalNormalizePath = join(stylesDir, '_normalize.scss');
  if (fs.existsSync(legacyLocalNormalizePath)) {
    fs.removeSync(legacyLocalNormalizePath);
    console.log(kleur.yellow(`Removed legacy local normalize stylesheet: ${relative(cwd, legacyLocalNormalizePath)}`));
    addSummaryItem('removed src/styles/_normalize.scss');
  }

  // 4.5. Check and create platform-specific helper placeholder files for MP projects
  const platformsDir = join(cwd, 'src/platforms');
  if (fs.existsSync(platformsDir)) {
    console.log(kleur.blue('Checking and creating platform helper placeholder files for MP projects...'));
    const platforms = fs.readdirSync(platformsDir);
    for (const platformName of platforms) {
      const platformPath = join(platformsDir, platformName);
      if (fs.statSync(platformPath).isDirectory()) {
        if (platformName.startsWith('.') || platformName.startsWith('_')) {
          continue;
        }

        const platformHelpersDir = join(platformPath, 'helpers');
        const multiPlatformFile = join(platformHelpersDir, 'multi-platforms.ts');
        if (!fs.existsSync(multiPlatformFile)) {
          fs.ensureDirSync(platformHelpersDir);
          fs.writeFileSync(
            multiPlatformFile,
            `// Placeholder module for shared ${platformName} exports.\n// Native-specific implementations are re-exported from \`@${platformName}-native/helpers/multi-platforms\`.\n`,
            'utf-8',
          );
          console.log(kleur.yellow(`Created placeholder helper for platform '${platformName}': src/platforms/${platformName}/helpers/multi-platforms.ts`));
          addSummaryItem(`created missing platform helper placeholder for ${platformName}`);
        }
      }
    }
  }

  // 4.6. Fill in missing lang/locales files (zh-CN.json, zh-TW.json, en-US.json) in existing platforms/pageTypes directories
  const i18nLanguages = ['zh-CN', 'zh-TW', 'en-US'];
  const isLocales = fs.existsSync(join(cwd, 'src/locales'));
  const langFolderName = isLocales ? 'locales' : 'lang';

  const ensureLangFiles = (dir: string) => {
    fs.ensureDirSync(dir);
    for (const lang of i18nLanguages) {
      const file = join(dir, `${lang}.json`);
      if (!fs.existsSync(file)) {
        fs.writeJsonSync(file, {}, { spaces: 2 });
        console.log(kleur.yellow(`Created missing translation file: ${relative(cwd, file)}`));
        addSummaryItem(`created missing translation file ${lang}.json in ${relative(cwd, dir)}`);
      }
    }
  };

  ensureLangFiles(join(cwd, 'src', langFolderName));

  if (fs.existsSync(platformsDir)) {
    const platforms = fs.readdirSync(platformsDir);
    for (const platformName of platforms) {
      const platformPath = join(platformsDir, platformName);
      if (fs.statSync(platformPath).isDirectory()) {
        if (platformName.startsWith('.') || platformName.startsWith('_')) {
          continue;
        }

        ensureLangFiles(join(platformPath, langFolderName));

        const platformSubdirs = fs.readdirSync(platformPath);
        for (const subDir of platformSubdirs) {
          if (subDir.startsWith('_')) {
            const pageTypePath = join(platformPath, subDir);
            if (fs.statSync(pageTypePath).isDirectory()) {
              ensureLangFiles(join(pageTypePath, langFolderName));
            }
          }
        }
      }
    }
  }

  // 5. .esbootrc.ts AST Transformation
  const esbootrcPath = join(cwd, '.esbootrc.ts');
  if (fs.existsSync(esbootrcPath)) {
    console.log(kleur.blue('Parsing and updating .esbootrc.ts configuration...'));
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(esbootrcPath);
    const importDeclarations = sourceFile.getImportDeclarations();
    const getModuleStatementInsertIndex = (): number => {
      return sourceFile.getStatements().findIndex(statement => statement.getKind() !== SyntaxKind.ImportDeclaration);
    };
    const upsertRegexArrayConstant = (constName: string, valueText: string): void => {
      const existingDeclaration = sourceFile.getVariableDeclaration(constName);
      if (existingDeclaration) {
        existingDeclaration.setInitializer(valueText);
        return;
      }

      const statementIndex = getModuleStatementInsertIndex();
      sourceFile.insertVariableStatement(statementIndex === -1 ? sourceFile.getStatements().length : statementIndex, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: constName,
            initializer: valueText,
          },
        ],
      });
    };
    const hoistRegexArrayProperty = (propertyName: string, constName: string, propertyAssignment: any): void => {
      const initializer = propertyAssignment?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (!initializer) {
        return;
      }

      const elements = initializer.getElements();
      if (elements.length === 0 || elements.some(element => element.getKind() !== SyntaxKind.RegularExpressionLiteral)) {
        return;
      }

      upsertRegexArrayConstant(constName, initializer.getText());
      propertyAssignment.setInitializer(constName);
    };

    for (const importDeclaration of importDeclarations) {
      if (importDeclaration.getModuleSpecifierValue() !== '@dz-web/esboot-bundler-webpack') {
        continue;
      }

      const babelPluginImport = importDeclaration.getNamedImports().find(namedImport => {
        return namedImport.getName() === 'BabelPlugin';
      });

      if (!babelPluginImport) {
        continue;
      }

      const esbootTypeImport = sourceFile.getImportDeclarations().find((declaration) => {
        return declaration.getModuleSpecifierValue() === '@dz-web/esboot' && declaration.isTypeOnly();
      });

      if (esbootTypeImport) {
        const hasBabelPlugin = esbootTypeImport.getNamedImports().some((namedImport) => {
          return namedImport.getName() === 'BabelPlugin';
        });
        if (!hasBabelPlugin) {
          esbootTypeImport.addNamedImport('BabelPlugin');
        }
      }
      else {
        sourceFile.insertImportDeclaration(1, {
          isTypeOnly: true,
          moduleSpecifier: '@dz-web/esboot',
          namedImports: ['BabelPlugin'],
        });
      }

      babelPluginImport.remove();
      if (
        importDeclaration.getNamedImports().length === 0
        && !importDeclaration.getDefaultImport()
        && !importDeclaration.getNamespaceImport()
      ) {
        importDeclaration.remove();
      }
    }

    const propertyAssignments = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
    const usesProcess = sourceFile.getFullText().includes('process.');
    const hasProcessImport = sourceFile.getImportDeclarations().some((declaration) => {
      return declaration.getModuleSpecifierValue() === 'node:process';
    });

    if (usesProcess && !hasProcessImport) {
      const typeImports = sourceFile.getImportDeclarations().filter(declaration => declaration.isTypeOnly());
      const statementIndex = typeImports.length > 0
        ? sourceFile.getStatements().indexOf(typeImports.at(-1)!) + 1
        : 0;
      sourceFile.insertImportDeclaration(statementIndex, {
        defaultImport: 'process',
        moduleSpecifier: 'node:process',
      });
    }

    const extraBabelIncludesProperty = propertyAssignments.find((propertyAssignment) => {
      return propertyAssignment.getName() === 'extraBabelIncludes';
    });
    if (extraBabelIncludesProperty) {
      hoistRegexArrayProperty('extraBabelIncludes', 'EXTRA_BABEL_INCLUDES', extraBabelIncludesProperty);
    }

    const px2remProperty = propertyAssignments.find((propertyAssignment) => {
      return propertyAssignment.getName() === 'px2rem';
    });
    const px2remObject = px2remProperty?.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    const px2remExcludeProperty = px2remObject?.getProperty('exclude')?.asKind(SyntaxKind.PropertyAssignment);
    if (px2remExcludeProperty) {
      hoistRegexArrayProperty('exclude', 'PX2REM_EXCLUDE', px2remExcludeProperty);
    }

    // port string-to-number check
    for (const pa of propertyAssignments) {
      if (pa.getName() === 'port') {
        const parent = pa.getParentIfKind(SyntaxKind.ObjectLiteralExpression);
        const serverPa = parent?.getParentIfKind(SyntaxKind.PropertyAssignment);
        if (serverPa && serverPa.getName() === 'server') {
          const initializer = pa.getInitializer();
          if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
            const val = initializer.getText().replace(/['"]/g, '');
            const numVal = Number.parseInt(val, 10);
            if (!isNaN(numVal)) {
              pa.setInitializer(String(numVal));
              console.log(kleur.yellow(`Converted server.port string '${val}' to number ${numVal}.`));
            }
          }
        }
      }
    }

    // Tailwind v3 compatibility plugin integration
    if (keepTailwind3) {
      const hasImport = sourceFile.getImportDeclarations().some(
        decl => decl.getModuleSpecifierValue() === '@dz-web/esboot-plugin-tailwind3',
      );
      if (!hasImport) {
        sourceFile.addImportDeclaration({
          defaultImport: 'pluginTailwind3',
          moduleSpecifier: '@dz-web/esboot-plugin-tailwind3',
        });
      }

      let initializerText = 'pluginTailwind3()';
      const tailwindcssOptionsPa = propertyAssignments.find(pa => pa.getName() === 'tailwindcssOptions');
      if (tailwindcssOptionsPa) {
        const optionsText = tailwindcssOptionsPa.getInitializer()?.getText();
        if (optionsText) {
          initializerText = `pluginTailwind3({
      tailwindcssOptions: ${optionsText}
    })`;
        }
        tailwindcssOptionsPa.remove();
        console.log(kleur.yellow('Migrated tailwindcssOptions to pluginTailwind3 parameters.'));
      }

      const pluginsPa = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment).find(pa => pa.getName() === 'plugins');
      if (pluginsPa) {
        const init = pluginsPa.getInitializer();
        if (init && init.getKind() === SyntaxKind.ArrayLiteralExpression) {
          const arr = init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
          const hasPlugin = arr.getElements().some(el => el.getText().includes('pluginTailwind3'));
          if (!hasPlugin) {
            arr.addElement(initializerText);
            console.log(kleur.yellow('Registered pluginTailwind3() to esbootrc plugins.'));
          }
        }
      }
      else {
        const mainConfig = getMainConfig(sourceFile);
        if (mainConfig) {
          mainConfig.addPropertyAssignment({
            name: 'plugins',
            initializer: `[${initializerText}]`,
          });
          console.log(kleur.yellow('Created plugins property list with pluginTailwind3() in esbootrc.'));
        }
      }
    }

    // React < 19 experimental.reactCompiler config integration
    let isReactBelow19 = false;
    const reactVersion = pkg.dependencies?.react || pkg.devDependencies?.react;
    if (reactVersion) {
      const match = reactVersion.match(/\d+/);
      if (match) {
        const major = Number.parseInt(match[0], 10);
        if (major < 19) {
          isReactBelow19 = true;
        }
      }
    }

    if (isReactBelow19) {
      const mainConfig = getMainConfig(sourceFile);
      if (mainConfig) {
        const experimentalProp = mainConfig.getProperty('experimental');
        if (!experimentalProp) {
          mainConfig.addPropertyAssignment({
            name: 'experimental',
            initializer: `{
    reactCompiler: {
      enable: false,
      target: '18',
    },
  }`,
          });
          console.log(kleur.yellow('Added experimental.reactCompiler config for React version < 19.'));
        }
        else if (experimentalProp.getKind() === SyntaxKind.PropertyAssignment) {
          const pa = experimentalProp.asKindOrThrow(SyntaxKind.PropertyAssignment);
          const init = pa.getInitializer();
          if (init && init.getKind() === SyntaxKind.ObjectLiteralExpression) {
            const obj = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
            if (!obj.getProperty('reactCompiler')) {
              obj.addPropertyAssignment({
                name: 'reactCompiler',
                initializer: `{
      enable: false,
      target: '18',
    }`,
              });
              console.log(kleur.yellow('Added reactCompiler config to existing experimental block for React version < 19.'));
            }
          }
        }
      }
    }

    // Add default svgrOptions: { icon: true }
    const mainConfig = getMainConfig(sourceFile);
    if (mainConfig) {
      const svgrOptionsProp = mainConfig.getProperty('svgrOptions');
      if (!svgrOptionsProp) {
        mainConfig.addPropertyAssignment({
          name: 'svgrOptions',
          initializer: `{
    icon: true,
  }`,
        });
        console.log(kleur.yellow('Added default svgrOptions: { icon: true } to esbootrc.'));
        addSummaryItem('added default svgrOptions: { icon: true }');
      } else if (svgrOptionsProp.getKind() === SyntaxKind.PropertyAssignment) {
        const pa = svgrOptionsProp.asKindOrThrow(SyntaxKind.PropertyAssignment);
        const init = pa.getInitializer();
        if (init && init.getKind() === SyntaxKind.ObjectLiteralExpression) {
          const obj = init.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
          if (!obj.getProperty('icon')) {
            obj.addPropertyAssignment({
              name: 'icon',
              initializer: 'true',
            });
            console.log(kleur.yellow('Added icon: true to existing svgrOptions in esbootrc.'));
            addSummaryItem('added icon: true to existing svgrOptions');
          }
        }
      }
    }

    sourceFile.saveSync();

    // Webpack to Rspack text migration in .esbootrc.ts
    let rcContent = fs.readFileSync(esbootrcPath, 'utf-8');
    let rcChanged = false;
    if (rcContent.includes('webpack') || rcContent.includes('Webpack') || rcContent.includes('WEBPACK')) {
      rcContent = rcContent.replace(/webpack/g, 'rspack');
      rcContent = rcContent.replace(/Webpack/g, 'Rspack');
      rcContent = rcContent.replace(/WEBPACK/g, 'RSPACK');
      rcChanged = true;
      console.log(kleur.yellow('Migrated Webpack references to Rspack in .esbootrc.ts'));
      addSummaryItem('migrated Webpack references to Rspack in .esbootrc.ts');
    }
    if (rcChanged) {
      fs.writeFileSync(esbootrcPath, rcContent, 'utf-8');
    }
  }

  // 6. E2E Verification Runner
  console.log(kleur.blue('\nRunning package dependencies installation (pnpm install)...'));
  await execa('pnpm', ['install', '--filter', '.'], { cwd, stdio: 'inherit' });

  console.log(kleur.blue('\nGenerating configurations (pnpm exec esboot prepare)...'));
  await execa('pnpm', ['exec', 'esboot', 'prepare'], { cwd, stdio: 'inherit' });

  console.log(kleur.blue('\nVerifying production build (pnpm exec esboot build)...'));
  await execa('pnpm', ['exec', 'esboot', 'build'], { cwd, stdio: 'inherit' });
  console.log(kleur.green('✓ Production build completed successfully.'));

  if (migrationSummary.length > 0) {
    console.log(kleur.cyan('\nMigration summary'));
    for (const item of migrationSummary) {
      console.log(`- ${item}`);
    }
  }
}

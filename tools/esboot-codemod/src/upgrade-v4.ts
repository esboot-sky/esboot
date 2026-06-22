import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';
import kleur from 'kleur';
import { Project, SyntaxKind } from 'ts-morph';

export interface UpgradeOptions {
  cwd: string;
  keepTailwind3?: boolean;
}

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

export async function upgradeV4(options: UpgradeOptions) {
  const cwd = resolve(options.cwd);
  const keepTailwind3 = options.keepTailwind3 ?? true;
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
    for (const pkgName of esbootPackages) {
      if (depsObj[pkgName]) {
        depsObj[pkgName] = esbootVersion;
      }
    }
    // Remove normalize.css from dependencies
    if (depsObj['normalize.css']) {
      delete depsObj['normalize.css'];
      console.log(kleur.yellow('Removed normalize.css from package.json dependencies (built-in in v4).'));
    }
  };

  updateDeps(pkg.dependencies);
  updateDeps(pkg.devDependencies);

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

    // Replace Tailwind directives
    const tailwindDirectivesRe = /@tailwind\s+(?:base|components|utilities);?/g;
    if (tailwindDirectivesRe.test(styleContent)) {
      styleContent = styleContent.replace(tailwindDirectivesRe, '');
      styleContent = `@use '@dz-web/esboot-browser';\n${styleContent}`;
      console.log(kleur.yellow(`Upgraded Tailwind CSS directives to @use '@dz-web/esboot-browser' in: ${relative(cwd, activeStyleEntry)}`));
    }

    fs.writeFileSync(activeStyleEntry, styleContent, 'utf-8');
  }

  // 5. .esbootrc.ts AST Transformation
  const esbootrcPath = join(cwd, '.esbootrc.ts');
  if (fs.existsSync(esbootrcPath)) {
    console.log(kleur.blue('Parsing and updating .esbootrc.ts configuration...'));
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(esbootrcPath);

    const propertyAssignments = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAssignment);

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

      const pluginsPa = propertyAssignments.find(pa => pa.getName() === 'plugins');
      if (pluginsPa) {
        const init = pluginsPa.getInitializer();
        if (init && init.getKind() === SyntaxKind.ArrayLiteralExpression) {
          const arr = init.asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
          const hasPlugin = arr.getElements().some(el => el.getText().includes('pluginTailwind3'));
          if (!hasPlugin) {
            arr.addElement('pluginTailwind3()');
            console.log(kleur.yellow('Registered pluginTailwind3() to esbootrc plugins.'));
          }
        }
      }
      else {
        const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
        const mainConfig = objectLiterals[0];
        if (mainConfig) {
          mainConfig.addPropertyAssignment({
            name: 'plugins',
            initializer: '[pluginTailwind3()]',
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
      const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
      const mainConfig = objectLiterals[0];
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

    sourceFile.saveSync();
  }

  // 6. E2E Verification Runner
  console.log(kleur.blue('\nRunning package dependencies installation (pnpm install)...'));
  await execa('pnpm', ['install'], { cwd, stdio: 'inherit' });

  console.log(kleur.blue('\nGenerating configurations (npx esboot prepare)...'));
  await execa('npx', ['esboot', 'prepare'], { cwd, stdio: 'inherit' });

  console.log(kleur.blue('\nVerifying production build (npx esboot build)...'));
  await execa('npx', ['esboot', 'build'], { cwd, stdio: 'inherit' });
  console.log(kleur.green('✓ Production build completed successfully.'));

  console.log(kleur.blue('\nVerifying development server (npx esboot dev)...'));
  const devProcess = execa('npx', ['esboot', 'dev'], { cwd });

  const devTimeout = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      devProcess.kill();
      resolve();
    }, 4000);

    devProcess.catch((err) => {
      clearTimeout(timer);
      reject(new Error(`Development server failed to boot: ${err.message}`));
    });

    devProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('ready - started server') || output.includes('started server')) {
        clearTimeout(timer);
        devProcess.kill();
        resolve();
      }
    });
  });

  await devTimeout;
  console.log(kleur.green('✓ Development server verified successfully.'));
}

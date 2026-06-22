import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';
import { Project, SyntaxKind } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import { upgradeV4 } from '../upgrade-v4.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('esboot-codemod upgrade-v4', () => {
  it('should successfully upgrade a v3 project to v4', async () => {
    const fixtureDir = resolve(__dirname, '../../fixtures/v3-app');
    const testDir = resolve(__dirname, '../../../../tmp/esboot-codemod-test');

    // 1. Clean up and recreate test directory
    if (fs.existsSync(testDir)) {
      fs.removeSync(testDir);
    }
    fs.ensureDirSync(testDir);
    fs.copySync(fixtureDir, testDir);

    // Write pinned versions
    const pkgJsonPath = join(testDir, 'package.json');
    const tempPkg = fs.readJsonSync(pkgJsonPath);
    tempPkg.volta = {
      node: '18.16.0',
      pnpm: '8.5.0',
    };
    tempPkg.packageManager = 'pnpm@8.5.0';
    tempPkg.engines = {
      node: '>=18.16.0',
      pnpm: '>=8.5.0',
    };
    tempPkg.dependencies.react = '^18.2.0';
    tempPkg.dependencies['react-dom'] = '^18.2.0';
    fs.writeJsonSync(pkgJsonPath, tempPkg, { spaces: 2 });

    fs.writeFileSync(join(testDir, '.nvmrc'), '18.16.0\n', 'utf-8');
    fs.writeFileSync(join(testDir, '.node-version'), '18.16.0\n', 'utf-8');
    fs.writeFileSync(join(testDir, '.esbootrc.ts'), `import { defineConfig } from '@dz-web/esboot';
import { BundlerVite as Bundler } from '@dz-web/esboot-bundler-vite';

const getBundlerViteOptions = (cfg) => {
  return {
    bundlerOptions: {
      codeSplitting: {},
    },
  };
};

export default defineConfig((cfg) => {
  const config = {
    bundler: Bundler,
    ...getBundlerViteOptions(cfg),
    isSP: false,
    alias: {
      '@@': 'src',
    },
    server: {
      port: '14200',
      http2: false,
    },
    experimental: {
      someOtherProp: true,
    },
  };
  return config;
});
`, 'utf-8');

    // 2. Initialize a git repository in the test directory to test clean git check
    await execa('git', ['init'], { cwd: testDir });
    await execa('git', ['config', 'user.name', 'Test User'], { cwd: testDir });
    await execa('git', ['config', 'user.email', 'test@example.com'], { cwd: testDir });
    await execa('git', ['add', '.'], { cwd: testDir });
    await execa('git', ['commit', '-m', 'initial commit'], { cwd: testDir });

    // 3. Test git dirty check by modifying a file
    const mainScssPath = join(testDir, 'src/styles/main.scss');
    fs.appendFileSync(mainScssPath, '\n/* dirty change */');
    await expect(upgradeV4({ cwd: testDir, keepTailwind3: false })).rejects.toThrow(
      'Your git working directory is not clean',
    );

    // Reset the dirty change
    await execa('git', ['checkout', '--', '.'], { cwd: testDir });

    // 4. Run the upgrade script
    await upgradeV4({ cwd: testDir });

    // 5. Assert package.json updates
    const pkg = fs.readJsonSync(join(testDir, 'package.json'));
    expect(pkg.dependencies['@dz-web/esboot-browser']).toBe('workspace:*');
    expect(pkg.devDependencies['@dz-web/esboot']).toBe('workspace:*');
    expect(pkg.devDependencies['@dz-web/esboot-bundler-vite']).toBe('workspace:*');
    expect(pkg.devDependencies['@dz-web/esboot-plugin-tailwind3']).toBe('workspace:*');
    expect(pkg.dependencies['normalize.css']).toBeUndefined();
    expect(pkg.eslintConfig).toBeUndefined();
    expect(pkg.prettier).toBe('./node_modules/.cache/esboot/prettier');
    expect(pkg.stylelint.extends).toEqual(['./node_modules/.cache/esboot/stylelint']);
    expect(pkg.commitlint.extends).toEqual(['./node_modules/.cache/esboot/commitlint']);

    expect(pkg.volta.node).toBe('22.13.0');
    expect(pkg.volta.pnpm).toBe('10.24.0');
    expect(pkg.packageManager).toBe('pnpm@10.24.0');
    expect(pkg.engines.node).toBe('>=22.13.0');
    expect(pkg.engines.pnpm).toBe('>=10.24.0');
    expect(fs.readFileSync(join(testDir, '.nvmrc'), 'utf-8').trim()).toBe('22.13.0');
    expect(fs.readFileSync(join(testDir, '.node-version'), 'utf-8').trim()).toBe('22.13.0');

    // 6. Assert ESLint flat config migration
    expect(fs.existsSync(join(testDir, 'eslint.config.mjs'))).toBe(true);
    expect(fs.existsSync(join(testDir, '.eslintrc'))).toBe(false);

    // 7. Assert stylesheet rename and Tailwind directives update
    const indexScssPath = join(testDir, 'src/styles/index.scss');
    expect(fs.existsSync(indexScssPath)).toBe(true);
    expect(fs.existsSync(mainScssPath)).toBe(false);

    const styleContent = fs.readFileSync(indexScssPath, 'utf-8');
    expect(styleContent).toContain('@use \'@dz-web/esboot-browser\';');
    expect(styleContent).not.toContain('@tailwind base;');
    expect(styleContent).not.toContain('@import \'normalize.css\';');

    // 8. Assert entry file imports update
    const entryPath = join(testDir, 'src/platforms/pc/_browser/modules/test.entry.tsx');
    const entryContent = fs.readFileSync(entryPath, 'utf-8');
    expect(entryContent).toContain('import \'@/styles/index.scss\';');
    expect(entryContent).not.toContain('import \'@/styles/main.scss\';');

    // 9. Assert .esbootrc.ts AST modifications
    const esbootrcContent = fs.readFileSync(join(testDir, '.esbootrc.ts'), 'utf-8');
    expect(esbootrcContent).toContain('port: 14200'); // Converted to number
    expect(esbootrcContent).not.toContain('port: \'14200\'');
    expect(esbootrcContent).toContain('import pluginTailwind3 from "@dz-web/esboot-plugin-tailwind3";');
    expect(esbootrcContent).toContain('pluginTailwind3()');

    // Parse the output file and check that the config's experimental block has the reactCompiler
    const testProject = new Project();
    const testSf = testProject.addSourceFileAtPath(join(testDir, '.esbootrc.ts'));
    const defineConfigCall = testSf.getDescendantsOfKind(SyntaxKind.CallExpression).find(call => {
      return call.getExpression().getText() === 'defineConfig';
    });
    expect(defineConfigCall).toBeDefined();
    const func = defineConfigCall!.getArguments()[0].asKindOrThrow(SyntaxKind.ArrowFunction);
    const configVar = func.getDescendantsOfKind(SyntaxKind.VariableDeclaration).find(vd => vd.getName() === 'config');
    expect(configVar).toBeDefined();
    const init = configVar!.getInitializer().asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const experimentalProp = init.getProperty('experimental').asKindOrThrow(SyntaxKind.PropertyAssignment);
    const experimentalObj = experimentalProp.getInitializer().asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    
    // The main config experimental block should have both someOtherProp and reactCompiler
    expect(experimentalObj.getProperty('someOtherProp')).toBeDefined();
    expect(experimentalObj.getProperty('reactCompiler')).toBeDefined();

    // The helper function should NOT have any experimental or reactCompiler property
    const getBundlerViteOptionsFunc = testSf.getDescendantsOfKind(SyntaxKind.VariableDeclaration).find(vd => vd.getName() === 'getBundlerViteOptions');
    expect(getBundlerViteOptionsFunc).toBeDefined();
    const helperInit = getBundlerViteOptionsFunc!.getInitializer().asKindOrThrow(SyntaxKind.ArrowFunction);
    const helperReturn = helperInit.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0];
    const helperObj = helperReturn.getExpression().asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    expect(helperObj.getProperty('experimental')).toBeUndefined();

    // Cleanup after test
    fs.removeSync(testDir);
  }, 120000); // 120s timeout for dependencies installation and build/dev verification

  it('should exit early if the project is already on v4+', async () => {
    const fixtureDir = resolve(__dirname, '../../fixtures/v3-app');
    const testDir = resolve(__dirname, '../../../../tmp/esboot-codemod-test-v4');

    if (fs.existsSync(testDir)) {
      fs.removeSync(testDir);
    }
    fs.ensureDirSync(testDir);
    fs.copySync(fixtureDir, testDir);

    // Write package.json with esboot version v4
    const pkgJsonPath = join(testDir, 'package.json');
    const tempPkg = fs.readJsonSync(pkgJsonPath);
    tempPkg.devDependencies['@dz-web/esboot'] = '^4.0.0';
    fs.writeJsonSync(pkgJsonPath, tempPkg, { spaces: 2 });

    const result = await upgradeV4({ cwd: testDir });
    expect(result).toBe('already-latest');

    fs.removeSync(testDir);
  });

  it('should throw an error if the project is on v2 or lower', async () => {
    const fixtureDir = resolve(__dirname, '../../fixtures/v3-app');
    const testDir = resolve(__dirname, '../../../../tmp/esboot-codemod-test-v2');

    if (fs.existsSync(testDir)) {
      fs.removeSync(testDir);
    }
    fs.ensureDirSync(testDir);
    fs.copySync(fixtureDir, testDir);

    // Write package.json with esboot version v2
    const pkgJsonPath = join(testDir, 'package.json');
    const tempPkg = fs.readJsonSync(pkgJsonPath);
    tempPkg.devDependencies['@dz-web/esboot'] = '^2.1.0';
    fs.writeJsonSync(pkgJsonPath, tempPkg, { spaces: 2 });

    await expect(upgradeV4({ cwd: testDir })).rejects.toThrow(
      /only supports upgrading from ESBoot v3 to v4/
    );

    fs.removeSync(testDir);
  });
});

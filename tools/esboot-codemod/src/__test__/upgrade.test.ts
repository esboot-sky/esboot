import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';
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

    // Cleanup after test
    fs.removeSync(testDir);
  }, 120000); // 120s timeout for dependencies installation and build/dev verification
});

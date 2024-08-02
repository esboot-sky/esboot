const fs = require('fs');
const path = require('path');
const inquirer = require('@inquirer/prompts');
const ejs = require('ejs');

const input = inquirer.input;
const select = inquirer.select;
const confirm = inquirer.confirm;
const checkbox = inquirer.checkbox;
const PLATFORM_TYPES = {
  pc: 'pc',
  mobile: 'mobile',
};

const PAGE_TYPES = {
  native: 'native',
  browser: 'browser',
};

// function get __dirname in mjs
function getDir() {
  return __dirname;
  // return path.dirname(fileURLToPath(import.meta.url));
}

async function promptUser() {
  const platform = await select({
    message: '选择平台',
    choices: [
      {
        name: PLATFORM_TYPES.pc,
        value: PLATFORM_TYPES.pc,
        description: '电脑端页面',
      },
      {
        name: PLATFORM_TYPES.mobile,
        value: PLATFORM_TYPES.mobile,
        description: '手机端页面',
      },
    ],
  });

  const useReactRouter = await confirm({ message: '需要react router?' });

  const pageName = await input({ message: '输入页面英文文件名' });

  const pageTypes = await checkbox({
    message: '选择需要创建的页面类型',
    choices: [
      { name: PAGE_TYPES.native, value: PAGE_TYPES.native, checked: true },
      { name: PAGE_TYPES.browser, value: PAGE_TYPES.browser, checked: true },
    ],
  });

  return {
    platform,
    useReactRouter,
    pageName,
    pageTypes,
  };
}

function copyFile(source, destination, variables) {
  if (fs.existsSync(destination)) {
    throw new Error(`文件 ${destination} 已经存在`);
  }

  const fileContent = fs.readFileSync(source, 'utf8');

  if (path.extname(source) === '.ejs') {
    const renderedContent = ejs.render(fileContent, variables);
    fs.writeFileSync(destination, renderedContent, 'utf8');
  } else {
    fs.writeFileSync(destination, fileContent, 'utf8');
  }
}

async function copyFolder(source, destination, variables) {
  const files = fs.readdirSync(source);

  fs.mkdirSync(destination, { recursive: true });
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(destinationPath, { recursive: true });
      // eslint-disable-next-line no-await-in-loop
      await copyFolder(sourcePath, destinationPath, variables);
    } else {
      copyFile(sourcePath, destinationPath, variables);
    }
  }
}

async function createPage() {
  const answers = await promptUser();

  console.log('参数: ', answers);

  const scriptDir = getDir();

  let srcPagePath = path.join(scriptDir, 'templates');
  let entryPagePath = srcPagePath;
  let targetPlatformPath = path.resolve(process.cwd(), './src/platforms');

  if (answers.platform === PLATFORM_TYPES.mobile) {
    srcPagePath = path.join(srcPagePath, PLATFORM_TYPES.mobile);
    entryPagePath = path.join(entryPagePath, PLATFORM_TYPES.mobile);
    targetPlatformPath = path.join(targetPlatformPath, PLATFORM_TYPES.mobile);
  } else {
    srcPagePath = path.join(srcPagePath, PLATFORM_TYPES.pc);
    entryPagePath = path.join(entryPagePath, PLATFORM_TYPES.pc);
    targetPlatformPath = path.join(targetPlatformPath, PLATFORM_TYPES.pc);
  }

  if (answers.useReactRouter) {
    srcPagePath = path.join(srcPagePath, 'router-demo');
  } else {
    srcPagePath = path.join(srcPagePath, 'trade');
  }

  const distFolderPath = path.join(targetPlatformPath, 'modules', answers.pageName);

  if (fs.existsSync(distFolderPath)) {
    throw new Error(`目录 ${distFolderPath} 已经存在`);
  }

  await copyFolder(srcPagePath, path.join(distFolderPath), {
    pageName: answers.pageName,
  });

  if (answers.pageTypes.includes(PAGE_TYPES.native)) {
    copyFile(
      path.join(entryPagePath, 'native-entry.ejs'),
      path.join(targetPlatformPath, '_native', 'modules', `${answers.pageName}.entry.tsx`),
      {
        pageName: answers.pageName,
      },
    );
  }

  if (answers.pageTypes.includes(PAGE_TYPES.browser)) {
    copyFile(
      path.join(entryPagePath, 'browser-entry.ejs'),
      path.join(targetPlatformPath, '_browser', 'modules', `${answers.pageName}.entry.tsx`),
      {
        pageName: answers.pageName,
      },
    );
  }

  // lang
  const langFolder = path.resolve(process.cwd(), './src/lang');
  const result = [];

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverse(filePath);
      } else if (stats.isFile() && path.extname(file) === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const jsonContent = JSON.parse(fileContent);
          jsonContent[answers.pageName] = {};

          fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
          // result.push(jsonContent);
        } catch (error) {
          console.error(`Error parsing JSON file: ${filePath}`, error);
        }
      }
    });
  }

  traverse(langFolder);
  return result;
}

module.exports = { createPage };

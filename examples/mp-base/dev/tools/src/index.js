const { program } = require('commander');
const { createPage } = require('../src/create-page');

const pkg = require('../package.json');

const run = () => {
  program
    .command('create-page')
    .description('Create a new page')
    .allowUnknownOption(true)
    .action(async () => {
      createPage().catch((error) => {
        console.error(error);
        process.exit(1);
      });
    });

  program.version(pkg.version);
  program.parse(process.argv);
};

module.exports = { run };

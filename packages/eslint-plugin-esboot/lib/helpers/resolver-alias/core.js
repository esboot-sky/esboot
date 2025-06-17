import { builtinModules } from 'node:module';

const coreModules = Object.create(null);
const modules = builtinModules || /* istanbul ignore next */ Object.keys(process.binding('natives')).filter(m => m.indexOf('internal') !== 0);

modules.forEach(function (m) {
  coreModules[m] = true;
});

export default coreModules;
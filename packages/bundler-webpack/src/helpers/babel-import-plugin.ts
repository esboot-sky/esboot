import type { BabelPlugin } from '@dz-web/esboot';
import { createResolvePath } from '@dz-web/esboot-common/helpers';

function isFirstLetterUppercase(word: string): boolean {
  if (!word)
    return false;
  return /^[A-Z]/.test(word.charAt(7));
}

const concatName = (name: string): string => `rsuite/${name}`;
const defaultNoCssComp = ['CustomProvider', 'Whisper'];
const notCompButHavingCss = [concatName('useToaster')];
const resolvePath = createResolvePath(import.meta.resolve);

export function getImportPluginsOfRsuite(
  noCssCompList?: string[],
): BabelPlugin {
  const noImportStyleList = [...defaultNoCssComp, ...(noCssCompList || [])].map(
    name => concatName(name),
  );

  return [
    resolvePath('babel-plugin-import'),
    {
      libraryName: 'rsuite',
      camel2DashComponentName: false,
      customName: (name: string) => {
        return concatName(name);
      },
      style: (name: string) => {
        if (
          !isFirstLetterUppercase(name)
          && !notCompButHavingCss.includes(name)
        ) {
          return false;
        }
        if (noImportStyleList.includes(name))
          return false;
        return `${name}/styles/index.css`;
      },
    },
  ];
}

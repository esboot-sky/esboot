import { AdaptiveText as AdaptiveTextComponent } from '@dz-web/juice-ui-mobile';
import { useMemo } from 'react';

import { useRem2px } from '@/hooks/use-rem2px';

const rootValue = 100;

const AdaptiveText = (props: React.ComponentProps<typeof AdaptiveTextComponent>) => {
  const { fontSize, minFontSize, ...rest } = props;
  const { rem2px } = useRem2px({ rootValue });

  const tranFontSize = useMemo(() => {
    return rem2px(fontSize, false) as number;
  }, [fontSize, rem2px]);

  const tranMinFontSize = useMemo(() => {
    if (!minFontSize) return undefined;

    return rem2px(minFontSize, false) as number;
  }, [minFontSize, rem2px]);

  return <AdaptiveTextComponent {...rest} fontSize={tranFontSize} minFontSize={tranMinFontSize} />;
};

export default AdaptiveText;

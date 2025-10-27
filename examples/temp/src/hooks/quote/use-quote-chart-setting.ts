import { CacheKey } from '@/constants/cache';
import { getStorage } from '@/helpers/native/msg';
import {
  useQuoteChartSettingStore,
  type USStockPrevAfterDisplay,
  type QuoteChartSettingState,
  chartIndicatorConfigMap,
} from '@/model/quote-chart-setting';

import type { KLineAdjMode } from '@dz-web/quote-client';

export const useQuoteChartSetting = () => {
  const setShowNowPriceLine = useQuoteChartSettingStore((state) => state.setShowNowPriceLine);
  const setKLineAdjMode = useQuoteChartSettingStore((state) => state.setKLineAdjMode);
  const setShowTradeDetail = useQuoteChartSettingStore((state) => state.setShowTradeDetail);
  const setUsStockPrevAfterDisplay = useQuoteChartSettingStore((state) => state.setUsStockPrevAfterDisplay);
  const initChartIndicatorConfigFromCache = useQuoteChartSettingStore((state) => state.initChartIndicatorConfig);
  const setChartIndicatorConfig = useQuoteChartSettingStore((state) => state.setChartIndicatorConfig);

  const initNormalSetting = async () => {
    getStorage({ key: CacheKey.quoteChartSettingShowNowPriceLine })
      .then((res) => {
        if (res.errorCode === 0) {
          setShowNowPriceLine(res.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });

    getStorage({ key: CacheKey.quoteChartSettingShowTradeDetail })
      .then((res) => {
        if (res.errorCode === 0) {
          setShowTradeDetail(res.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });

    getStorage({ key: CacheKey.quoteChartSettingKLineAdjMode })
      .then((res) => {
        if (res.errorCode === 0) {
          setKLineAdjMode(res.data as KLineAdjMode);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const initUSStockPrevAfterDisplay = async () => {
    getStorage({ key: CacheKey.quoteChartSettingUsStockPrevAfterDisplay })
      .then((res) => {
        if (res.errorCode === 0) {
          setUsStockPrevAfterDisplay(res.data as USStockPrevAfterDisplay);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const initChartIndicatorConfig = async () => {
    getStorage({ key: CacheKey.quoteChartSettingIndicatorsConfig }).then((res) => {
      if (res.errorCode === 0) {
        initChartIndicatorConfigFromCache(res.data as QuoteChartSettingState['chartIndicatorsConfig']);
      }
    });
  };

  const resetChartIndicatorConfig = (key: string) => {
    const defaultConfig = chartIndicatorConfigMap[key.toUpperCase() as keyof typeof chartIndicatorConfigMap];

    if (defaultConfig) {
      setChartIndicatorConfig({
        key: key.toLowerCase(),
        value: defaultConfig,
      });
    }
  };

  const init = async () => {
    await initNormalSetting();
    await initUSStockPrevAfterDisplay();
    await initChartIndicatorConfig();
  };

  return {
    init,
    initNormalSetting,
    initUSStockPrevAfterDisplay,
    initChartIndicatorConfig,
    resetChartIndicatorConfig,
  };
};

import { KLineAdjMode } from '@dz-web/quote-client';
import { produce } from 'immer';
import { set as setByLodash } from 'lodash-es';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CacheKey } from '@/constants/cache';
import { EVENT_KEY } from '@/constants/event-key';
import { setStorage, onEvent, emitEvent } from '@/helpers/native/msg';

export enum USStockPrevAfterDisplay {
  trading = 'trading',
  phases = 'phases',
}

export interface ChartIndicatorItem {
  indicatorConfig?: {
    show: boolean;
    value?: number;
    max?: number;
    min?: number;
  }[];
  baseCycleConfig?: {
    value: number;
    max?: number;
    min?: number;
  }[];
}

export const defaultMaChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
      value: 5,
      max: 250,
      min: 2,
    },
    {
      show: true,
      value: 10,
      max: 250,
      min: 2,
    },
    {
      show: false,
      value: 20,
      max: 250,
      min: 2,
    },
    {
      show: false,
      value: 30,
      max: 250,
      min: 2,
    },
    {
      show: false,
      value: 60,
      max: 250,
      min: 2,
    },
  ],
};

export const defaultEmaChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
      value: 5,
      max: 1000,
      min: 0,
    },
    {
      show: true,
      value: 10,
      max: 1000,
      min: 0,
    },
  ],
};

export const defaultBollChartIndicatorConfig = {
  baseCycleConfig: [
    {
      value: 20,
      max: 120,
      min: 2,
    },
    {
      value: 2,
      max: 100,
      min: 0,
    },
  ],
  indicatorConfig: [
    {
      show: true,
    },
    {
      show: true,
    },
    {
      show: true,
    },
  ],
};

export const defaultVolChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
    },
  ],
};

export const defaultMacdChartIndicatorConfig = {
  baseCycleConfig: [
    {
      value: 12,
      max: 200,
      min: 2,
    },
    {
      value: 26,
      max: 200,
      min: 2,
    },
    {
      value: 9,
      max: 200,
      min: 2,
    },
  ],
  indicatorConfig: [
    {
      show: true,
    },
    {
      show: true,
    },
    {
      show: true,
    },
  ],
};

export const defaultKdjChartIndicatorConfig = {
  baseCycleConfig: [
    {
      value: 9,
      max: 90,
      min: 2,
    },
    {
      value: 3,
      max: 30,
      min: 2,
    },
    {
      value: 3,
      max: 30,
      min: 2,
    },
  ],
  indicatorConfig: [
    {
      show: true,
    },
    {
      show: true,
    },
    {
      show: true,
    },
  ],
};

export const defaultRsiChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
      value: 6,
      max: 120,
      min: 2,
    },
    {
      show: true,
      value: 12,
      max: 250,
      min: 2,
    },
    {
      show: true,
      value: 24,
      max: 500,
      min: 2,
    },
  ],
};

export const defaultCciChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
      value: 14,
      max: 100,
      min: 2,
    },
  ],
};

export const defaultObvChartIndicatorConfig = {
  indicatorConfig: [
    {
      show: true,
    },
  ],
};

export const chartIndicatorConfigMap = {
  MA: defaultMaChartIndicatorConfig,
  EMA: defaultEmaChartIndicatorConfig,
  BOLL: defaultBollChartIndicatorConfig,
  VOL: defaultVolChartIndicatorConfig,
  MACD: defaultMacdChartIndicatorConfig,
  KDJ: defaultKdjChartIndicatorConfig,
  RSI: defaultRsiChartIndicatorConfig,
  CCI: defaultCciChartIndicatorConfig,
  OBV: defaultObvChartIndicatorConfig,
};

export interface QuoteChartSettingState {
  showNowPriceLine: boolean;
  setShowNowPriceLine: (data: boolean, isCallback?: boolean) => void;
  kLineAdjMode: KLineAdjMode;
  setKLineAdjMode: (data: KLineAdjMode, isCallback?: boolean) => void;
  showTradeDetail: boolean;
  setShowTradeDetail: (data: boolean, isCallback?: boolean) => void;
  usStockPrevAfterDisplay: USStockPrevAfterDisplay;
  setUsStockPrevAfterDisplay: (data: USStockPrevAfterDisplay, isCallback?: boolean) => void;
  chartIndicatorsConfig: { [key: string]: ChartIndicatorItem };
  setChartIndicatorConfig: (
    data: { key: string; value: ChartIndicatorItem | number | boolean; path?: string },
    isCallback?: boolean,
  ) => void;
  initChartIndicatorConfig: (data: QuoteChartSettingState['chartIndicatorsConfig'], isCallback?: boolean) => void;
}

const getDefaultData = () => ({
  showNowPriceLine: true,
  kLineAdjMode: KLineAdjMode.ACTUAL,
  showTradeDetail: true,
  usStockPrevAfterDisplay: USStockPrevAfterDisplay.phases,
  chartIndicatorsConfig: {
    ma: defaultMaChartIndicatorConfig,
    ema: defaultEmaChartIndicatorConfig,
    boll: defaultBollChartIndicatorConfig,
    vol: defaultVolChartIndicatorConfig,
    macd: defaultMacdChartIndicatorConfig,
    kdj: defaultKdjChartIndicatorConfig,
    rsi: defaultRsiChartIndicatorConfig,
    cci: defaultCciChartIndicatorConfig,
    obv: defaultObvChartIndicatorConfig,
    version: '0.1',
  },
});

enum UpdateKeys {
  priceLine = 'priceLine',
  kLineAdjMode = 'kLineAdjMode',
  showTradeDetail = 'showTradeDetail',
  usStockPrevAfterDisplay = 'usStockPrevAfterDisplay',
  chartIndicatorsConfig = 'chartIndicatorsConfig',
}

export const useQuoteChartSettingStore = create<QuoteChartSettingState>()(
  subscribeWithSelector((set) => ({
    ...getDefaultData(),
    setShowNowPriceLine: (data: boolean, isCallback?: boolean) => {
      set(
        produce((state) => {
          setStorage({ key: CacheKey.quoteChartSettingShowNowPriceLine, value: data });

          if (!isCallback) {
            emitEvent(EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, {
              key: UpdateKeys.priceLine,
              value: data,
            });
          }

          state.showNowPriceLine = data;
        }),
      );
    },
    setKLineAdjMode: (data: KLineAdjMode, isCallback?: boolean) => {
      set(
        produce((state) => {
          setStorage({ key: CacheKey.quoteChartSettingKLineAdjMode, value: data });

          if (!isCallback) {
            emitEvent(EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, {
              key: UpdateKeys.kLineAdjMode,
              value: data,
            });
          }

          state.kLineAdjMode = data;
        }),
      );
    },
    setShowTradeDetail: (data: boolean, isCallback?: boolean) => {
      set(
        produce((state) => {
          setStorage({ key: CacheKey.quoteChartSettingShowTradeDetail, value: data });

          if (!isCallback) {
            emitEvent(EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, {
              key: UpdateKeys.showTradeDetail,
              value: data,
            });
          }

          state.showTradeDetail = data;
        }),
      );
    },
    setUsStockPrevAfterDisplay: (data: USStockPrevAfterDisplay, isCallback?: boolean) => {
      set(
        produce((state) => {
          setStorage({ key: CacheKey.quoteChartSettingUsStockPrevAfterDisplay, value: data });

          if (!isCallback) {
            emitEvent(EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, {
              key: UpdateKeys.usStockPrevAfterDisplay,
              value: data,
            });
          }

          state.usStockPrevAfterDisplay = data;
        }),
      );
    },
    initChartIndicatorConfig: (data: QuoteChartSettingState['chartIndicatorsConfig']) => {
      set(
        produce((state) => {
          state.chartIndicatorsConfig = data;
        }),
      );
    },
    setChartIndicatorConfig: (
      data: { key: string; value: ChartIndicatorItem | number | boolean; path?: string },
      isCallback?: boolean,
    ) =>
      set(
        produce((state) => {
          const { key, value, path } = data;
          if (path) {
            setByLodash(state.chartIndicatorsConfig, `${key}.${path}`, value);
          } else {
            state.chartIndicatorsConfig[key] = value;
          }

          if (!isCallback) {
            emitEvent(EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, {
              key: UpdateKeys.chartIndicatorsConfig,
              value: JSON.parse(JSON.stringify(state.chartIndicatorsConfig)),
            });
          }

          setStorage({ key: CacheKey.quoteChartSettingIndicatorsConfig, value: state.chartIndicatorsConfig });
        }),
      ),
  })),
);

export const watchQuoteChartSetting = () => {
  onEvent({ event: EVENT_KEY.QUOTE_CHART_SETTING_UPDATE, key: EVENT_KEY.QUOTE_CHART_SETTING_UPDATE }, (data) => {
    switch (data.key) {
      case UpdateKeys.priceLine:
        useQuoteChartSettingStore.getState().setShowNowPriceLine(data.value, true);
        break;
      case UpdateKeys.kLineAdjMode:
        useQuoteChartSettingStore.getState().setKLineAdjMode(data.value, true);
        break;
      case UpdateKeys.showTradeDetail:
        useQuoteChartSettingStore.getState().setShowTradeDetail(data.value, true);
        break;
      case UpdateKeys.usStockPrevAfterDisplay:
        useQuoteChartSettingStore.getState().setUsStockPrevAfterDisplay(data.value, true);
        break;
      case UpdateKeys.chartIndicatorsConfig:
        useQuoteChartSettingStore.getState().initChartIndicatorConfig(data.value, true);
        break;
      default:
        break;
    }
  });
};

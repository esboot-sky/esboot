import { queryIntraday, BIG_MARKET } from '@dz-web/quote-client';
import { useQuoteClientSelector } from '@dz-web/quote-client-react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef } from 'react';

import echarts from '@/helpers/echarts';
import { useAppStore } from '@/model/app';

import type { Market } from '@dz-web/quote-client';
import type { EChartsOption } from 'echarts';

interface IProps {
  code: string;
  market: Market;
  color: string;
  wrapStyle?: React.CSSProperties;
  bigMarket: BIG_MARKET;
  customOption?: {
    isNeedChartBg?: boolean;
    animation?: boolean;
    global?: boolean;
  };
  isActive: boolean;
}

const MiniTrend = ({ code, market, color, wrapStyle, bigMarket, customOption, isActive }: IProps) => {
  const isWsClientReady = useQuoteClientSelector((state) => state.isWsClientReady);
  const wsClient = useQuoteClientSelector((state) => state.wsClient);

  const { data: tickList } = useAppStore((state) => state.tradeTickOfMarket[bigMarket]);

  const domRef = useRef<HTMLDivElement | null>(null);
  const echartInstance = useRef<any>(null);

  const { data } = useQuery({
    queryKey: ['mini-trend', code, market],
    queryFn: () =>
      queryIntraday(wsClient, {
        market,
        code,
      }),
    enabled: isActive && isWsClientReady,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  });

  const [{ list }] = data || [{ list: [] }];

  const chartOption: EChartsOption = useMemo(() => {
    const { isNeedChartBg, animation, global } = customOption || {};
    const max = Math.max(...(list.map((k) => k.close) || [0]));
    const min = Math.min(...(list.map((k) => k.close) || [0]));
    const interval = ((max - min) / 10).toFixed(1);
    return {
      grid: {
        left: 0,
        top: 2,
        right: 0,
        bottom: 1,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: tickList,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: isNeedChartBg,
          lineStyle: {
            color: '#C9CDD4',
            type: 'dashed',
            width: 0.5,
          },
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        type: 'value',
        min: min - Number(interval) * 3,
        max: max + Number(interval) * 3,
        interval,
      },
      series: [
        {
          data: list?.map((k) => k.close) || [],
          type: 'line',
          symbol: 'none',
          sampling: 'average',
          areaStyle: {},
          lineStyle: {
            width: 1,
            color,
          },
          animation,
        },
      ],
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color,
          },
          {
            offset: 1,
            color: '#fff',
          },
        ],
        global,
      },
    };
  }, [list, tickList, color, customOption]);

  useEffect(() => {
    if (!domRef.current || echartInstance.current) return;
    const { clientWidth, clientHeight } = domRef.current;
    echartInstance.current = echarts.init(domRef.current as HTMLDivElement, undefined, {
      width: clientWidth,
      height: clientHeight,
    });
  }, []);

  useEffect(() => {
    if (!echartInstance.current) return;
    echartInstance.current?.setOption(chartOption);
  }, [chartOption]);

  return (
    <div style={wrapStyle}>
      <div style={{ width: '100%', height: '100%' }} ref={domRef} />
    </div>
  );
};

export default React.memo(MiniTrend);

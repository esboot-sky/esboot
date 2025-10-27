import { useVirtualizer } from '@tanstack/react-virtual';
import { Toast } from 'antd-mobile';
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useLayoutEffect,
  CSSProperties,
  ReactNode,
  Ref,
  useReducer,
  useImperativeHandle,
} from 'react';
import { FormattedMessage } from 'react-intl';
// import { useVirtual } from 'react-virtual';

import Empty from '@/components/empty/empty';
import { useRem2px } from '@/hooks/use-rem2px';

// import gradientMask from './images/gradient-mask.png';
import './index.scss';
import TableItem from './table-item';
import TableTitle, { ISortReturn } from './table-title';

const LoadingMore = () => <div styleName="loading-more">Loading...</div>;

export function convertUnit(
  target: string | number,
  rootFontSize = parseFloat(document.documentElement.style.fontSize),
) {
  const { width } = document.documentElement.getBoundingClientRect();

  if (!target) return 0;

  if (typeof target === 'number') return target;

  if (typeof target === 'string') {
    const pureTarget: number = Number.parseFloat(target);

    if (target.includes('px')) {
      return pureTarget;
    }

    if (target.includes('rem')) {
      return pureTarget * rootFontSize;
    }

    if (target.includes('%')) {
      return (pureTarget / 100) * width;
    }
  }

  return 40;
}

interface IRenderProps {
  rowData: Record<string, any>;
  value: any;
  index: number;
}

export interface ITableItemColumns {
  label: string | JSX.Element;
  dataKey: string;
  width?: string | number;
  className?: string;
  titleClassName?: string;
  sortable?: boolean;
  fixed?: boolean;
  align?: string;
  render?: (props: IRenderProps) => Element | JSX.Element | string;
}
type StrNum = string | number;
interface IDefaultProps {
  height: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  disableExpand?: boolean;
  addDom: (v: { rowData: any; widthBox: CSSProperties }) => JSX.Element;
  onRowClick: (v: any) => void;
  loadingNode: ReactNode;
  loadingMoreNode: ReactNode;
  sort: (v: ISortReturn) => void;
  defaultSortData?: Record<string, any> | null;
  /**
   * 支持外部强制控制排序，原来内部控制有bug
   */
  controllSortData?: Record<string, any> | null;
  NoData: any;
  titleHeight: StrNum;
  columnHeight: StrNum;
  dataLen: number;
  onFooter: () => void | null;
  children: JSX.Element | null;
  wrapperPadding: [StrNum, StrNum];
  bodyHeight: StrNum;
  rootSize: number;
  childrenHeight: StrNum;
  onScroll: (e: HTMLDivElement) => void;
  onVisibleDataChange?: (begin: number, count: number) => void;
  colClassName: string;
  rowClassName: string;
  colTitleClassName: string;
  rowTitleClassName: string;
  moreShadow: boolean;
  className?: string;
  activeRowKey?: string;
  rowKeyField?: string;
}

type IProps = {
  columns: ITableItemColumns[];
  data: Record<string, any>[];
} & Partial<IDefaultProps>;

/**
 * 表格组件
 * @param columns 表头
 * -@parma sortable 排序
 * @param data 数据
 * @param height 表格数据高度
 * @param addDom 添加行
 * @param onRowClick 行点击事件
 * - active 选中高亮
 * @param sort 选中code
 * @param NoData 隐藏盒子显示
 * @param onFooter 触底钩子函数
 */
const Table = (props: IProps, ref: Ref<any>) => {
  const {
    columns,
    data,
    isLoading = false,
    isLoadingMore = false,
    loadingNode = <FormattedMessage id="global.loading" />,
    loadingMoreNode = <LoadingMore />,
    wrapperPadding = [0, 0],
    addDom = null,
    disableExpand = false,
    onRowClick = () => ({}),
    sort = null,
    defaultSortData = {},
    controllSortData,
    NoData = () => <Empty />,
    titleHeight = '',
    bodyHeight = 0,
    columnHeight = 'auto',
    onFooter = null,
    children = null,
    dataLen = 0,
    childrenHeight = 0,
    onScroll = () => null,
    onVisibleDataChange,
    colClassName = '',
    rowClassName = '',
    colTitleClassName = '',
    rowTitleClassName = '',
    moreShadow = true,
    className = '',
    activeRowKey,
    rowKeyField = 'id',
  } = props;

  const timeOut = useRef<NodeJS.Timeout>();

  const [sortName, setSortName] = useState('');
  const [topBoxScroll, setTopBoxScroll] = useState(0);
  const [showData, setShowData] = useState(data);
  const [_rerenderTrigger, forceRerender] = useReducer((s: number) => s + 1, 0);

  useImperativeHandle(ref, () => ({
    forceRerender,
  }));

  useEffect(() => {
    setShowData(data);
  }, [data, _rerenderTrigger]);

  useEffect(() => {
    if (defaultSortData) {
      setSortName(defaultSortData.sortKey);
    }
  }, [defaultSortData]);

  function sortNameChange(v) {
    if (v === sortName) return;
    setSortName(v);
  }

  // 表头数据过滤
  const title = useMemo(
    () =>
      columns.map((v) => ({
        label: v.label,
        dataKey: v.dataKey,
        width: v.width || '100px',
        sortable: v.sortable || false,
        fixed: v.fixed || false,
        align: v.align || 'left',
        className: v.titleClassName || '',
        sortKey: v.sortKey || '',
      })),
    [columns],
  );

  // 固定表格宽度计算
  const widthBox = useMemo(() => {
    const widthMap = columns.reduce((pre, val) => {
      const valWidth = convertUnit(val?.width || 0);
      return pre + valWidth;
    }, 0);

    return {
      width: `${widthMap}px`,
    };

    // TODO: 计算总宽度可能不需要 - padding， 改了试试
    // const wrapperWidth = (wrapperPadding as [number, number]).reduce((pre, val) => pre + convertUnit(val), 0);

    // return {
    //   width: `${widthMap - wrapperWidth}px`,
    // };
  }, [columns, data, wrapperPadding]);
  const titleRef = useRef<any>(null);

  // 固定表头样式
  const fixedHeadStyle = useMemo<any>(() => {
    if (titleHeight) {
      return {
        position: 'absolute',
        // top: '0',
        top: `${topBoxScroll}px`,
        zIndex: '99',
        // transform: `translate3d(0, ${topBoxScroll}px, 0)`,
      };
    }

    return {};
  }, [titleHeight, topBoxScroll, titleRef.current]);

  const fixedTitleStyle = useMemo<any>(
    () =>
      titleHeight
        ? {
            paddingTop: `${titleHeight}px`,
          }
        : {},
    [titleHeight],
  );

  const [childrenFlag, setChildrenFlag] = useState(data.map(() => false));

  function changeChildrenFlag(index: number) {
    setChildrenFlag(
      childrenFlag.map((v, i) => {
        if (i === index) {
          return !v;
        }
        return false;
      }),
    );
  }

  const resetChildrenFlag = () => {
    setChildrenFlag(childrenFlag.map(() => false));
  };

  const tableTitleColumn = ({ titleData }) => (
    <table ref={titleRef} cellSpacing="0" style={{ ...widthBox, ...fixedHeadStyle }}>
      <thead>
        <tr className={rowTitleClassName}>
          {titleData.map((v: any, i) => (
            <TableTitle
              resetChildrenFlag={resetChildrenFlag}
              columns={titleData}
              key={v.dataKey}
              currentData={data}
              data={showData}
              setData={setShowData}
              sort={sort}
              item={v}
              defaultArrowType={`${defaultSortData?.asc}`}
              controllArrowType={controllSortData?.asc}
              index={i}
              sortNameChange={(val) => sortNameChange(val)}
              sortName={controllSortData ? controllSortData.sortKey : sortName}
              titleHeight={String(titleHeight)}
              colClassName={colTitleClassName}
            />
          ))}
        </tr>
      </thead>
    </table>
  );

  const columnsStyle = useMemo<any>(
    () =>
      titleHeight
        ? {
            overflowX: 'hidden',
            overflowY: 'scroll',
            maxHeight: '100%',
          }
        : {
            overflowX: 'hidden',
            overflowY: 'scroll',
          },
    [titleHeight],
  );

  const containerRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);
  const { ratio } = useRem2px();
  const paddingEnd = useMemo(() => {
    return isLoadingMore ? ratio * 110 : 0;
  }, [isLoadingMore, ratio]);

  // const list = useVirtual({
  //   size: dataLen,
  //   parentRef: containerRef,
  //   estimateSize: useCallback(
  //     (index: number) => {
  //       const height = convertUnit(columnHeight);
  //       const childrenPure = convertUnit(childrenHeight);

  //       if (childrenFlag[index]) {
  //         return height + childrenPure;
  //       }

  //       return height;
  //     },
  //     [childrenFlag],
  //   ),
  //   overscan: 10,
  //   paddingStart: titleHeight ? convertUnit(titleHeight) : 0,
  //   paddingEnd,
  // });

  const list = useVirtualizer({
    count: dataLen,
    getScrollElement: () => containerRef.current,
    estimateSize: (index: number) => {
      const height = convertUnit(columnHeight);
      const childrenPure = convertUnit(childrenHeight);

      if (childrenFlag[index]) {
        return height + childrenPure;
      }

      return height;
    },
    overscan: 6,
    paddingStart: titleHeight ? convertUnit(titleHeight) : 0,
    paddingEnd,
  });

  const vRows = list.getVirtualItems();

  useEffect(() => {
    // 触发加载一次数据
    onVisibleDataChange?.(0, 50);
  }, []);

  useEffect(() => {
    if (vRows.length === 0) {
      return;
    }
    const begin = vRows[0]?.index;
    const end = vRows[vRows.length - 1]?.index;
    const count = end - begin + 1;

    onVisibleDataChange?.(begin, count);
  }, [vRows, onVisibleDataChange]);

  const bodyStyle = useMemo<any>(() => {
    const commonStyle = {
      overflowX: 'hidden',
      overflowY: 'auto',
      ...widthBox,
    };

    if (bodyHeight) {
      return {
        // height: `${convertUnit(bodyHeight)}px`,
        height: bodyHeight,
        ...commonStyle,
      };
    }
    return commonStyle;
  }, [bodyHeight, widthBox]);

  const onScrollX = (e: any) => {
    // x轴滚动
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      const el = e.target?.parentElement?.parentElement;

      if (e.target?.scrollLeft) {
        el?.setAttribute('data-scroll', 'true');
      } else {
        el?.setAttribute('data-scroll', 'false');
      }
      const clientWidth = wrapperRef.current?.clientWidth ?? 0;
      const scrollLeft = e.target?.scrollLeft ?? 0;
      if (parseFloat(widthBox.width) > clientWidth + scrollLeft + 3) {
        el?.setAttribute('data-end-scroll', 'false');
      } else {
        el?.setAttribute('data-end-scroll', 'true');
      }
    }, 100);
  };

  const handLeave = useRef(true);

  const onScrollY = (e: any) => {
    const hasTitle = titleRef.current && titleRef.current.style;
    if (hasTitle && topBoxScroll) {
      titleRef.current.style.top = 0;
      titleRef.current.style.visibility = 'hidden';
    }

    if (!e.target.scrollTop && hasTitle) {
      titleRef.current.style.visibility = 'visible';
    }

    // eslint-disable-next-line max-len
    onScroll({
      start: vRows[0]?.index,
      end: vRows[vRows.length - 1]?.index,
      ...e,
    });

    // y轴滚动
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      setTopBoxScroll(e.target.scrollTop);
      if ((handLeave.current || !topBoxScroll) && hasTitle) {
        titleRef.current.style.visibility = 'visible';
      }

      // 判断是否滚动到底部（接近底部 10px 内）
      const isAtBottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 10;

      if (isAtBottom) {
        Toast.show({
          content: '数据加载完成',
          duration: 1000,
        });
      }

      if (!e.target || !onFooter) return;
      if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight - 10 < 0) {
        onFooter();
      }
    }, 100);
  };

  useEffect(
    () => () => {
      clearTimeout(timeOut.current);
    },
    [],
  );

  useEffect(() => {
    // 超长数据可禁用展开功能以提高性能
    if (disableExpand) return;

    setChildrenFlag(showData.map(() => false));
  }, [showData.length, disableExpand]);

  const showContent = useCallback(
    (content) => {
      if (isLoading) {
        return (
          <div styleName="status-box" style={{ bottom: '0', ...widthBox }}>
            <div style={{ position: 'sticky', left: '0', width: wrapperRef.current?.clientWidth }}>{loadingNode}</div>
          </div>
        );
      }

      if (!data.length) {
        return (
          <div styleName="status-box" style={{ bottom: '0', ...widthBox }}>
            <div style={{ position: 'sticky', left: '0', width: wrapperRef.current?.clientWidth }}>
              <NoData />
            </div>
          </div>
        );
      }

      if (showData.length) return content;
      return null;
    },
    [isLoading, loadingNode, showData, _rerenderTrigger],
  );

  const tableRef = useRef<any>(null);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.target.scrollTop(0);
  //   }
  // }, [containerRef]);

  useLayoutEffect(() => {
    const clientWidth = wrapperRef.current?.clientWidth ?? 0;
    const scrollLeft = wrapperRef.current?.scrollLeft ?? 0;
    if (tableRef.current && parseFloat(widthBox.width) > clientWidth) {
      if (!(parseFloat(widthBox.width) > clientWidth + scrollLeft + 3)) return;

      tableRef.current?.setAttribute('data-end-scroll', 'false');
    }
  }, [widthBox, wrapperRef, tableRef]);

  return (
    <div
      ref={tableRef}
      styleName="--table"
      data-end-scroll="true"
      data-scroll="false"
      data-scrolltime="false"
      // onTouchStart={() => normalToggleNativeGesture(0)}
      // onTouchEnd={() => normalToggleNativeGesture(1)}
    >
      {/* {moreShadow && (
        <div styleName="more-shadow">
          <img src={gradientMask} alt="" styleName="more-shadow" />
        </div>
      )} */}

      {bodyHeight ? (
        <div
          id="table"
          className={className}
          data-virtual-scroll="true"
          ref={containerRef}
          style={{
            ...bodyStyle,
            width: '100%',
          }}
          onScroll={onScrollY}
          onTouchStart={() => {
            handLeave.current = false;
          }}
          onTouchEnd={() => {
            handLeave.current = true;
            titleRef.current.style.visibility = 'visible';
          }}
        >
          <div
            ref={wrapperRef}
            styleName="wrapper-table-box"
            style={{
              // height: `${((!showData.length || isLoading) && convertUnit(bodyHeight)) || list.getTotalSize()}px`,
              height: list.getTotalSize(),
              ...fixedTitleStyle,
              position: isLoading || !showData.length ? '' : 'relative',
            }}
            onScroll={onScrollX}
          >
            {tableTitleColumn({ titleData: title })}
            {showContent(
              vRows.map((item: any) => (
                <TableItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={item.index}
                  {...{
                    fixedBodyStyle: {
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      transform: `translateY(${item.start}px)`,
                    },
                    widthBox,
                    index: item.index,
                    dataItem: showData[item.index],
                    columns,
                    onRowClick,
                    addDom,
                    columnHeight,
                    item,
                    childrenFlag: childrenFlag[item.index],
                    changeChildrenFlag,
                    rowClassName,
                    colClassName,
                    rowKeyField,
                    activeRowKey,
                  }}
                />
              )),
            )}
            {/* 加载更多 */}
            {isLoadingMore && (
              <div styleName="loading-more" style={{ position: 'absolute', bottom: '0', ...widthBox }}>
                <div style={{ position: 'sticky', left: '0', width: wrapperRef.current?.clientWidth }}>
                  {loadingMoreNode}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // <div id="table" style={columnsStyle} ref={ref} onScroll={onScrollY}>
        <div id="table" style={columnsStyle} onScroll={onScrollY} className={className} data-virtual-scroll="false">
          <div style={{ ...bodyStyle, width: '100%' }}>
            <div
              styleName="wrapper-table-box"
              ref={wrapperRef}
              style={{
                position: isLoading || !showData.length ? '' : 'relative',
                ...fixedTitleStyle,
              }}
              onScroll={onScrollX}
            >
              {tableTitleColumn({ titleData: title })}
              {showContent(
                showData.map((_v: any, i: number) => (
                  <TableItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    {...{
                      fixedBodyStyle: {},
                      widthBox,
                      index: i,
                      dataItem: showData[i],
                      columns,
                      onRowClick,
                      columnHeight,
                      addDom,
                      childrenFlag: childrenFlag[i],
                      changeChildrenFlag,
                      rowClassName,
                      colClassName,
                      rowKeyField,
                      activeRowKey,
                    }}
                  />
                )),
              )}
              {/* 加载更多 */}
              {isLoadingMore && <div styleName="loading-more">{loadingMoreNode}</div>}
            </div>
          </div>
        </div>
      )}
      <div styleName="sticky-children">{children}</div>
    </div>
  );
};

export default forwardRef<any, IProps>(Table);

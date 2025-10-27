import { isNil, orderBy } from 'lodash-es';
import { useEffect, useRef, useState, useMemo } from 'react';

import { itemStyleName } from './helper';
import './index.scss';

export interface ISortReturn {
  type: string;
  data: any;
  index: number;
  key: string;
}

interface ITitleProps {
  resetChildrenFlag?: any;
  data: any;
  sort?: (v: ISortReturn) => void;
  item: any;
  index: number;
  sortNameChange?: (v: string) => void;
  sortName?: string;
  titleHeight?: string;
  columns: any;
  setData: any;
  currentData: any;
  colClassName?: string;
  defaultArrowType?: string;
  controllArrowType?: string;
}

type ArrowType = '' | 'up' | 'down';

// 状态文本
function* arrowTypeText(type: ArrowType = ''): Generator<ArrowType, ArrowType, void> {
  if (type === 'down') yield 'up';
  if (type === 'up') yield '';
  return 'down';
}

// 上下默认箭头
interface ArrowProps {
  type: ArrowType;
}

const Arrow = ({ type }: ArrowProps) => <div className={`${type} arrow_icon`} />;

const transformAscMap: Record<string, string> = {
  up: '1',
  down: '0',
  1: 'up',
  0: 'down',
};

/**
 * 表头
 * @param data 表格数据
 * @param sort 排序回调函数
 * @param item 当前表头参数
 * @param index 第几个
 * @param sortNameChange 当前排序名称切换
 * @param sortName 当前排序的名称
 */
const TableTitle = ({
  data,
  setData,
  currentData,
  sort = () => ({}),
  item,
  index,
  sortNameChange = () => ({}),
  sortName = '',
  titleHeight = 'auto',
  columns,
  resetChildrenFlag,
  colClassName = '',
  defaultArrowType = '',
  controllArrowType,
}: ITitleProps) => {
  const [arrowType, setArrowType] = useState<ArrowType>('');
  const arrowTypeTextRef = useRef<Generator<ArrowType, ArrowType, void>>(arrowTypeText());

  useEffect(() => {
    if (defaultArrowType) {
      const mappedType = transformAscMap[defaultArrowType] as ArrowType;
      arrowTypeTextRef.current = arrowTypeText(mappedType);
      setArrowType(mappedType);
    }
  }, [defaultArrowType]);

  // 重置排序状态
  function resetSortType() {
    arrowTypeTextRef.current = arrowTypeText();
  }

  const arrowTypeComputed = useMemo(() => {
    let useArrowType = arrowType;
    if (!isNil(controllArrowType)) {
      useArrowType = transformAscMap[controllArrowType] as ArrowType;
    }
    return item.sortKey === sortName ? useArrowType : '';
  }, [controllArrowType, arrowType, sortName]);

  const tdStyle = useMemo(
    () => ({
      textAlign: item.align || 'left',
      height: titleHeight || 'auto',
      width: item.width,
      left: item.fixed
        ? `calc(${columns.slice(0, index).reduce((pre: any, val: { width: any }) => `${pre} + ${val.width}`, '0rem')}) `
        : '0',
    }),
    [item, titleHeight, columns, index],
  );

  const className = useMemo(() => {
    let name = colClassName;
    if (item.className) {
      name += ` ${item.className}`;
    }
    return name;
  }, [item.className, colClassName]);

  const handleSortClick = () => {
    if (!item.sortable) return;

    // 箭头切换 -- start
    const { value, done } = arrowTypeTextRef.current.next();
    setArrowType(value);

    if (done) resetSortType();

    sortNameChange(item.sortKey);
    const sortReturn: ISortReturn = {
      data: data[index],
      key: item.sortKey || item.dataKey,
      index,
      type: (transformAscMap[value] as string) || '',
    };

    if (resetChildrenFlag) {
      resetChildrenFlag();
    }

    if (sort) {
      sort(sortReturn);
      return;
    }

    if (value) {
      setData(orderBy(data, [item.dataKey], value === 'up' ? 'asc' : 'desc'));
      return;
    }
    setData(currentData);
    // 箭头切换 -- end
  };

  return (
    <th className={className} styleName={`${itemStyleName(item.fixed)}`} style={tdStyle} onClick={handleSortClick}>
      <div
        style={{
          height: titleHeight || 'auto',
        }}
        className={item.sortable ? '__arrow_padding' : ''}
      >
        {item.label}
      </div>
      {item.sortable && <Arrow type={arrowTypeComputed} />}
    </th>
  );
};

export default TableTitle;

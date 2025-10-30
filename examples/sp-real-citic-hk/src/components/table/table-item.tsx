import { useMemo, useState, type CSSProperties } from 'react';
import { cn } from '@dz-web/esboot-browser';

import './index.scss';

interface IItemTd {
  column: any;
  i: number;
  columns: any;
  dataItem: any;
  index: number;
  changeChildrenFlag: any;
  columnHeight?: string;
  colClassName?: string;
}

const ItemTd = (props: IItemTd) => {
  const { column, i, columnHeight, columns, dataItem, index, changeChildrenFlag, colClassName = '' } = props;
  const tdStyle = useMemo(
    () => ({
      textAlign: column.align || 'left',
      height: columnHeight || 'auto',
      width: column.width,
      left: column.fixed
        ? `calc(${columns.slice(0, i).reduce((pre: any, val: { width: any }) => `${pre} + ${val.width}`, '0rem')}) `
        : '0',
      // padding: padding.join(' '),
    }),
    [column],
  );

  const className = useMemo(() => {
    let name = colClassName;
    if (column.className) {
      name += ` ${column.className}`;
    }
    return name;
  }, [column.className, colClassName]);

  const ColumnRender = useMemo(
    () =>
      dataItem && column.render ? column.render({ rowData: dataItem, value: dataItem[column.dataKey], index }) : '--',
    [dataItem, column],
  );

  return (
    <td
      className={className}
      styleName={!column.fixed ? '' : 'item-hidden'}
      style={tdStyle}
      key={column.dataKey}
      onClick={() => changeChildrenFlag(index)}
    >
      {column.render ? ColumnRender : <span>{dataItem[column.dataKey] || ''}</span>}
    </td>
  );
};

interface ITableItem {
  index: number;
  dataItem: any;
  columns: any;
  addDom?: any;
  widthBox: CSSProperties;
  onRowClick?: (v: any) => void;
  rowKeyField?: string;
  activeRowKey?: string;
  columnHeight?: string;
  fixedBodyStyle?: any;
  changeChildrenFlag?: any;
  childrenFlag?: any;
  rowClassName?: string;
  colClassName?: string;
}

const TableItem = (props: ITableItem) => {
  const {
    index,
    dataItem,
    columns,
    addDom,
    onRowClick,
    columnHeight,
    widthBox,
    fixedBodyStyle,
    changeChildrenFlag,
    childrenFlag,
    rowClassName = '',
    colClassName = '',
    rowKeyField = '',
    activeRowKey,
  } = props;

  const isActiveRow = useMemo(
    () => activeRowKey && dataItem[rowKeyField] === activeRowKey,
    [activeRowKey, dataItem, rowKeyField],
  );

  const isExpand = addDom && childrenFlag;
  const [editFlag, setEditFlag] = useState(false);

  return (
    <>
      <table
        cellSpacing="0"
        style={{
          ...widthBox,
          ...fixedBodyStyle,
        }}
        data-index={index}
      >
        <tbody>
          <tr
            className={cn(isExpand && 'expand-tr', rowClassName, isActiveRow && 'bg-[#f3f3f3]')}
            onClick={() =>
              onRowClick &&
              onRowClick({
                rowData: dataItem,
              })
            }
          >
            {columns.map((column: any, i: any) => (
              <ItemTd
                key={column.dataKey}
                {...{
                  column,
                  i,
                  columnHeight,
                  columns,
                  index,
                  setEditFlag,
                  editFlag,
                  dataItem,
                  changeChildrenFlag,
                  colClassName,
                }}
              />
            ))}
          </tr>
        </tbody>
      </table>
      {addDom && childrenFlag ? (
        <div styleName="add-dom-td">
          {addDom({
            rowData: dataItem,
            widthBox,
          })}
        </div>
      ) : null}
    </>
  );
};

export default TableItem;

import { useUpdateEffect } from 'ahooks';
import { useReducer } from 'react';

export interface SortState {
  sortedColumn: string | null | undefined;
  sortOrder: 'asc' | 'desc' | null | undefined;
}

export const emptySortState: SortState = {
  sortedColumn: null,
  sortOrder: null,
};

export const SortStateActions = {
  sortColumn: 'SORT_COLUMN',
  resetSort: 'RESET_SORT',
} as const;

type ValueOf<T> = T[keyof T];

export type Action = { type: ValueOf<typeof SortStateActions>; payload?: string };

export const sortStateReducer = (state: SortState, action: Action): SortState => {
  switch (action.type) {
    case SortStateActions.sortColumn:
      if (state.sortedColumn === action.payload) {
        // 切换排序方式：降序 -> 升序 -> 不排序
        if (state.sortOrder === 'desc') {
          return { sortedColumn: action.payload, sortOrder: 'asc' };
        }
        if (state.sortOrder === 'asc') {
          return emptySortState;
        }
      }
      // 默认升序排序
      return { sortedColumn: action.payload, sortOrder: 'desc' };

    case SortStateActions.resetSort:
      return emptySortState;
    default:
      return state;
  }
};

export interface IUseSortStateOptions {
  initialState?: SortState;
  onSortStateChange?: (sortState: SortState) => void;
}

export function useSortState({
  initialState = {
    sortedColumn: null,
    sortOrder: null,
  },
  onSortStateChange,
}: IUseSortStateOptions = {}) {
  const [sortState, dispatch] = useReducer(sortStateReducer, initialState);

  useUpdateEffect(() => {
    const { sortedColumn, sortOrder } = sortState;
    onSortStateChange?.({
      sortedColumn,
      sortOrder,
    });
  }, [sortState]);

  return {
    sortState,
    sortColumn(columnKey: string) {
      dispatch({
        type: SortStateActions.sortColumn,
        payload: columnKey,
      });
    },
    resetSort() {
      dispatch({
        type: SortStateActions.resetSort,
      });
    },
  };
}

import { describe, expect, test } from 'vitest';

import { sortStateReducer as reducer, SortState, Action, SortStateActions } from './use-sort-state';

describe('sortable-state-reducer', () => {
  test('should return the initial state', () => {
    const initialState: SortState = {
      sortedColumn: null,
      sortOrder: null,
    };
    const action: any = { type: 'UNKNOWN_ACTION' };
    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  test('should handle SORT_COLUMN action for initial state', () => {
    const initialState: SortState = {
      sortedColumn: null,
      sortOrder: null,
    };
    const action: Action = { type: SortStateActions.sortColumn, payload: 'name' };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({ sortedColumn: 'name', sortOrder: 'desc' });
  });

  test('should handle SORT_COLUMN action for existing sorted column', () => {
    const initialState: SortState = {
      sortedColumn: 'name',
      sortOrder: 'asc',
    };
    let action: Action = { type: SortStateActions.sortColumn, payload: 'name' };
    let nextState = reducer(initialState, action);

    expect(nextState).toEqual({ sortedColumn: null, sortOrder: null });

    action = { type: SortStateActions.sortColumn, payload: 'name' };
    nextState = reducer(nextState, action);
    expect(nextState).toEqual({ sortedColumn: 'name', sortOrder: 'desc' });
  });

  test('should handle SORT_COLUMN action for different column', () => {
    const initialState: SortState = {
      sortedColumn: 'name',
      sortOrder: 'asc',
    };
    const action: Action = { type: SortStateActions.sortColumn, payload: 'age' };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({ sortedColumn: 'age', sortOrder: 'desc' });
  });

  test('should handle RESET_SORT action', () => {
    const initialState: SortState = {
      sortedColumn: 'name',
      sortOrder: 'asc',
    };
    const action: Action = { type: SortStateActions.resetSort };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({ sortedColumn: null, sortOrder: null });
  });
});

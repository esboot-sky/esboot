/**
 * 页面redux module模板
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

// Define a type for the slice state
interface IState {
  count: number;
}

function createInitializedState(): IState {
  return {
    count: 0,
  };
}

export const slice = createSlice({
  /**
   * 模块名称
   */
  name: 'hello',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: createInitializedState(),
  reducers: {
    increase: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

export const { increase } = slice.actions;

export const selectCount = (state: RootState) => state.hello.count;

export default slice.reducer;

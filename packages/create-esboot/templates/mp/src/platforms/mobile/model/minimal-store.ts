/**
 * app端最小化store, 每个页面都会包含此store, 用于获取来源无关的app用户设置信息
 */
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import app from './app/slice';

/**
 * 不导出，页面中不需要使用此store, 请使用页面自己的store,
 * 仅用于为app/slice.ts等最小化公用模块提供类型推导
 */
const __store = configureStore({
  reducer: {
    app,
  },
});

export type MinimalStoreType = typeof __store;

// // Infer the `RootState` and `AppDispatch` types from the store itself

export type MinimalRootState = ReturnType<typeof __store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type MinimalAppDispatch = typeof __store.dispatch;

export const useMinimalAppDispatch: () => MinimalAppDispatch = useDispatch;
export const useMinimalAppSelector: TypedUseSelectorHook<MinimalRootState> = useSelector;

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import app from '@pc/model/app/slice';
import hello from './hello/slice';

export const store = configureStore({
  reducer: {
    app,
    hello,
  },
});

/**
 * api 请求不知道store来自哪个页面，所以挂载到window上，运行哪个页面就用哪个页面的store
 */
window.__mobile_store__ = store;

// // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

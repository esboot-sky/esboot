/**
 * 存放平台无关的全局事件，用于不同平台、页面之间的调用解耦
 */
import EventEmitter from 'eventemitter3';
import { IMeta } from '@/hoc/query-client';

export const globalEventsCenter = new EventEmitter();
export const GlobalEvents = {
  REACT_QUERY_REQUEST_ERROR: 'REACT_QUERY_REQUEST_ERROR',
  AXIOS_REQUEST_ERROR: 'AXIOS_REQUEST_ERROR',
  LOGIN_EXPIRED: 'LOGIN_EXPIRED',
} as const;

export type ErrorCallback = (friendlyMessage: string, error: Error, meta: IMeta) => void;

export function listenReactQueryError(callback: ErrorCallback) {
  globalEventsCenter.on(GlobalEvents.REACT_QUERY_REQUEST_ERROR, callback);
}

export function listenLoginExpired(callback: (serverResponse) => void) {
  globalEventsCenter.on(GlobalEvents.LOGIN_EXPIRED, callback);
}

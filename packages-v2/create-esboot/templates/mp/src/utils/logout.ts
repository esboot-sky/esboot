import { GlobalEvents, globalEventsCenter } from '@/global-events';

export function logout(serverResponse: any) {
  globalEventsCenter.emit(GlobalEvents.LOGIN_EXPIRED, serverResponse);
}

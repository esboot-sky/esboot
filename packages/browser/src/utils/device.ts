export const userAgent = navigator.userAgent;

export const isIOS = /iphone|ipad/i.test(userAgent);
export const isAndroid = /android/i.test(userAgent);
export const isDZApp = /dzapp/i.test(userAgent);
export const isDZAppByDS = /dzapp-ds/i.test(userAgent);
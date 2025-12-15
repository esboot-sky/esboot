export const userAgent = navigator.userAgent;

export const isIOS = /iphone|ipad/i.test(userAgent);
export const isAndroid = /android/i.test(userAgent);

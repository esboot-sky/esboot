export function isMobile() {
  return process.env.isMobile;
}

export function isPC() {
  return !isMobile();
}

export function isBrowser() {
  return !!process.env.isBrowser;
}

export function isNative() {
  return !isBrowser();
}

export function isMobileBrowser() {
  return isMobile() && isBrowser();
}

export function isMobileNative() {
  return isMobile() && isNative();
}

export function isPCBrowser() {
  return isPC() && isBrowser();
}

export function isPCNative() {
  return isPC() && isNative();
}

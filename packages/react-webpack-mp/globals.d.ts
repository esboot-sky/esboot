declare interface Window {
}
interface IGlobalConfig {
}

declare module '*.svg';
declare module '*.png';

declare namespace React {
  interface Attributes {
    styleName?: string | undefined;
  }
  interface HTMLAttributes<T> {
    styleName?: string | undefined;
  }
  interface SVGAttributes<T> {
    styleName?: string | undefined;
  }
}

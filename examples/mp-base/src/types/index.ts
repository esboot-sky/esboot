import { Language } from '@/constants/config';

export type i18nMessageDict = Record<Language, Record<string, string>>;

export interface GeneratePageOptions {
  store: any;
  i18n?: boolean;
  /**
   * native不监听登录过期事件，自己对接第三方登录时需要设置为true, 防止通知原生弹出登录框
   */
  disabledLoginExpired?: boolean;
  /**
   * 是否禁用React.StrictMode，默认为false.
   * 有时需要迁移超级老的项目时，StrictMode可能会出现很多bug，可以通过这个参数禁用某个页面的React StrictMode
   */
  disableStrictMode?: boolean;
}

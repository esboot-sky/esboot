import { Language } from './constants/config';

export interface I18nOption {
  messageDict: Record<Language, Record<string, string>>;
}

export interface GeneratePageOptions {
  store: any;
  i18n: I18nOption;
}

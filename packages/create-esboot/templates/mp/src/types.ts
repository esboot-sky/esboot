import { Language } from './constants/config';

export interface I18nOption {
  messageDict: Record<Language, Record<string, string>>;
}

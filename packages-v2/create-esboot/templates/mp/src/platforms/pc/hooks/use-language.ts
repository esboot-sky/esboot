import { selectLanguage } from '@pc/model/app/slice';
import { useMinimalAppSelector } from '@pc/model/minimal-store';

export function useLanguage() {
  return useMinimalAppSelector(selectLanguage);
}

import { selectLanguage } from '@mobile/model/app/slice';
import { useMinimalAppSelector } from '@mobile/model/minimal-store';

export function useLanguage() {
  return useMinimalAppSelector(selectLanguage);
}

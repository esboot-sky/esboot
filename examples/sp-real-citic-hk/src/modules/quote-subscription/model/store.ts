// This file provides hooks and stores for quote-subscription module using Zustand
import { useQuotationStore } from './quotation/quotation';

// 直接导出Zustand store hook
export const useQuotationState = useQuotationStore;

// 为了向后兼容，提供一个selector hook (可选)
export const useQuotationSelector = <T>(selector: (state: ReturnType<typeof useQuotationStore.getState>) => T): T => {
  return useQuotationStore(selector);
};

// 导出store类型
export type QuotationState = ReturnType<typeof useQuotationStore.getState>;

export const useDispatch = () => {
  console.warn('useDispatch is deprecated in Zustand. Please use store actions directly via useQuotationStore()');
  return () => {};
};

// 导出主要的store
export { useQuotationStore } from './quotation/quotation';

// 如果以后有更多的stores，可以在这里导出
// export { useOtherStore } from './other/other';

import { create } from 'zustand';

import { requestPackageDetail, IPackageDetail, fetchPiProgress, IPiProgress } from '@/api/quotation/query';

interface IQuotationState {
  loading: boolean;
  error: string | null;
  detail: IPackageDetail;
  piProgress: IPiProgress;
}

const initialState: IQuotationState = {
  loading: true,
  error: null,
  detail: {
    count: 0,
    currency: '',
    id: '',
    img: '',
    name: '',
    price: 0,
    regionType: 0,
    terminal: [],
    availableArea: '',
    type: 0,
    product: {
      type: '',
      productName: '',
      code: '',
      id: 0,
    },
    period: 0,
  },
  piProgress: {
    authProgress: '',
  },
};

interface QuotationStore extends IQuotationState {
  [x: string]: any;
  fetchPackageDetail: (id: string) => Promise<void>;
  resetState: () => void;
  setDetail: (detail: IPackageDetail) => void;
  fetchPiProgress: () => Promise<void>;
  setPiProgress: (piProgress: any) => void;
}

export const useQuotationStore = create<QuotationStore>((set) => ({
  ...initialState,

  fetchPackageDetail: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { result } = await requestPackageDetail(id);
      set({
        detail: result,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || 'Error fetching package detail',
      });
    }
  },

  resetState: () => {
    set(initialState);
  },

  setDetail: (detail: IPackageDetail) => {
    set({ detail });
  },

  fetchPiProgress: async () => {
    set({ loading: true, error: null });

    try {
      const { result } = await fetchPiProgress();
      console.log(result, 'result ---> ');
      set(() => ({
        loading: false,
        error: null,
        piProgress: result,
      }));
    } catch (error: any) {
      console.log(error, 'error ---> ');

      set({
        loading: false,
        error: error?.message || 'Error fetching pi progress',
      });
    }
  },

  setPiProgress: (piProgress: any) => {
    set((state) => ({
      ...state,
      piProgress,
    }));
  },
}));

export default useQuotationStore;

import { create } from 'zustand';

interface AppStore {
  bears: number;
  increase: () => void;
}

const useAppStore = create<AppStore>()(
  (set) => ({
    bears: 0,
    increase: () => set((state) => ({
      bears: state.bears + 1,
    })),
  }),
);

export { useAppStore };

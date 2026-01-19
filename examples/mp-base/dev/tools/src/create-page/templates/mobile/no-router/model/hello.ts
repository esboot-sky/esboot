import { create } from 'zustand';

interface IHelloState {
  count: number;
}

interface HelloStore extends IHelloState {
  increase: (amount: number) => void;
}

const useHelloStore = create<HelloStore>(set => ({
  count: 0,
  increase: (amount: number) => {
    set(state => ({ count: state.count + amount }));
  },
}));

export const selectCount = (state: HelloStore) => state.count;

export const increase = (amount: number) => useHelloStore.getState().increase(amount);

export default useHelloStore;


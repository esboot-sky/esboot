import { ReactNode } from 'react';

export interface ITab {
  label: ReactNode;
  key: string;
  markets?: number[];
  blocks?: number | { eid: number; c: string }[];
}

export interface IBlockTab {
  label: ReactNode;
  key: string;
  blockId: number[];
  deep: number;
}

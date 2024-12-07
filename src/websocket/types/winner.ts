import type { Common } from './common.ts';

export type Winner = { name: string; wins: number };
export type WinnerResponse = Common<Winner[]>;

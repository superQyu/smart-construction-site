

import { createContext } from 'react';
import type { PrintItemItf } from '@/types';

import type { Dispatch, SetStateAction } from 'react'
export const PrintItemContext = createContext<PrintItemItf[] | undefined>(undefined);
export const CurrentPrintItemContext = createContext<[PrintItemItf | undefined, (Dispatch<SetStateAction<PrintItemItf | undefined>>)]>([undefined, () => { }]);
export const UploadPrintItemContext = createContext<[PrintItemItf[] | undefined, (Dispatch<SetStateAction<PrintItemItf[] | undefined>>)]>([undefined, () => { }]);
export const FinishPrintItemContext = createContext<[PrintItemItf[] | undefined, (Dispatch<SetStateAction<PrintItemItf[] | undefined>>)]>([undefined, () => { }]);
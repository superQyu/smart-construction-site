import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { PdcSettingContextItf } from '@/types';

const pdcSettingsContext = createContext<[PdcSettingContextItf, Dispatch<SetStateAction<PdcSettingContextItf>>]>([
  {},
  () => {},
]);
export const usePdcSettingsContext = () => {
  const context = useContext(pdcSettingsContext);
  if (!context) {
    throw new Error('usePdcSettingsContext must be used within a PdcSettingsContextProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
  onChange?: (ctx: PdcSettingContextItf) => void;
}

export function PdcSettingsContextProvider({ children, onChange }: Props) {
  const [context, setContext] = useState<PdcSettingContextItf>({});

  useEffect(() => {
    onChange?.(context);
  }, [context]);

  return <pdcSettingsContext.Provider value={[context, setContext]}>{children}</pdcSettingsContext.Provider>;
}

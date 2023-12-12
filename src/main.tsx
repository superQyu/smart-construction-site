import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { zhCN as coreZhCN } from '@mui/material/locale';
import { zhCN as pickersZhCN } from '@mui/x-date-pickers/locales';
import { zhCN } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-cn';
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';

import { AuthContext, signIn, saveUserInfor, signOut } from '@/hooks';
import { SnackbarProvider } from '@/context/SnackbarContext.tsx';
import { MeteorConfigContextProvider } from '@/context/MeteorConfigContext.tsx';

import * as baseConf from '@/config';

import router from './routers/router';
import './styles.css';
import './lib/i18n.ts';

const theme = createTheme(
  {
    typography: {
      // In Chinese and Japanese the characters are usually larger,
      // so a smaller fontsize may be appropriate.
      fontSize: 10,
    },
  },
  zhCN,
  pickersZhCN,
  coreZhCN,
);

createRoot(document.getElementById('root') as HTMLElement).render(
  <SnackbarProvider>
    <AuthContext.Provider
      value={{
        signIn,
        saveUserInfor,
        signOut,
        BaseConf: baseConf as any,
        MountedApis: '',
      }}
    >
      <StrictMode>
        <MeteorConfigContextProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
              <RouterProvider router={router}></RouterProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </MeteorConfigContextProvider>
      </StrictMode>
    </AuthContext.Provider>
  </SnackbarProvider>,
);

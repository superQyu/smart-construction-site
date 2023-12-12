import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';

import Regular from './regular';
import PrintBarGroup from './PrinterBarGroup';
import PrintBar from './PrintBar';

import CusButton from '@/components/CustomComponents/CusButton';
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
  button: {
    backgroundColor: '#c8d5ff',
    color: '#577df6',
    borderRadius: '26px',
    padding: '2px 16px',

    '&:hover': {
      backgroundColor: 'rgba(200,213,255,0.85)',
    },
  },
};
export default function SettingsPane({}: Props) {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ height: 'calc(100% - 48px)', padding: '0 5px' }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className="flex flex-col  max-h100vh lg:max-h-inherit h-full"
          sx={{
            flexWrap: 'nowrap',
            '.MuiGrid-root:not(:last-child)': { marginRight: '3px' },
            '.MuiGrid-root': { paddingBottom: '3px' },
          }}
          container
        >
          <Grid item xs={2} sm={12} md={8} className="sm:max-h100% max-h100% h-full">
            <Regular label={t('genericName.regularConfiguration', '常规配置')} />
          </Grid>
          <Grid item xs={12} sm={12} md={2} className="sm:max-h100% max-h100% h-full ">
            <PrintBarGroup label={t('printControl.medium.printBarGroup', '打印条组')} />
          </Grid>
          <Grid item xs={12} sm={12} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <PrintBar label={t('printControl.medium.printBar', '打印条')} />
          </Grid>
        </Grid>
      </Box>
      <Box
        className="flex  max-h100vh lg:max-h-inherit h-full "
        sx={{
          backgroundColor: '#ebf0fe',
          height: '48px',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 30px',
        }}
      >
        <Box sx={defSX.buttonBox}> </Box>
        <Box sx={defSX.buttonBox}>
          <CusButton >{t('genericName.create', '新增')}</CusButton>
          <CusButton >{t('genericName.save', '保存')}</CusButton>
          <CusButton >{t('genericName.loading', '加载')}</CusButton>
        </Box>
      </Box>
    </Box>
  );
}

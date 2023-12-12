import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';

import General from './general';
import SmartMedium from './SmartMedium';
import PrintColumn from './PrintColumn';
import SheetTags from './SheetTags';
import StreamLine from './StreamLine';
import PrinterNozzle from './PrinterNozzle';

import CusButton from '@/components/CustomComponents/CusButton';

export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
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
          <Grid item xs={2} sm={2} md={2} className="sm:max-h100% max-h100% h-full">
            <General label={t('printControl.setting.general', '常规设置')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full ">
            <SmartMedium label={t('printControl.setting.smartMedis', '智能介质')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <PrintColumn label={t('printControl.setting.printColumn', '打印栏')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <SheetTags label={t('printControl.setting.sheetTags', '工作表标记')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <PrinterNozzle label={t('printControl.setting.printerNozzle', '喷嘴刷新')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <StreamLine label={t('printControl.setting.streamline', '流线')} />
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
        <Box sx={defSX.buttonBox}>
          <CusButton >{t('genericName.loadSettings', '加载设置')}</CusButton>
          <CusButton >{t('genericName.saveSettings', '保存设置')}</CusButton>
        </Box>
        <Box sx={defSX.buttonBox}>
          <CusButton >{t('genericName.restore', '恢复')}</CusButton>
          <CusButton >{t('genericName.apply', '应用')}</CusButton>
        </Box>
      </Box>
    </Box>
  );
}

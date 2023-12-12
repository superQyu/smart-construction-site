import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Button } from '@mui/material';

import System from './system';
import Medium from './medium';
import Setting from './setting';
import Status from './status';

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
          <Grid item xs={2} sm={2} md={2} className="sm:max-h100% max-h100% h-full">
            <System label={t('genericName.system', '系统')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full ">
            <Medium label={t('printControl.setting.medium', '介质')} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full pb2">
            <Setting label={t('genericName.settings', '设置')} />
          </Grid>
          <Grid item xs={12} sm={6} md={2} className="sm:max-h100% max-h100% h-full pb2">
            <Status label={t('printControl.setting.streamline', '流线')} />
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
          <Button sx={defSX.button}>
            {t('genericName.importPrinterConfigurationFile', '导入打印机配置文件')}
          </Button>
          <Button sx={defSX.button}>
            {t('genericName.loadSettings', '加载设置')}
          </Button>
          <Button sx={defSX.button}>
            {t('genericName.saveSettings', '保存设置')}
          </Button>
        </Box>
        <Box sx={defSX.buttonBox}>
          <Button sx={defSX.button}>
            {t('genericName.restore', '恢复')}
          </Button>
          <Button sx={defSX.button}>
            {t('genericName.apply', '应用')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

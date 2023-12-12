import { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography } from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import CusLabelSimple from '@/components/CustomComponents/CusLabelSimple';
import SubCard from '@/components/ContentCard/SubCard';
import CusLabel from '@/components/CustomComponents/CusLabel';

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#fff' },
  subCard: {
    marginBottom: '8px',
    '&>.MuiPaper-root': { padding: '0 10px', justifyContent: 'center' },
    '.content': { padding: '0' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
};
export interface Props extends HTMLProps<HTMLElement> {
  params?: {};
}
interface State {
  [key: string]: string | number | boolean;
}
export default function ExportMediaDefinition({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [setting] = useState<{ key?: string; label?: string }>(params);

  const [state, setState] = useState<State>({});
  const [settingList] = useState<formItemProps[]>([
    {
      label: t('genericName.mediumName', '介质名称'),
      itemkey: 'mediumName',
      value: 'C/M/Y/K',
    },
    {
      label: t('genericName.mediumDescription', '介质描述'),
      itemkey: 'mediumDescription',
      value: 'Global Media',
    },
  ]);

  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  const handlerItem = (label: string) => {
    showSnackbar({ message: `点击按钮--[${label}] `, severity: 'success' });
  };

  return (
    <Box className="h-full w-full">
      <CusLabelSimple label={setting.label} />
      <Box className="h-full w-full" sx={{ p: '17px 0 0' }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          sx={{
            flexWrap: 'nowrap',
          }}
          className="flex flex-col  max-h100vh lg:max-h-inherit h-full"
        >
          <Grid item xs={12} sm={12} md={10} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.overview', '概述')}</Typography>}
            >
              <Box sx={{ p: '25px 30px' }}>
                <Typography
                  sx={{
                    pl: '20px',
                    position: 'relative',
                    fontWeight: 700,
                    '&:before': {
                      content: '""',
                      width: '8px',
                      height: '8px',
                      position: 'absolute',
                      backgroundColor: '#648aff',
                      borderRadius: '50%',
                      top: '4px',
                      left: 0,
                    },
                  }}
                >
                  {t(
                    'exportMediaDefinition.overview',
                    '智能媒体管理器现在已经获取了有关打印机行为的足够信息来生成介质定义。',
                  )}
                </Typography>
              </Box>
            </SubCard>
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.process', '过程')}</Typography>}
            >
              <Box sx={{ p: '25px 30px' }}>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('exportMediaDefinition.process.process1', '1、可选地更新媒体名称和描述。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('exportMediaDefinition.process.process2', '2、单击“导出”按钮生成媒体定义。')}
                </Typography>
                <Box
                  sx={{
                    '& .item__box': {
                      '& p.MuiTypography-root': {
                        mr: 0,
                        minWidth: '60px',
                      },
                      '&>div.MuiFormControl-root': {
                        width: 'initial',
                      },
                    },
                  }}
                >
                  {settingList.map((item, index) => (
                    <FormItem key={index} {...item} onChange={handleChange} />
                  ))}
                </Box>
              </Box>
            </SubCard>
            <CusLabel sx={{ borderRadius: '4px', padding: '4px 25px' }} onClick={() => handlerItem('导出智能介质定义')}>
              {t('genericName.exportSmartMediumDefinition', '导出智能介质定义')}
            </CusLabel>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

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

export default function ReadDropletMixingTargets({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState<State>({});
  const [setting] = useState<{ key?: string; label?: string }>(params);

  const [waitScanList] = useState([
    {
      color: '#000000',
      info: 'Drops: 2-K',
    },
    {
      color: '#ff00ff',
      info: 'Drops: 2-M',
    },
    {
      color: '#ffff00',
      info: 'Drops: 2-Y',
    },
  ]);
  const [scannedList] = useState([
    {
      color: '#00ffff',
      info: 'Drops: 2-c',
    },
    {
      color: '#ffff00',
      info: 'Drops: 1-Y',
    },
    {
      color: '#ff00ff',
      info: 'Drops:1-M',
    },
    {
      color: '#000000',
      info: 'Drops: 1-K',
    },
    {
      color: '#00ffff',
      info: 'Drops: 1-c',
    },
  ]);

  const [device] = useState<formItemProps[]>([
    {
      label: `${t('genericName.select', '选择')}${t('genericName.scanner', '扫描器')}`,
      type: 'select',
      itemkey: 'scanner',
      value: 'EPSON',
      options: [{ label: 'EPSON', value: 'EPSON' }],
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
          <Grid item xs={12} sm={12} md={7} className="sm:max-h100% max-h100% h-full">
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
                  {t('readDropletMixingTargets.overview', '智能媒体管理器需要读取液滴混合目标，以产生一组色调曲线。')}
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
                  {t('readDropletMixingTargets.process.process1', '1、等待油墨在打印目标上完全干燥。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readDropletMixingTargets.process.process2', '2、扫描每个目标，知道所有目标扫描完成。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readDropletMixingTargets.process.process3', '3、一旦所有目标被扫描，生成色调曲线。')}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {t('readDropletMixingTargets.process.process4', '4、继续下一步。')}
                </Typography>
              </Box>
            </SubCard>
            <Box
              sx={{
                mb: '25px',
                '& .item__box>div.MuiFormControl-root': { width: 'initial' },
                '& .item__label': { m: 0 },
              }}
            >
              {device.map((item, index) => (
                <FormItem key={index} {...item} onChange={handleChange} />
              ))}
            </Box>
            <Box className="flex justify-start">
              <CusLabel
                sx={{ borderRadius: '4px', padding: '4px 25px', mr: ' 30px' }}
                onClick={() => handlerItem('扫描目标')}
              >
                {t('genericName.scanTarget', '扫描目标')}
              </CusLabel>
              <CusLabel sx={{ borderRadius: '4px', padding: '4px 25px' }} onClick={() => handlerItem('生成曲线')}>
                {t('genericName.generateCurve', '生成曲线')}
              </CusLabel>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5} className="sm:max-h100% max-h100% h-full">
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
              <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full">
                <SubCard
                  contentClassName="content overflow-y-auto"
                  sx={{ ...defSX.subCard, height: '100%' }}
                  Head={() => (
                    <Typography sx={{ ...defSX.subTitle }}>{t('genericName.stayScanning', '待扫描')}</Typography>
                  )}
                >
                  <Box className="sm:max-h100% max-h100% h-full" sx={{ p: '3px' }}>
                    {waitScanList.map((item, idx: number) => (
                      <Box className="flex pt2 pb2 pl2 items-center" key={idx} sx={{ backgroundColor: '#424242' }}>
                        <Box className="w-15px h-15px mr2" sx={{ backgroundColor: item.color }}></Box>
                        <Typography sx={{ mr: '1rem', color: '#fff' }}>{item.info}</Typography>
                      </Box>
                    ))}
                  </Box>
                </SubCard>
              </Grid>
              <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full">
                <SubCard
                  contentClassName="content overflow-y-auto"
                  sx={{ ...defSX.subCard, height: '100%' }}
                  Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.scanned', '已扫描')}</Typography>}
                >
                  <Box className="sm:max-h100% max-h100% h-full" sx={{ p: '3px' }}>
                    {scannedList.map((item, idx: number) => (
                      <Box className="flex pt2 pb2 pl2 items-center" key={idx} sx={{ backgroundColor: '#424242' }}>
                        <Box className="w-15px h-15px mr2" sx={{ backgroundColor: item.color }}></Box>
                        <Typography sx={{ mr: '1rem', color: '#fff' }}>{item.info}</Typography>
                      </Box>
                    ))}
                  </Box>
                </SubCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

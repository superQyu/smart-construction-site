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
interface State {
  [key: string]: string | number | boolean;
}
export interface Props extends HTMLProps<HTMLElement> {
  params?: {};
}

export default function ReadInkLimitTarget({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [setting] = useState<{ key?: string; label?: string }>(params);
  const [state, setState] = useState<State>({});

  const [inkLimitForm] = useState<formItemProps[]>([
    {
      label: 'Black(%)',
      itemkey: 'Black',
      value: '100',
    },
    {
      label: 'Cyan(%)',
      itemkey: 'Cyan',
      value: '100',
    },
    {
      label: 'Magenta(%)',
      itemkey: 'Magenta',
      value: '81.99',
    },
    {
      label: 'Yellow(%)',
      itemkey: 'Yellow',
      value: '81.99',
    },
    {
      label: t('genericName.unit', '单位'),
      type: 'select',
      itemkey: 'unit',
      value: 'Percentage',
      options: [{ label: 'Percentage', value: 'Percentage' }],
      suffix: '百分比/StatusT',
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
                  {t('readInkLimitTarget.overview', '智能媒体管理器需要从墨水限制目标中读取测量数据。')}
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
                  {t('readInkLimitTarget.process.process1', '1、等待油墨在打印目标上完全干燥。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readInkLimitTarget.process.process2', '2、测量并导入扫推仪生成的数据文件中导入LAB值。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readInkLimitTarget.process.process3', '3、检查目标质量并为每个通道设置所需的最大油墨限制。')}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {t('readInkLimitTarget.process.process4', '4、继续下一步。')}
                </Typography>
              </Box>
            </SubCard>
            <CusLabel sx={{ borderRadius: '4px', padding: '4px 25px' }} onClick={() => handlerItem('导入测量值')}>
              {t('genericName.importMeasurementValues', '导入测量值')}
            </CusLabel>
          </Grid>
          <Grid item xs={12} sm={12} md={5} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard, height: '100%' }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.preview', '预览')}</Typography>}
            >
              <Box className="sm:max-h100% max-h100% h-full" sx={{ p: '26px 20px' }}>
                <CusLabelSimple label={t('genericName.inkLimit', '油墨限制')} />
                <Box
                  sx={{
                    mb: '10px',
                    '& .item__box': {
                      '&>div.MuiFormControl-root': {
                        width: 'initial',
                        // minWidth: '70px',
                      },
                    },
                    '& .item__label': { minWidth: '100px', justifyContent: 'flex-end' },
                    '& .item__input': {
                      '&>.MuiInputBase-root': {
                        borderRadius: 0,
                        input: {
                          width: '120px',
                          padding: '3px 14px',
                        },
                      },
                    },
                    '& .item__select': {
                      borderRadius: 0,
                      '& .MuiSelect-select': {
                        padding: '3px 14px',
                        minWidth: '120px',
                      },
                    },
                    '.suffix_box': {
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  {inkLimitForm.map((item, index) => (
                    <FormItem key={index} {...item} onChange={handleChange} />
                  ))}
                </Box>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

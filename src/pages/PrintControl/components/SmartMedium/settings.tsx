import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import ContentCard from '@/components/ContentCard';
import CusLabel from '@/components/CustomComponents/CusLabel';
import SubCard from '@/components/ContentCard/SubCard';

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#fff' },
  subCard: {
    '&>.MuiPaper-root': { padding: '0 10px', justifyContent: 'center' },
    marginBottom: '8px',
    '.content': { padding: '0' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
  formItem: { input: { padding: '3px 14px' } },
};
interface State {
  [key: string]: string | number | boolean;
}
export interface Props extends HTMLProps<HTMLElement> {}

export default function PrintBarComponents(props: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState<State>({});

  const [initForm] = useState<formItemProps[]>([
    {
      label: t('genericName.printerProfileName', '打印机配置文件名称'),
      itemkey: 'printerProfileName',
      disabled: true,
      value: '默认打印机配置',
    },
    {
      label: t('genericName.manufacturer', '制造商'),
      itemkey: 'manufacturer',
      disabled: true,
      value: 'Global Craphics',
    },
    {
      label: t('genericName.types', '类型'),
      itemkey: 'types',
      disabled: true,
      value: 'KCMY',
    },
    {
      label: t('genericName.mediumName', '介质名称'),
      itemkey: 'mediumName',
      value: '我的新介质',
    },
    {
      label: t('genericName.background', '背景颜色'),
      itemkey: 'background',
      disabled: true,
      value: '白色',
    },
    {
      label: t('genericName.medium.width', '介质宽度'),
      itemkey: 'mediumWidth',
      value: '300mm',
    },
    {
      label: t('genericName.totalAreaCoverage', '总面积覆盖'),
      itemkey: 'totalAreaCoverage',
      value: 'None',
    },
  ]);
  const [initFormKCMY] = useState<formItemProps[]>([
    {
      label: t('genericName.screen', '屏幕'),
      type: 'select',
      itemkey: 'screen',
      value: '2deop mirror',
      options: [{ label: '2deop mirror', value: '2deop mirror' }],
    },
    {
      label: t('genericName.resolutionRatio', '分辨率'),
      type: 'select',
      itemkey: 'resolutionRatio',
      value: '2',
      options: [{ label: '2', value: 2 }],
    },
    {
      label: t('genericName.outputBitsPerPixel', '每像素输出位数'),
      type: 'select',
      itemkey: 'outputBitsPerPixel',
      value: '2',
      options: [{ label: '2', value: 2 }],
    },
  ]);
  const [targetSize] = useState<formItemProps[]>([
    {
      label: t('genericName.width', '宽度'),
      itemkey: 'width',
      value: '210.00',
      suffix: 'mm',
    },
    {
      label: t('genericName.height', '高度'),
      itemkey: 'height',
      value: '210.00',
      suffix: 'mm',
    },
  ]);
  const [measure] = useState<formItemProps[]>([
    {
      label: t('genericName.scanningDevice', '扫描设备'),
      itemkey: 'scanningDevice',
      value: 'X-Rite',
      type: 'select',
      options: [{ label: 'X-Rite', value: 'X-Rite' }],
    },
    {
      label: t('genericName.pointGain', '点增益'),
      itemkey: 'pointGain',
      value: '20.0%',
    },
  ]);

  const [unit] = useState<formItemProps[]>([
    {
      label: t('genericName.unit', '单位'),
      itemkey: 'unit',
      value: '英寸/毫米',
      type: 'select',
      options: [{ label: '英寸/毫米', value: '英寸/毫米' }],
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  useEffect(() => {}, []);
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box className="overflow-y-auto h-full" sx={{ padding: '8px 5px' }}>
        <CusLabel>{t('genericName.openExistingProject', '打开现有项目')}</CusLabel>
        <Box
          sx={{
            pr: '25px',
            mb: '10px',
            '& .item__label': { minWidth: '130px', justifyContent: 'flex-end' },
            '& .item__input': {
              '&>.MuiInputBase-root': {
                borderRadius: 0,
                input: {
                  padding: '3px 14px',
                },
              },
              '.Mui-disabled': {
                background: '#f5f5f5',
              },
            },
          }}
        >
          {initForm.map((item, index) => (
            <FormItem key={index} {...item} onChange={handleChange} />
          ))}
        </Box>
        <SubCard
          contentClassName="content overflow-y-auto"
          sx={{ ...defSX.subCard, mt: '5px' }}
          Head={() => (
            <Typography sx={{ ...defSX.subTitle }}>
              {`${t('genericName.printBarChartGroups', '打印条形图组')}-KCMY`}
            </Typography>
          )}
        >
          <Box
            sx={{
              mt: '4px',
              p: '0 25px',
              '& .item__label': { minWidth: 'initial' },
              '& .item__select': {
                borderRadius: 0,
                '& .MuiSelect-select': {
                  padding: '3px 14px',
                },
                '.Mui-disabled': {
                  background: '#f5f5f5',
                },
              },
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              container
              className="h-full"
              sx={{
                flexWrap: 'nowrap',
                '& .item__box': { m: 0, '&>.MuiFormControl-root': { minWidth: 'initial' } },
              }}
              spacing={2}
            >
              {[initFormKCMY[0], initFormKCMY[1]].map((item, index) => (
                <Grid item xs={12} sm={6} md={6} className="h-full" key={index}>
                  <FormItem {...item} onChange={handleChange} />
                </Grid>
              ))}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              container
              className="h-full"
              sx={{
                '& .item__box': { m: 0 },
              }}
            >
              <Grid item xs={12} sm={12} md={8} className="h-full">
                <FormItem {...initFormKCMY[2]} onChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </SubCard>
        <Box className="flex justify-between">
          <CusLabel>{`${t('genericName.add', '添加')}${t('genericName.or', '或')}${t('genericName.delete', '删除')}${t(
            'genericName.screen',
            '屏幕',
          )}`}</CusLabel>
          <CusLabel>{t('genericName.exportDefaultMedium', '导出默认介质')}</CusLabel>
        </Box>
        <Box>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            container
            sx={{
              flexWrap: 'nowrap',
              mt: '10px',
            }}
            className="flex flex-col  max-h100vh lg:max-h-inherit h-full"
          >
            <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full">
              <SubCard
                contentClassName="content overflow-y-auto"
                sx={{ ...defSX.subCard }}
                Head={() => (
                  <Typography sx={{ ...defSX.subTitle }}>{t('genericName.targetSize', '目标尺寸')}</Typography>
                )}
              >
                <Box
                  sx={{
                    p: '0 5px 5px 10px',
                    '& .item__box': { mt: '4px', '&>.MuiFormControl-root': { minWidth: 'initial' } },
                    '& .item__label': { minWidth: 'initial' },
                    '& .item__input': {
                      '&>.MuiInputBase-root': {
                        borderRadius: 0,
                        input: {
                          padding: '3px 14px',
                        },
                      },
                      '.Mui-disabled': {
                        background: '#f5f5f5',
                      },
                    },
                  }}
                >
                  {targetSize.map((item, index) => (
                    <FormItem key={index} {...item} onChange={handleChange} />
                  ))}
                </Box>
              </SubCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full ">
              <SubCard
                contentClassName="content overflow-y-auto"
                sx={{ ...defSX.subCard }}
                Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.measure', '测量')}</Typography>}
              >
                <Box
                  sx={{
                    p: '0 5px 5px 10px',
                    '& .item__box': { mt: '4px', '&>.MuiFormControl-root': { minWidth: 'initial' } },
                    '& .item__label': { minWidth: '50px', justifyContent: 'flex-end' },
                    '& .item__select': {
                      borderRadius: 0,
                      '& .MuiSelect-select': {
                        padding: '3px 14px',
                      },
                      '.Mui-disabled': {
                        background: '#f5f5f5',
                      },
                    },
                    '& .item__input': {
                      '&>.MuiInputBase-root': {
                        borderRadius: 0,
                        input: {
                          padding: '3px 14px',
                        },
                      },
                      '.Mui-disabled': {
                        background: '#f5f5f5',
                      },
                    },
                  }}
                >
                  {measure.map((item, index) => (
                    <FormItem key={index} {...item} onChange={handleChange} />
                  ))}
                </Box>
              </SubCard>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            p: '0 5px 5px 10px',
            '& .item__box': { mt: '4px', '&>.MuiFormControl-root': { minWidth: 'initial' } },
            '& .item__label': { minWidth: 'initial' },
            '& .item__select': {
              borderRadius: 0,
              '& .MuiSelect-select': {
                padding: '3px 14px',
              },
              '.Mui-disabled': {
                background: '#f5f5f5',
              },
            },
          }}
        >
          {unit.map((item, index) => (
            <Grid item xs={12} sm={6} md={8} className="h-full" key={index}>
              <FormItem {...item} onChange={handleChange} />
            </Grid>
          ))}
        </Box>
      </Box>
    </ContentCard>
  );
}

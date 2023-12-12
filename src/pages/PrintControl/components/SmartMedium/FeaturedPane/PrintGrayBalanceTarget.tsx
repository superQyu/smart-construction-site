import { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';

import CusLabelSimple from '@/components/CustomComponents/CusLabelSimple';
import SubCard from '@/components/ContentCard/SubCard';
import CusLabel from '@/components/CustomComponents/CusLabel';
import Counter from '@/components/Counter';
import ImagePreview from '@/components/ImagePreview';

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
export default function PrintGrayBalanceTarget({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [setting] = useState<{ key?: string; label?: string }>(params);
  const [advancedOptions, setAdvancedOptions] = useState<State>({});

  const [previewImageItem] = useState(null);
  const handleValueChange = (key: string, val: any) => {
    setAdvancedOptions({ ...advancedOptions, [key]: val });
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
                  {t(
                    'PrintGrayBalanceTarget.overview',
                    '智能媒体管理器需要通过打印和测量测试目标来记录打印机的灰平衡行为。',
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
                  {t('process.process1', '1、点击“打印目标”按钮，使用智能打印控制器打印您的测试目标。')}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {t('process.process2', '2、一旦目标打印成功，进行下一步。')}
                </Typography>
              </Box>
            </SubCard>
            <CusLabel sx={{ borderRadius: '4px', mb: '15px', padding: '4px 25px' }} onClick={() => handlerItem('打印目标')}>
              {t('genericName.printTarget', '打印目标')}
            </CusLabel>

            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>{t('genericName.advancedOptions', '高级选项')}</Typography>
              )}
            >
              <Box sx={{ p: '14px 30px', '& p.MuiTypography-root': { minWidth: '60px', fontWeight: '700' } }}>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}.0 (Maximum dE)`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={(val) => handleValueChange('tolerance', val)}
                  prelabel={t('genericName.tolerance', '容忍度')}
                  sx={{ mb: '15px' }}
                />

                <Counter
                  initialValue={76}
                  step={1}
                  format={(value) => `${value}.00 (Nominal%)`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={(val) => handleValueChange('convert', val)}
                  prelabel={t('genericName.convert', '转换')}
                />
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={12} md={5} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard, height: '100%' }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.preview', '预览')}</Typography>}
            >
              <Box className="sm:max-h100% max-h100% h-full" sx={{ p: '3px' }}>
                <ImagePreview>
                  {previewImageItem ? (
                    <img src={previewImageItem} alt="" className="max-h100% max-w100%"></img>
                  ) : (
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('digitalInteraction.noPreviewImage', '无可用预览')}
                    </Typography>
                  )}
                </ImagePreview>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

import { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, FormControlLabel, Switch } from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';

import CusLabelSimple from '@/components/CustomComponents/CusLabelSimple';
import SubCard from '@/components/ContentCard/SubCard';
import CusLabel from '@/components/CustomComponents/CusLabel';
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

const CusFormControlLabel = styled(FormControlLabel)(() => ({
  position: 'relative',
  margin: '0 -8px 0 0',
  width: '135px',
  '& .MuiSwitch-track': {
    opacity: '1!important',
    backgroundColor: '#d2d2d2!important',
  },
  '& .MuiFormControlLabel-label': {
    position: 'absolute',
    fontWeight: 700,
    left: '32px',
  },
  '& .Mui-checked': {
    transform: 'translateX(97px)!important',
  },
  '&.cus__switch_checked': {
    ' .MuiSwitch-track': {
      backgroundColor: '#4671f5!important',
    },
    '.MuiFormControlLabel-label': {
      color: '#fff',
    },
    '.MuiSwitch-thumb': {
      backgroundColor: '#fff',
    },
  },
}));
const CusSwitch = styled(Switch)(() => ({
  padding: 8,
  width: '100%',
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function ReadGrayBalanceTarget({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [setting] = useState<{ key?: string; label?: string }>(params);
  const [checked, setChecked] = useState<boolean>(true);

  const [previewImageItem] = useState(null);

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
                  {t('readGrayBalanceTarget.overview', '智能媒体管理器需要从最新的灰平衡目标读取测量数据。')}
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
                  {t('readGrayBalanceTarget.process.process1', '1、等待油墨在打印目标上完全干燥。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readGrayBalanceTarget.process.process2', '2、测量并导入扫描仪生成的数据文件中导入LAB值。')}
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: '15px' }}>
                  {t('readGrayBalanceTarget.process.process3', '3、检查是否达到了你想要的质量。')}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {t('readGrayBalanceTarget.process.process4', '4、重复该过程,或在完成后继续执行下一步。')}
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
              <Box className="sm:max-h100% max-h100% " sx={{ height: 'calc(100% - 58px)', p: '26px 20px 0' }}>
                <CusLabelSimple
                  label={`${t('genericName.qualityReport', '质量报告')} ${t('genericName.iteration', '迭代')}2`}
                />
                <Box sx={{ height: 'calc(100% - 18px)', mt: '20px' }}>
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
                  <Box className="flex" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <CusLabel
                      sx={{ height: '25px', borderRadius: '4px', padding: '4px 25px' }}
                      onClick={() => handlerItem('迭代')}
                    >
                      {t('genericName.iteration', '迭代')}
                    </CusLabel>
                    <CusFormControlLabel
                      className={`cus__switch ${checked && 'cus__switch_checked'}`}
                      control={<CusSwitch checked={checked} onChange={() => setChecked(!checked)} />}
                      label={t('genericName.hasToleranceBeenReached', '是否达到容差')}
                    />
                  </Box>
                </Box>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

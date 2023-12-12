import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

import ContentCard from '@/components/ContentCard';
import SubCard from '@/components/ContentCard/SubCard';
import Counter from '@/components/Counter';

export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center' },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  box: { marginBottom: '12px' },
  subCard: { marginBottom: '15px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
};
export default function SmartMedium(props: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    estimation: true,
    autoAdjustment: true,
    optimization: true,
    preventJob: false,
  });

  const handleValueChange = (newValue: any) => {
    console.log('Counter value:', newValue);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  useEffect(() => {}, []);
  const { estimation, autoAdjustment, optimization, preventJob } = state;
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Box className="overflow-y-auto" sx={{ marginTop: '29px', padding: '2px', height: 'calc(100% - 50px)' }}>
          <SubCard
            contentClassName="content overflow-y-auto"
            sx={{ ...defSX.subCard, '.content': { padding: '0 5px 0 19px' } }}
            Head={() => (
              <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>{t('genericName.option', '选项')}</Typography>
            )}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={estimation} onChange={handleChange} name="estimation" />}
                label={t('printControl.setting.estimation', '启用流线估计')}
                sx={defSX.checkbox}
              />
              <Box>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={handleValueChange}
                  prelabel={t('genericName.max', '最大')}
                  suflabel={t('genericName.page', '页')}
                />
              </Box>
              <FormControlLabel
                control={<Checkbox checked={autoAdjustment} onChange={handleChange} name="autoAdjustment" />}
                label={t('printControl.setting.autoAdjustment', '启用流线自动调节')}
                sx={defSX.checkbox}
              />
              <FormControlLabel
                control={<Checkbox checked={optimization} onChange={handleChange} name="optimization" />}
                label={t('printControl.setting.optimization', '启用流线作业优化')}
                sx={defSX.checkbox}
              />
            </FormGroup>
          </SubCard>

          <SubCard
            contentClassName="overflow-y-auto"
            Head={() => (
              <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                {t('printControl.sheetTags.printingSpeedIndicator', '打印速度指示器')}
              </Typography>
            )}
          >
            <FormGroup>
              <Box sx={defSX.box}>
                <Typography sx={defSX.itemTitle}>
                  {t('printControl.sheetTags.targetLineSpeed', '目标线速度')}
                </Typography>
                <Counter initialValue={1} step={1} format={(value) => `${value}`} onValueChange={handleValueChange} />
              </Box>
              <Box>
                <Typography sx={defSX.itemTitle}>{t('printControl.sheetTags.securityZone', '安全区域')}</Typography>
                <Counter
                  initialValue={10}
                  step={1}
                  format={(value) => `${value} pts`}
                  onValueChange={handleValueChange}
                />
              </Box>
              <FormControlLabel
                control={<Checkbox checked={preventJob} onChange={handleChange} name="preventJob" />}
                label={t('printControl.setting.preventJob', '阻止关键区域作业')}
                sx={defSX.checkbox}
              />
            </FormGroup>
          </SubCard>
        </Box>
      </Box>
    </ContentCard>
  );
}

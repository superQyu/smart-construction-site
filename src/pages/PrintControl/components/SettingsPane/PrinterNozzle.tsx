import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

import ContentCard from '@/components/ContentCard';
import Counter from '@/components/Counter';

export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 700 }, svg: { fill: '#648aff' } },
  box: { marginBottom: '20px' },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '10px' },
  counterItem: { marginBottom: '10px' },
};
export default function SmartMedium(props: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    nozzleRefreshBar: true,
    nozzleRefreshPage: false,
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
  const { nozzleRefreshBar, nozzleRefreshPage } = state;
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Box
          className="overflow-y-auto"
          sx={{ marginTop: '29px', padding: '2px 5px 0 19px', height: 'calc(100% - 50px)' }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={nozzleRefreshBar} onChange={handleChange} name="nozzleRefreshBar" />}
              label={t('printControl.setting.nozzleRefreshBar', '启用喷嘴刷新条')}
              sx={defSX.checkbox}
            />

            <FormControlLabel
              control={<Checkbox checked={nozzleRefreshPage} onChange={handleChange} name="nozzleRefreshPage" />}
              label={t('printControl.setting.nozzleRefreshPage', '启用喷嘴刷新页面')}
              sx={defSX.checkbox}
            />
            <Box sx={{ ...defSX.box, mt: '35px' }}>
              <Typography sx={defSX.itemTitle}>{t('printControl.sheetTags.printStart', '打印开始时')}:</Typography>
              <Box>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={handleValueChange}
                  prelabel={t('genericName.insert', '插入')}
                  suflabel={t('genericName.page', '页')}
                />
              </Box>
            </Box>
            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('printControl.sheetTags.printDuring', '打印期间')}:</Typography>
              <Box sx={defSX.counterItem}>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={handleValueChange}
                  prelabel={t('genericName.per', '每')}
                  suflabel={t('genericName.page', '页')}
                />
              </Box>
              <Box>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={handleValueChange}
                  prelabel={t('genericName.insert', '插入')}
                  suflabel={t('genericName.page', '页')}
                />
              </Box>
            </Box>
            <Box>
              <Typography sx={defSX.itemTitle}>{t('printControl.sheetTags.printEnd', '打印结束时')}:</Typography>
              <Box>
                <Counter
                  initialValue={1}
                  step={1}
                  format={(value) => `${value}`}
                  minValue={0}
                  maxValue={10}
                  onValueChange={handleValueChange}
                  prelabel={t('genericName.insert', '插入')}
                  suflabel={t('genericName.page', '页')}
                />
              </Box>
            </Box>
          </FormGroup>
        </Box>
      </Box>
    </ContentCard>
  );
}

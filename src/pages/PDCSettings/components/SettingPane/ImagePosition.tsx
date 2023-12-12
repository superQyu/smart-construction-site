import { useTranslation } from 'react-i18next';

import { Box, Typography, OutlinedInput, BoxProps } from '@mui/material';

import FormItem from '@/components/CustomComponents/FormItem';
import { SettingPaneItf } from '@/types';

export interface Props extends BoxProps {
  state: SettingPaneItf;
  onStateChange: (key: string, val: any) => void;
}
const defSX = {
  subTitle: {
    pr: '30px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    width: '150px',
  },
};

export default function ImagePosition({ state, onStateChange }: Props) {
  const { t } = useTranslation();

  return (
    <Box className="flex flex-col flex-wrap justify-start  w-full p4">
      <Box className="flex items-center mt1 mr1">
        <Typography sx={{ ...defSX.subTitle }}>{`${t('genericName.picture', '图像')}X${t(
          'genericName.position',
          '位置',
        )} (${t('genericName.millimeterMeter', '亳米')})`}</Typography>

        <OutlinedInput
          size="small"
          value={state.imageX}
          className="flex-1"
          onChange={(e) => onStateChange('imageX', parseFloat(e.target.value || '0'))}
          inputProps={{
            step: 0.01,
            min: -99999,
            max: 99999,
            type: 'number',
          }}
          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
        />
      </Box>
      {state.enableImageXExtend && (
        <>
          <Box className="flex items-center mt1 mr1">
            <Typography sx={{ ...defSX.subTitle }}>{t('genericName.reversePassXAdjust', '反向打印标准')}</Typography>
            <OutlinedInput
              size="small"
              value={state.reversePassXAdjust}
              className="flex-1"
              onChange={(e) => onStateChange('reversePassXAdjust', parseFloat(e.target.value || '0'))}
              inputProps={{
                step: 0.01,
                min: -99999,
                max: 99999,
                type: 'number',
              }}
              sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
            />
          </Box>
          <Box className="flex items-center mr1">
            <Typography sx={{ ...defSX.subTitle }}>{t('genericName.biDirectionScan', '双向打印')}</Typography>
            <FormItem
              type="checkbox"
              value={state.biDirectionScan}
              onChange={onStateChange}
              itemkey="biDirectionScan"
              label=""
              sx={{ mt: 0 }}
            />
          </Box>
          <Box className="flex items-center mr1">
            <Typography sx={{ ...defSX.subTitle }}>
              {t('genericName.firstScanInJobIsForward', '作业中的第一Swath是反向的')}
            </Typography>
            <FormItem
              type="checkbox"
              value={state.firstScanInJobIsForward}
              onChange={onStateChange}
              itemkey="firstScanInJobIsForward"
              label=""
              sx={{ mt: 0 }}
            />
          </Box>
        </>
      )}

      <Box className="flex items-center mr1 mt1">
        <Typography sx={{ ...defSX.subTitle }}>{`${t('genericName.picture', '图像')}Y${t(
          'genericName.position',
          '位置',
        )} (${t('genericName.millimeterMeter', '亳米')})`}</Typography>

        <OutlinedInput
          size="small"
          value={state.imageY}
          className="flex-1"
          onChange={(e) => onStateChange('imageY', parseFloat(e.target.value || '0'))}
          inputProps={{
            step: 0.04,
            min: -99999,
            max: 99999,
            type: 'number',
          }}
          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
        />
      </Box>
    </Box>
  );
}

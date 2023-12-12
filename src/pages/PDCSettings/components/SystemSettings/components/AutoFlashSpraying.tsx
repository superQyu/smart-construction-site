import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput, InputAdornment } from '@mui/material';

import { useInitAutoSpit } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem from '@/components/CustomComponents/FormItem';
import { PrintAutoSpitItf } from '@/types';

interface State extends PrintAutoSpitItf {}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
};
export default function AutoFlashSpraying() {
  const { t } = useTranslation();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];
  const [state, setState] = useState<State>({
    timeInterval: 0,
    enableTimeInterval: false,
    spitCount: 0,
  });

  useInitAutoSpit((data) => {
    setState((prev) => {
      return {
        ...prev,
        ...data,
      };
    });
  });
  const handleChange = (key: string, val: string) => {
    setState((prev) => ({ ...prev, [key]: parseFloat(val || '0') }));
    setPdcSettingsCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        autoSpit: {
          ...prev.systemSetting?.autoSpit,
          [key]: parseFloat(val || '0'),
        },
      },
    }));
  };

  const handleCheckTimeIntervalChange = (key: string, val: boolean) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPdcSettingsCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        autoSpit: {
          ...prev.systemSetting?.autoSpit,
          [key]: val,
          timeInterval: state.timeInterval,
        },
      },
    }));
  };

  return (
    <Box
      className="flex"
      sx={{
        whiteSpace: 'nowrap',
        '& .settings__item': { flexBasis: '50%', m: 0 },
      }}
    >
      <Box
        className="flex settings__item checkbox__item"
        sx={{
          alignItems: 'center',
          '& .item__box': {
            mt: '0',
            '& .item__content__checkbox': {
              pl: '10px',
              mr: '10px',
              minWidth: 'initial',
              '.MuiFormControlLabel-label': { fontWeight: '700' },
            },
          },
        }}
      >
        <FormItem
          {...{
            label: t('PDTriggerSignal.intervalTime ', '间隔时间'),
            type: 'checkbox',
            itemkey: 'enableTimeInterval',
            value: true,
          }}
          onChange={(key, val) => handleCheckTimeIntervalChange(key, val as boolean)}
        />
        <Box className="flex settings__item" sx={{ mb: '10px', pr: '10px' }}>
          <OutlinedInput
            size="small"
            disabled={!state.enableTimeInterval}
            value={state.timeInterval}
            onChange={(e) => handleChange('timeInterval', e.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '10px', '& p': { fontWeight: 700 } }}>
                s
              </InputAdornment>
            }
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
      </Box>
      <Box className="flex settings__item" sx={{ alignItems: 'center' }}>
        <Typography sx={{ ...defSX.subTitle }}>{t('PDTriggerSignal.flashCounting', '闪喷计数')}</Typography>
        <OutlinedInput
          size="small"
          value={state.spitCount}
          onChange={(e) => handleChange('spitCount', e.target.value)}
          inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
          sx={{ ...defSX.inputBox, height: '22px' }}
        />
      </Box>
    </Box>
  );
}

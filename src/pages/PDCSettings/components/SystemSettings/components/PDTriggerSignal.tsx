import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput, InputAdornment } from '@mui/material';

import { useInitPdTrigger } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { PrintProductDetectItf } from '@/types';

interface State extends PrintProductDetectItf {}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    minWidth: '140px',
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
};
export default function PDTriggerSignal() {
  const { t } = useTranslation();

  const [state, setState] = useState<State>({
    xOffset: 0,
    filter: 0,
    minimumGap: 0,
  });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('PDTriggerSignal.lowLevelTrigger ', '低电平触发'),
      type: 'checkbox',
      itemkey: 'activeLow',
      value: false,
    },
    {
      label: `${t('PDTriggerSignal.lockTriggerInterval ', '锁定触发间隔')}`,
      type: 'checkbox',
      itemkey: 'lockout',
      value: false,
    },
  ]);
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useInitPdTrigger((data: PrintProductDetectItf) => {
    setState((prev) => ({
      ...prev,
      xOffset: data.xOffset,
      filter: data.filter,
      minimumGap: data.minimumGap,
      xdpi: data.xdpi,
    }));

    setCheck((prev) => {
      prev[0].value = data.activeLow;
      prev[1].value = data.lockout;
      return [...prev];
    });
  });

  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: parseFloat(val || '0') });

    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          productDetect: {
            ...prev.systemSetting?.productDetect,
            [key]: parseFloat(val || '0'),
            xdpi: state.xdpi,
          },
        },
      };
    });
  };

  const handleCheckChange = (key: string, val: boolean) => {
    setCheck((prev) => {
      const idx = prev.findIndex((item) => item.itemkey === key);
      if (idx >= 0) {
        prev[idx].value = val;
        return [...prev];
      }
      return prev;
    });

    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          productDetect: {
            ...prev.systemSetting?.productDetect,
            [key]: val,
            minimumGap: state.minimumGap,
          },
        },
      };
    });
  };

  return (
    <Box>
      <Box sx={{ flexWrap: 'wrap', whiteSpace: 'nowrap' }}>
        <Box className="flex settings__item" sx={{ mb: '12px', pr: '10px' }}>
          <Typography sx={{ ...defSX.subTitle }}>{t('PDTriggerSignal.triggerDisplacement', '触发位移')}</Typography>
          <OutlinedInput
            disabled
            size="small"
            value={state.xOffset}
            onChange={(e) => handleChange('xOffset', e.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '10px', '& p': { fontWeight: 700 } }}>
                mm
              </InputAdornment>
            }
            inputProps={{ step: 0.1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box className="flex settings__item" sx={{ mb: '6px', pr: '10px' }}>
          <Typography sx={{ ...defSX.subTitle }}>{`${t('PDTriggerSignal.filterSettings', '滤波设置')} (${t(
            'PDTriggerSignal.Microsecond',
            '微秒',
          )})`}</Typography>
          <OutlinedInput
            size="small"
            value={state.filter}
            onChange={(e) => handleChange('filter', e.target.value)}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box
          className="flex"
          sx={{
            mb: '6px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            '& .checkbox__item': { pl: '20px' },
          }}
        >
          {check.map((item, index) => (
            <Box
              className={`flex checkbox__item ord__${index}`}
              key={index}
              sx={{
                alignItems: 'center',
                '& .item__box': {
                  mt: '0',
                  '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
                },
              }}
            >
              <FormItem {...item} onChange={(key, val) => handleCheckChange(key, val as boolean)} />
            </Box>
          ))}
        </Box>
        <Box className="flex settings__item" sx={{ pr: '10px' }}>
          <Typography sx={{ ...defSX.subTitle }}>Lockout Minimum Gap</Typography>
          <OutlinedInput
            size="small"
            disabled={!check[1].value}
            value={state.minimumGap}
            onChange={(e) => handleChange('minimumGap', e.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '10px', '& p': { fontWeight: 700 } }}>
                mm
              </InputAdornment>
            }
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
      </Box>
    </Box>
  );
}

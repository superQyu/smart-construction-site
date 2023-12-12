import { useState } from 'react';
import type { HTMLProps, ReactDOM, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Radio, OutlinedInput, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

import { useInitDataPathMode } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { DataPathModeItf } from '@/types';

interface State extends DataPathModeItf {}

type ModeType = DataPathModeItf['mode'];
export interface Props extends HTMLProps<ReactDOM> {
  onModeChange?: (mode: ModeType) => void;
}

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
  radio: {
    color: '#648aff',
    '&.Mui-checked': {
      color: 'rgba(100,138,255,.85)',
    },
  },
};
export default function NozzlePowerSupply({ onModeChange }: Props) {
  const { t } = useTranslation();
  const setPdcSettingCtx = usePdcSettingsContext()[1];

  useInitDataPathMode((data: DataPathModeItf) => {
    setState(data);

    setCheck((prev) => {
      prev[0].value = data.fifoRightAlign;
      return [...prev];
    });
    onModeChange?.(data.mode);
  });

  const [state, setState] = useState<State>({ mode: 'fifo', fifoRightAlign: false, lookaheadCmdCount: 0 });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: `Right Align Images`,
      type: 'checkbox',
      itemkey: 'fifoRightAlign',
      value: true,
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPdcSettingCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        dataPathMode: {
          ...prev.systemSetting?.dataPathMode,
          [key]: val,
          mode: state.mode,
        },
      },
    }));
  };
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    onModeChange?.(e.target.value as ModeType);
    setState((prev) => ({ ...prev, mode: e.target.value as ModeType }));
    setPdcSettingCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        dataPathMode: {
          ...prev.systemSetting?.dataPathMode,
          mode: e.target.value as ModeType,
          lookaheadCmdCount: state.lookaheadCmdCount,
          fifoRightAlign: check[0].value as boolean,
        },
      },
    }));
  };

  return (
    <Box sx={{ p: '0 20px' }}>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          sx={{
            '& span.MuiFormControlLabel-label': { fontWeight: '700' },
            '& span.MuiButtonBase-root': { p: '4px 9px' },
          }}
          value={state.mode}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="fifo" control={<Radio sx={{ ...defSX.radio }} />} label="FIFO" />
          <Box className="flex settings__item">
            <Typography sx={{ ...defSX.subTitle }}>{`FIFO lookahead count`}</Typography>
            <OutlinedInput
              disabled={state.mode !== 'fifo'}
              size="small"
              value={state.lookaheadCmdCount}
              onChange={(e) => handleChange('lookaheadCmdCount', e.target.value)}
              inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
              sx={{ ...defSX.inputBox }}
            />
          </Box>
          {check.map((item, index) => (
            <Box
              className="flex"
              key={index}
              sx={{
                pl: '15px',
                alignItems: 'center',
                '& .item__box': {
                  mt: '0',
                  '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
                },
              }}
            >
              <FormItem {...item} onChange={handleChange} disabled={state.mode !== 'fifo'} />
            </Box>
          ))}
          <FormControlLabel
            value="singlePassScan"
            control={<Radio sx={{ ...defSX.radio }} />}
            label={t('NozzlePowerSupply.singleScan', '单向扫描')}
          />
          <FormControlLabel
            value="imageStore"
            control={<Radio sx={{ ...defSX.radio }} />}
            label={t('NozzlePowerSupply.imageScan', '图像存储')}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput } from '@mui/material';

import { global } from '@/config/UniversalSX';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';

interface State {
  [key: string]: string | number;
  multiplier: number;
  divider: number;
  printClock: number;
}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  boxInner: { width: '40%' },
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    minWidth: '40px',
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function Encoder() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      const headType = config?.System?.HeadType || config.System?.SubSys1?.HeadType;
      const xdpi = config[headType]?.Xdpi || config[headType]?.SubSys1?.Xdpi;
      const invert = config.Encoder?.Invert === '1';
      const quadrature = config.Encoder?.Quadrature === '1';
      const rightToLeft = (config.System?.RightToLeft || config?.System?.SubSys1?.RightToLeft) === '1';
      const printClock = parseInt(config.Encoder?.PrintClock || '0');

      setState((prev) => ({
        ...prev,
        multiplier: parseFloat(config.Encoder?.Multiplier || '0'),
        divider: parseFloat(config.Encoder?.Divider || '0'),
        DPI: parseFloat(xdpi || '0'),
        printClock: printClock || parseInt(localStorage.getItem(global.PRINT_CLOCK) || '0'),
      }));

      setCheck((prev) => {
        prev[0].value = quadrature;
        prev[1].value = invert;
        prev[2].value = printClock > 0;
        prev[3].value = rightToLeft;
        return [...prev];
      });
    }
  }, [config]);

  const [state, setState] = useState<State>({
    DPI: 0,
    multiplier: 0,
    divider: 0,
    printClock: 0,
  });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('genericName.orthogonal ', '正交'),
      type: 'checkbox',
      itemkey: 'quadrature',
      value: false,
    },
    {
      label: `${t('genericName.reverse ', '反向')}`,
      type: 'checkbox',
      itemkey: 'reverse',
      value: false,
      disabled: true,
    },
    {
      label: `${t('genericName.innerCoder ', '内部编码器')}`,
      type: 'checkbox',
      itemkey: 'enablePrintClock',
      value: false,
    },
    {
      label: `${t('encoder.printRightToLeft ', '从右到左打印')}`,
      type: 'checkbox',
      itemkey: 'printRightToLeft',
      value: false,
      disabled: true,
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: parseFloat(val || '0') });
    if (key === 'printClock') {
      localStorage.setItem(global.PRINT_CLOCK, val);
      setPdcSettingsCtx((prev) => {
        return {
          ...prev,
          systemSetting: {
            ...prev.systemSetting,
            encoder: {
              ...prev?.systemSetting?.encoder,
              printClock: parseFloat(val || '0'),
              enablePrintClock: true,
            },
          },
        };
      });
    }
  };

  const handleCheckChange = (key: string, val: boolean, idx: number) => {
    setCheck((prev) => {
      prev[idx].value = val;
      return [...prev];
    });

    if (key === 'enablePrintClock' || key === 'quadrature') {
      setPdcSettingsCtx((prev) => {
        return {
          ...prev,
          systemSetting: {
            ...prev.systemSetting,
            encoder: {
              ...prev?.systemSetting?.encoder,
              [key]: val,
              printClock: state.printClock,
            },
          },
        };
      });
    }
  };

  return (
    <Box>
      <Box
        className="flex"
        sx={{
          flexWrap: 'wrap',
          whiteSpace: 'nowrap',
          '& .settings__item': { flexBasis: '50%', mb: '10px', pr: '10px' },
        }}
      >
        <Box className="flex settings__item">
          <Typography sx={{ ...defSX.subTitle }}>{t('genericName.frequencyDoubling', '倍频')}</Typography>
          <OutlinedInput
            size="small"
            disabled
            value={state.multiplier}
            onChange={(e) => handleChange('multiplier', e.target.value)}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box className="flex settings__item">
          <Typography sx={{ ...defSX.subTitle }}>{t('genericName.frequencyDivision', '分频')}</Typography>
          <OutlinedInput
            disabled
            size="small"
            value={state.divider}
            onChange={(e) => handleChange('divider', e.target.value)}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box className="flex settings__item">
          <Typography sx={{ ...defSX.subTitle }}>DPI</Typography>
          <OutlinedInput
            disabled
            size="small"
            value={state.DPI}
            onChange={(e) => handleChange('DPI', e.target.value)}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
      </Box>
      <Box
        className="flex"
        sx={{
          flexWrap: 'wrap',
          '& .checkbox__item': {
            pl: '20px',
            '&.ord__0': { flexBasis: '20%' },
            '&.ord__1': { flexBasis: '20%' },
            '&.ord__2,&.ord__3': { flexBasis: '100%' },
          },
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
            <FormItem
              {...item}
              onChange={(key: string, newVal: any) => handleCheckChange(key, newVal as boolean, index)}
            />
            {item.itemkey === 'enablePrintClock' && (
              <OutlinedInput
                disabled={!check[2].value}
                size="small"
                value={state.printClock}
                onChange={(e) => handleChange('printClock', e.target.value)}
                inputProps={{ step: 1, min: 0, max: 999999, type: 'number' }}
                sx={{ borderRadius: '0', height: '22px', input: { p: '3px 14px' } }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

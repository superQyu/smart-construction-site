import { useState, useMemo } from 'react';
import type { HTMLProps, ReactDOM, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Radio,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { useInitImageStore } from '@/hooks/printer';
import { PrintImageStoreItf } from '@/types';

interface State extends PrintImageStoreItf {
  imageStorage: 'flashCard' | 'virtualFlashCard' | 'precacheRAM';
}
export interface Props extends HTMLProps<ReactDOM> {
  enableSaveImageMode?: boolean;
}

const defSX = {
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    width: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
  radio: {
    color: '#648aff',
    '&.Mui-checked': {
      color: 'rgba(100,138,255,.85)',
    },
  },
};
export default function ImageStorage({ enableSaveImageMode }: Props) {
  const { t } = useTranslation();
  const setPdcSettingCtx = usePdcSettingsContext()[1];

  const [state, setState] = useState<State>({
    imageStorage: 'flashCard',
    maxTileXLengthPixels: 0,
    maxJobSetCFMemoryPercent: 0,
    simFlashSizeBlocks: 0,
  });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: `Y Offset${t('ImageStorage.clearDuringChange', '变更时清除图像存储')}`,
      type: 'checkbox',
      itemkey: 'clearImageStoreOnYOffsetChange',
      value: true,
    },
  ]);

  useInitImageStore((data) => {
    setState((prev) => ({
      ...prev,
      ...data,
      simFlashSizeBlocks: data.simFlashSizeBlocks,
      imageStorage: data.enablePCCFlashCard ? 'flashCard' : data.enableVirtualCF ? 'virtualFlashCard' : 'precacheRAM',
    }));

    setCheck((prev) => {
      prev[0].value = data.clearImageStoreOnYOffsetChange;
      return [...prev];
    });
  });
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    setPdcSettingCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          imageStore: {
            ...prev.systemSetting?.imageStore,
            [key]: val,
            xdpi: state.xdpi,
          },
        },
      };
    });
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    type ImageStoreType = typeof state.imageStorage;
    const { value } = e.target;
    setState({ ...state, imageStorage: value as ImageStoreType });

    setPdcSettingCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          imageStore: {
            ...prev.systemSetting?.imageStore,
            directDDRAMAccess: value === 'precacheRAM',
            enablePCCFlashCard: value === 'flashCard',
            enableVirtualCF: value === 'virtualFlashCard',
            simFlashSizeBlocks: state.simFlashSizeBlocks,
            xdpi: state.xdpi,
          },
        },
      };
    });
  };

  const handleCheckChange = (key: string, val: any) => {
    setCheck((prev) => {
      const idx = prev.findIndex((item) => item.itemkey === key);
      if (idx >= 0) {
        prev[idx].value = val;
      }
      return [...prev];
    });
    setPdcSettingCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          imageStore: {
            ...prev.systemSetting?.imageStore,
            [key]: val,
          },
        },
      };
    });
  };

  const computedDisabledAll = useMemo(() => {
    return !enableSaveImageMode;
  }, [enableSaveImageMode]);
  return (
    <Box sx={{ p: '0 20px' }}>
      <FormControl className="w-full">
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          sx={{
            '& span.MuiFormControlLabel-label': { fontWeight: '700' },
            '& span.MuiButtonBase-root': { p: '4px 9px' },
          }}
          value={state.imageStorage}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="flashCard"
            disabled={computedDisabledAll}
            control={<Radio sx={{ ...defSX.radio }} />}
            label={`${t('ImageStorage.PCCflashCard', 'PCC闪存卡')}`}
          />
          <Box className="flex items-center">
            <FormControlLabel
              value="virtualFlashCard"
              sx={{ width: '250px' }}
              disabled={computedDisabledAll}
              control={<Radio sx={{ ...defSX.radio }} />}
              label={`${t('genericName.virtual', '虚拟')}${t('ImageStorage.PCCflashCard', '闪存卡')} (PC${t(
                'ImageStorage.hardDrive',
                '硬盘',
              )})`}
            />
            <OutlinedInput
              disabled={state.imageStorage !== 'virtualFlashCard' && computedDisabledAll}
              size="small"
              value={state.simFlashSizeBlocks}
              onChange={(e) => handleChange('simFlashSizeBlocks', parseInt(e.target.value || '0'))}
              endAdornment={<InputAdornment position="end">GB</InputAdornment>}
              inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
              sx={{ ...defSX.inputBox, minWidth: 'initial' }}
            />
          </Box>
          <FormControlLabel
            value="precacheRAM"
            disabled={computedDisabledAll}
            control={<Radio sx={{ ...defSX.radio }} />}
            label={`${t('ImageStorage.precache', '预缓存')}RAM`}
          />
        </RadioGroup>
      </FormControl>
      <Box>
        <Box className="flex settings__item" sx={{ mb: '5px' }}>
          <Typography sx={{ ...defSX.subTitle }}>{t('ImageStorage.imageMaxLength', '图像最大长度')}</Typography>
          <OutlinedInput
            size="small"
            disabled={computedDisabledAll}
            value={state.maxTileXLengthPixels}
            onChange={(e) => handleChange('maxTileXLengthPixels', parseInt(e.target.value))}
            endAdornment={<InputAdornment position="end">mm</InputAdornment>}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box className="flex settings__item">
          <Typography sx={{ ...defSX.subTitle }}>
            {t('ImageStorage.perImageMaxiUsedPercentage', '单图像内存占用最大百分比')}
          </Typography>
          <OutlinedInput
            size="small"
            value={state.maxJobSetCFMemoryPercent}
            disabled={computedDisabledAll}
            onChange={(e) => handleChange('maxJobSetCFMemoryPercent', parseInt(e.target.value))}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        {check.map((item, index) => (
          <Box
            className="flex"
            key={index}
            sx={{
              alignItems: 'center',
              '& .item__box': {
                mt: '0',
                '& .item__content__checkbox': { '.MuiFormControlLabel-label': { fontWeight: '700' } },
              },
            }}
          >
            <FormItem {...item} onChange={handleCheckChange} disabled={computedDisabledAll} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

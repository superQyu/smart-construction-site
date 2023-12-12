import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

import { useInitPrintHeadSystemInfo } from '@/hooks/printer';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { PrintHeadSystemInfo } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {}
const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '100%' },
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    minWidth: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
};
export default function PrintDataBitDepth() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];
  const [nozzleDefaultPosition, setNozzleDefaultPosition] = useState<formItemProps[]>([
    {
      label: t('printDataBitDepth.setting.printDataBitDepth', '打印数据位深度'),
      type: 'select',
      itemkey: 'bitsPerPixel',
      showTypography: false,
      value: '1',
      options: [
        { label: t('printDataBitDepth.setting.1bitPerPixel', '单点图（1bit）'), value: '1' },
        { label: t('printDataBitDepth.setting.2bitsPerPixel', '3级灰度 (2bits)'), value: '2' },
      ],
    },
    {
      label: t('printDataBitDepth.setting.singlePointsPlotGrayMapping', '单点图的灰度级映射'),
      type: 'select',
      itemkey: 'oneBppMapVal',
      showTypography: false,
      value: '1',
      options: [
        { label: t('printDataBitDepth.setting.grayLevel1', '第1级灰度'), value: '1' },
        { label: t('printDataBitDepth.setting.grayLevel2', '第2级灰度'), value: '2' },
        { label: t('printDataBitDepth.setting.grayLevel3', '第3级灰度'), value: '3' },
      ],
    },
  ]);

  useEffect(() => {
    if (config) {
      setNozzleDefaultPosition((prev) => {
        prev[1].value = config.Application?.OneBppMapVal || '3';
        return [...prev];
      });
    }
  }, [config]);

  useInitPrintHeadSystemInfo((data: PrintHeadSystemInfo[]) => {
    if (data.length > 0) {
      setNozzleDefaultPosition((prev) => {
        prev[0].value = data[0].bitsPerPixel || '1';
        return [...prev];
      });
    }
  });

  const handleChange = (key: string, val: any) => {
    setNozzleDefaultPosition((prev) => {
      const idx = prev.findIndex((item) => item.itemkey === key);
      prev[idx].value = val;
      return [...prev];
    });

    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev?.systemSetting,
          printDataBitsDepth: {
            ...prev?.systemSetting?.printDataBitsDepth,
            bitsPerPixel: nozzleDefaultPosition[0].value as string,
            oneBppMapVal: nozzleDefaultPosition[1].value as string,
            [key]: val,
          },
        },
      };
    });
  };
  return (
    <Box
      sx={{
        '& .item__label': { minWidth: 'initial' },
        '& .item__select': {
          borderRadius: 0,
          '& .MuiSelect-select': {
            padding: '3px 14px',
          },
          '.Mui-disabled': {
            background: '#f5f5f5',
          },
        },
      }}
    >
      {nozzleDefaultPosition.map((item, index) => (
        <Box key={index} className="flex" sx={{ ...defSX.box }}>
          <Typography sx={{ ...defSX.subTitle }}>{item.label}</Typography>
          <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
            <FormItem
              {...item}
              onChange={handleChange}
              disabled={item.itemkey === 'oneBppMapVal' && nozzleDefaultPosition[0].value === '1'}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

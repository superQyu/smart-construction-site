import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput, Tab, Tabs, RadioGroup } from '@mui/material';

import { useInitPlaneInfo } from '@/hooks/printer';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem from '@/components/CustomComponents/FormItem';
import { NozzleCompensationItf, PrintPlaneInfo } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {
  planeCount: number;
}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '40%' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function OrificeCompensation({ planeCount }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const { config } = useMeteorConfigContext();
  const setPdcSettingCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setInterPlaneMode(config.NozzleCompensation?.InterPlaneMode || '0');
    }
  }, [config]);

  useInitPlaneInfo(
    (data) => {
      setColorChannelTable(data);
    },
    planeCount,
    { nozzleCompensation: true },
  );

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [interPlaneMode, setInterPlaneMode] = useState('0');
  const [colorChannelTabs, setColorChannelTable] = useState<PrintPlaneInfo[]>([]);

  const handleInterPlaneModeChange = (value: string) => {
    setInterPlaneMode(value);
    setPdcSettingCtx((prev) => {
      return {
        ...prev,
        colorPlane: {
          ...prev.colorPlane,
          interPlaneMode: value,
        },
      };
    });
  };

  const handleColorChannelChange = (idx: number, key: keyof NozzleCompensationItf, val: any) => {
    setColorChannelTable((prev) => {
      if (prev[idx].nozzleCompensation) {
        prev[idx].nozzleCompensation![key] = val;
      }

      return [...prev];
    });

    setPdcSettingCtx((prev) => {
      const planeInfoArr =
        prev.colorPlane?.planeInfoArr?.map((item, idx) => Object.assign({}, colorChannelTabs?.[idx], item)) ||
        colorChannelTabs;
      planeInfoArr[idx].nozzleCompensation![key] = val;
      return {
        ...prev,
        colorPlane: {
          ...prev.colorPlane,
          planeInfoArr: [...planeInfoArr],
        },
      };
    });
  };

  return (
    <Box>
      <Box className="flex" sx={{ mr: '60px', mb: '16px' }}>
        <Typography sx={{ ...defSX.subTitle, fontWeight: 700 }}>
          {t('ColorChannel.setting.sameColorCompensationMode', '同色补偿模式')}
        </Typography>
        <Box>
          <OutlinedInput
            size="small"
            value={interPlaneMode}
            onChange={(e) => handleInterPlaneModeChange(e.target.value)}
            inputProps={{
              step: 1,
              min: 0,
              max: 4,
              type: 'number',
            }}
            sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 65 }}
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%', border: '1px solid #dcdcdc' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleTabChange}
            aria-label="color-channel-tabs"
            sx={{
              backgroundColor: '#eff3ff',
              minHeight: '30px',
              '& .MuiTabs-indicator': { backgroundColor: '#7191ff' },
            }}
          >
            {colorChannelTabs.map((item, index) => (
              <Tab
                key={index}
                label={`${t('genericName.ColorChannel', '颜色通道')}${item.order}(${item.name})`}
                id={`color-channel-tab-${index}`}
                aria-controls={`color-channel-tabpanel-${index}`}
                sx={{
                  minHeight: '30px',
                  p: '9px 16px',
                  fontWeight: 700,
                  '&.Mui-selected': {
                    color: '#7191ff',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
        {colorChannelTabs.map((item, index) => (
          <Box
            key={index}
            hidden={value !== index}
            id={`color-channel-tab-${index}`}
            aria-labelledby={`color-channel-tab-${index}`}
          >
            {value === index && (
              <Box
                className="flex"
                sx={{
                  p: '10px 25px',
                  '& .item__box': {
                    mt: 0,
                    '& .item__content__radio': {
                      minWidth: 65,
                      pl: '10px',
                      '& .MuiFormControlLabel-label': { color: '#999' },
                    },
                  },
                }}
              >
                <RadioGroup
                  row
                  value={item.nozzleCompensation?.samePlaneMode}
                  onChange={(event) => handleColorChannelChange(index, 'samePlaneMode', event.target.value)}
                >
                  <FormItem
                    {...{
                      label: t('genericName.notSpraying', '不喷'),
                      type: 'radio',
                      itemkey: 'notSpraying',
                      value: '0',
                      isGroupItem: true,
                    }}
                  />
                  <FormItem
                    {...{
                      label: t('genericName.compensate', '补偿'),
                      type: 'radio',
                      itemkey: 'compensate',
                      value: '1',
                      isGroupItem: true,
                    }}
                  />
                </RadioGroup>
                <Box className="flex" sx={{ alignItems: 'center', mr: '20px' }}>
                  <Typography sx={{ ...defSX.subTitle, color: '#999' }}>
                    {t('ColorChannel.setting.horCompensationWidth', '水平补偿宽度')}
                  </Typography>
                  <Box>
                    <OutlinedInput
                      disabled={item.nozzleCompensation?.samePlaneMode === '0'}
                      size="small"
                      value={item.nozzleCompensation?.sampleExtentHorizontal}
                      onChange={(event) =>
                        handleColorChannelChange(index, 'sampleExtentHorizontal', parseInt(event.target.value))
                      }
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 99999,
                        type: 'number',
                      }}
                      sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 105 }}
                    />
                  </Box>
                </Box>
                <Box className="flex" sx={{ alignItems: 'center' }}>
                  <Typography sx={{ ...defSX.subTitle, color: '#999' }}>
                    {t('ColorChannel.setting.verCompensationWidth', '垂直补偿宽度')}
                  </Typography>
                  <Box>
                    <OutlinedInput
                      disabled={item.nozzleCompensation?.samePlaneMode === '0'}
                      size="small"
                      onChange={(event) =>
                        handleColorChannelChange(index, 'sampleExtentVertical', parseInt(event.target.value))
                      }
                      value={item.nozzleCompensation?.sampleExtentVertical}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 99999,
                        type: 'number',
                      }}
                      sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 85 }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

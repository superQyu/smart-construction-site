import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput, Grid } from '@mui/material';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import { global } from '@/config/UniversalSX';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import SubCard from '@/components/ContentCard/SubCard';

import ColorChannelTable from './components/ColorChannelTable';
import OrificeCompensation from './components/OrificeCompensation';
import InkVolumePrediction from './components/InkVolumePrediction';
import MaintenanceBar from './components/MaintenanceBar';
import TemperatureShrinkage from './components/TemperatureShrinkage';

interface ColorChannel {
  [key: string]: boolean;
}
interface State {
  channelCount: number;
  [key: string]: string | number | ColorChannel;
}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  boxInner: { width: '40%' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function ColorChannel() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setCheck((prev) => {
        prev[0].value = config.NozzleCompensation?.GlobalEnable == '1';
        prev[1].value = config.Application?.InkEstimationEnabled == '1';
        prev[2].value = localStorage.getItem(global.SHOW_MAINTAIN_BAR) === 'true';
        prev[3].value = config.TemperatureContraction?.Enabled === '1';

        return [...prev];
      });

      setState((prev) => ({
        ...prev,
        channelCount: parseInt(config.Application?.ConfiguredPlaneCount || '0'),
      }));

      setPdcSettingCtx((prev) => {
        return {
          ...prev,
          colorPlane: {
            ...prev?.colorPlane,
            orificeCompensation: config.NozzleCompensation?.GlobalEnable == '1',
            inkVolumePrediction: config.Application?.InkEstimationEnabled == '1',
            temperatureContraction: config.TemperatureContraction?.Enabled === '1',
          },
        };
      });
    }
  }, [config]);

  const [state, setState] = useState<State>({
    channelCount: 0,
  });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('ColorChannel.setting.orificeCompensation ', '喷孔补偿'),
      type: 'checkbox',
      showTypography: false,
      itemkey: 'orificeCompensation',
      value: false,
    },
    {
      label: `${t('ColorChannel.setting.inkVolumePrediction ', '墨量预测')}`,
      type: 'checkbox',
      showTypography: false,
      itemkey: 'inkVolumePrediction',
      value: false,
    },

    {
      label: `${t('ColorChannel.setting.maintenanceBar ', '维护条')}`,
      type: 'checkbox',
      showTypography: false,
      itemkey: 'maintainBar',
      value: false,
    },
    {
      label: `${t('ColorChannel.setting.temperatureShrinkage ', '温度收缩')}`,
      type: 'checkbox',
      showTypography: false,
      itemkey: 'temperatureContraction',
      value: false,
    },
  ]);
  const handleInputChange = (key: string, val: any) => {
    if (key === 'channelCount') {
      setState((prev) => ({
        ...prev,
        [key]: parseInt(val),
      }));

      setPdcSettingCtx((prev) => ({
        ...prev,
        colorPlane: {
          ...prev.colorPlane,
          channelCount: parseInt(val),
        },
      }));
    }
  };

  const handleChange = (key: string, val: any) => {
    setCheck((prev) => {
      const idx = prev.findIndex((data) => data.itemkey === key);
      if (idx < 0) {
        return prev;
      }

      prev[idx].value = val;

      return [...prev];
    });

    if (key === 'maintainBar') {
      localStorage.setItem(global.SHOW_MAINTAIN_BAR, val ? 'true' : 'false');
    }

    setPdcSettingCtx((prev) => {
      return {
        ...prev,
        colorPlane: {
          ...prev.colorPlane,
          [key]: val,
        },
      };
    });
  };

  return (
    <Box className="overflow-y-auto" sx={{ bgcolor: 'background.paper', height: '100%', padding: '0 5px' }}>
      <SubCard
        contentClassName="flex flex-col p4! overflow-y-auto"
        Head={() => (
          <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
            {t('genericName.setting', '配置')}
          </Typography>
        )}
      >
        <Box
          sx={{
            pl: '60px',
            '&>.flex': {
              '&>div:not(:nth-of-type(1))': {
                ml: '24px',
              },
            },
          }}
        >
          <Box
            className="flex"
            sx={{
              '&>div': { pl: '10px' },
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              className="flex settings__item"
              sx={{
                '& .item__box': { mt: '0', '.item__label': { minWidth: '60px' } },
                '& .item__content__text': {
                  width: 'initial',
                  minWidth: 'initial',
                },
              }}
            >
              <FormItem
                {...{
                  label: t('ColorChannel.setting.channelCount', '通道总数'),
                  type: 'text',
                  itemkey: 'channelCount',
                  value: `${state.channelCount}`,
                }}
              />
            </Box>
            <Box className="flex settings__item">
              <Typography sx={{ ...defSX.subTitle }}>{t('genericName.setTo', '设置为')}</Typography>
              <Box>
                <OutlinedInput
                  size="small"
                  value={state.channelCount}
                  onChange={(e) => handleInputChange('channelCount', e.target.value)}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 16,
                    type: 'number',
                  }}
                  sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 105 }}
                />
              </Box>
            </Box>
            {check.map((item, index) => (
              <Box key={index} className="flex">
                <Box
                  sx={{
                    '& .item__box': {
                      mt: '0',
                      '& .item__content__checkbox': {
                        pl: '10px',
                        '.MuiFormControlLabel-label': {
                          fontWeight: '700',
                        },
                      },
                    },
                  }}
                >
                  <FormItem {...item} onChange={handleChange} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </SubCard>
      <SubCard
        contentClassName="flex flex-col p4!"
        sx={{ maxHeight: 'initial' }}
        Head={() => (
          <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
            {t('genericName.ColorChannel', '颜色通道')}
          </Typography>
        )}
      >
        <ColorChannelTable planeCount={state.channelCount} />
      </SubCard>
      {check[0].value && (
        <SubCard
          contentClassName="flex flex-col p4! overflow-y-auto"
          Head={() => (
            <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
              {t('ColorChannel.setting.orificeCompensation ', '喷孔补偿')}
            </Typography>
          )}
        >
          <OrificeCompensation planeCount={state.channelCount} />
        </SubCard>
      )}

      <Grid container spacing={0.5}>
        {check[1].value && (
          <Grid item xs={12} sm={6} md={5}>
            <SubCard
              contentClassName="flex flex-col p4! overflow-y-auto"
              Head={() => (
                <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                  {t('ColorChannel.setting.inkVolumePrediction ', '墨量预测')}
                </Typography>
              )}
            >
              <InkVolumePrediction planeCount={state.channelCount} />
            </SubCard>
          </Grid>
        )}
        {check[2].value && (
          <Grid item xs={12} sm={6} md={3}>
            <SubCard
              contentClassName="flex flex-col p4! overflow-y-auto"
              Head={() => (
                <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                  {t('ColorChannel.setting.maintenanceBar ', '维护条')}
                </Typography>
              )}
            >
              <MaintenanceBar />
            </SubCard>
          </Grid>
        )}
        {check[3].value && (
          <Grid item xs={12} sm={6} md={6}>
            <SubCard
              contentClassName="flex flex-col p4! overflow-y-auto"
              Head={() => (
                <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                  {t('ColorChannel.setting.temperatureShrinkage ', '温度收缩')}
                </Typography>
              )}
            >
              <TemperatureShrinkage planeCount={state.channelCount} />
            </SubCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSnackbar } from '@/context/SnackbarContext';
import { useInitHeadInfo, useInitYinterlace, useInitPccInfo } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import SubCard from '@/components/ContentCard/SubCard';
import PlaneTable from './PlaneTable';
import SplicingMethod from './SplicingMethod';
import NozzleSchematic from './NozzleSchematic';
import { PrintHeadInfoItf, PrintPCCInfoData } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '40%' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '30px',
    fontWeight: 700,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
  subCardBox: {
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
  },
};
export default function SprayNozzleSettings() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  const [state, setState] = useState<boolean>(false);

  const [nozzleDefaultPosition] = useState<formItemProps[]>([
    {
      label: `Y${t('genericName.direction', '方向')}`,
      type: 'select',
      itemkey: 'directionY',
      showTypography: false,
      value: 'ascending',
      options: [
        { label: t('genericName.ascending', '升序'), value: 'ascending' },
        { label: t('genericName.descending', '降序'), value: 'descending' },
      ],
    },
    {
      label: t('genericName.colorChannel', '颜色通道'),
      type: 'select',
      itemkey: 'colorChannel',
      showTypography: false,
      value: 'all',
      options: [{ label: t('genericName.allColorChannel', '全颜色通道'), value: 'all' }],
    },
  ]);

  const [planeTable, setPlaneTable] = useState<PrintHeadInfoItf[]>([]);
  const [colorPlaneOptions, setColorPlaneOptions] = useState<{ label: string; value: string }[]>([
    { label: t('genericName.allColorChannel', '全颜色通道'), value: 'all' },
  ]);
  const [yInterlace, setYinterlance] = useState<formItemProps>({
    label: `Y${t('genericName.staggered', '交错')}`,
    type: 'select',
    itemkey: 'yInterlace',
    showTypography: false,
    value: '1',
    options: [
      { label: '1 (600DPI)', value: '1' },
      { label: '2 (1200DPI)', value: '2' },
    ],
  });

  const [pccInfo] = useInitPccInfo(() => {});
  const [headInfo] = useInitHeadInfo(() => {});

  useEffect(() => {
    if (pccInfo && headInfo) {
      setPlaneTable(
        (headInfo as PrintHeadInfoItf[]).map((item) => item!.setExtension!(item, pccInfo as PrintPCCInfoData[])),
      );
    }

    if (headInfo) {
      if ((headInfo as PrintHeadInfoItf[]).some((item) => item.planesPerHDC === 2)) {
        setYinterlance((prev) => {
          return {
            ...prev,
            options: [
              { label: '1 (300DPI)', value: '1' },
              { label: '2 (600DPI)', value: '2' },
            ],
          };
        });
      }

      setColorPlaneOptions((prev) => {
        return [
          prev[0],
          ...(headInfo as PrintHeadInfoItf[]).map((item) => ({
            label: `${t('genericName.colorChannel', '颜色通道')}${item.planeNum} (${item.title}${item.subTitle || ''})`,
            value: item.planeNum.toString(),
          })),
        ];
      });
    }
  }, [pccInfo, headInfo]);

  useInitYinterlace((data: string) => {
    setYinterlance((prev) => {
      return {
        ...prev,
        value: data,
      };
    });
  });

  const handleTableState = (outIdx: number, index: number, key: string, val: any) => {
    if (planeTable?.[outIdx]?.data?.[index]) {
      planeTable![outIdx]!.data![index] = {
        ...planeTable![outIdx]!.data![index],
        [key]: val,
      };
    }
    setPlaneTable([...planeTable]);
    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        headSetting: {
          ...prev.headSetting,
          planeTable: [...planeTable],
        },
      };
    });
  };

  const handleChange = (key: string) => {
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  const handleHeadEnableStatus = (outIdx: number, checked: boolean) => {
    setPlaneTable((prev) => {
      prev[outIdx].data?.forEach((item) => (item.enabled = checked));
      return [...prev];
    });
  };

  const handleYinterlaceChange = (key: string, val: string) => {
    setYinterlance((prev) => {
      return {
        ...prev,
        value: val,
      };
    });
    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        headSetting: {
          ...prev.headSetting,
          [key]: val,
        },
      };
    });
  };
  const handleCheckBoxChange = (val: boolean) => {
    setState(val);
  };
  return (
    <Box className="flex flex-col overflow-y-auto" sx={{ bgcolor: 'background.paper', height: '100%' }}>
      <Grid className="h-full" sx={{}} container>
        <Grid xs={12} sm={12} md={state ? 12 : 10} className="flex flex-col">
          <SubCard
            contentClassName="flex flex-col"
            sx={{ flexBasis: 'inherit' }}
            Head={() => (
              <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                {t('genericName.nozzleDefaultPosition ', '设置喷头默认起始位置')}
              </Typography>
            )}
          >
            <Box sx={{ ...defSX.subCardBox }}>
              {[0, 1]
                .map((index) => nozzleDefaultPosition[index])
                .map((item, index) => (
                  <Box key={index} className="flex" sx={{ ...defSX.box }}>
                    <Typography sx={{ ...defSX.subTitle }}>{item.label}</Typography>
                    <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
                      <FormItem {...item} onChange={handleChange} />
                    </Box>
                  </Box>
                ))}

              <Box className="flex items-center mt1 mr1" sx={{ mb: '10px' }}>
                <Typography sx={{ ...defSX.subTitle, width: '100px' }}>
                  {t('genericName.stitchPixel', '拼接像素')}
                </Typography>
                <OutlinedInput
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 99999,
                    type: 'number',
                  }}
                  sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                />
              </Box>
            </Box>
          </SubCard>
          <SubCard
            contentClassName="flex flex-col p4!"
            sx={{ flexBasis: 'inherit' }}
            Head={() => (
              <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                {t('genericName.settings', '设置')}
              </Typography>
            )}
          >
            <Box sx={{ ...defSX.subCardBox }}>
              <Box className="flex">
                <Typography sx={{ ...defSX.subTitle }}>{yInterlace.type !== 'checkbox' && yInterlace.label}</Typography>
                <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
                  <FormItem {...yInterlace} onChange={(k, v) => handleYinterlaceChange(k, v as string)} />
                </Box>
              </Box>
              <Box
                className="flex checkbox__item"
                sx={{
                  alignItems: 'center',
                  pl: '130px',
                  '& .item__box': {
                    mt: '0',
                    '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
                  },
                }}
              >
                <FormItem
                  {...{
                    label: t('genericName.usingSplicingSiteNozzle', '使用拼接部位的喷嘴'),
                    type: 'checkbox',
                    itemkey: 'usingSplicingSiteNozzle',
                    value: state,
                  }}
                  onChange={(_, val) => handleCheckBoxChange(val as boolean)}
                />
              </Box>
            </Box>
          </SubCard>
          <SubCard sx={{ flex: 1 }} contentClassName="flex flex-col">
            <PlaneTable
              planeTable={planeTable}
              colorPlaneOptions={colorPlaneOptions}
              onTableState={handleTableState}
              onHeadEnableStatus={handleHeadEnableStatus}
            />
          </SubCard>
        </Grid>
        {state ? (
          ''
        ) : (
          <Grid xs={12} sm={12} md={state ? 12 : 2} className="flex flex-col">
            <SubCard
              contentClassName="flex flex-col"
              sx={{ flexBasis: 'inherit', flexGrow: 1 }}
              Head={() => (
                <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                  {t('genericName.nozzleSplicingMethod', '喷头拼接方式')}
                </Typography>
              )}
            >
              <Box sx={{ ...defSX.subCardBox }}>
                <SplicingMethod />
              </Box>
            </SubCard>
            <SubCard
              contentClassName="flex flex-col preview"
              sx={{ flexBasis: 'inherit', flexGrow: 1, '& .preview': { p: '5px 9px' } }}
              Head={() => (
                <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
                  {t('genericName.nozzleSchematicDiagram', '喷头交接示意')}
                </Typography>
              )}
            >
              <Box sx={{ ...defSX.subCardBox }} className="w-full h-full">
                <NozzleSchematic />
              </Box>
            </SubCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

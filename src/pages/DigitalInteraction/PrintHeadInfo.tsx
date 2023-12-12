import { ReactNode, type HTMLProps, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Box, Paper, type SxProps, type Theme, TextField, Slider, Switch } from '@mui/material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import Grid from '@mui/material/Unstable_Grid2';

import CustomCard from '@/components/CustomCard';
import apis from '@/apis';
import { PrintHeadInfoData, PrintHeadInfoItf } from '@/types';
import PccStatus from './PccStatus';
import { useInitHeadInfo } from '@/hooks/printer';
import { useOnceCall } from '@/hooks';
import { freqToSpeed } from '@/utils';

function PrintHeadInfoCard({
  data,
  className,
  sx,
  label,
  showTemp,
}: {
  children?: ReactNode;
  data: PrintHeadInfoData;
  className?: string;
  sx?: SxProps<Theme>;
  label?: ReactNode | string;
  showTemp?: boolean;
}) {
  const marks = [
    {
      value: 0,
      label: '0°C',
    },

    {
      value: 20,
      label: '20°C',
    },

    {
      value: 40,
      label: '40°C',
    },
    {
      value: 60,
      label: '60°C',
    },
  ];

  return (
    <Paper
      variant="outlined"
      className={`p1 pl3 flex flex-col items-center justify-start w-full ${className}`}
      sx={{ borderColor: data.color, backgroundColor: 'transparent', ...sx }}
      square
    >
      {label && (
        <Box className="w-full">
          <Typography>{label}</Typography>
        </Box>
      )}
      <Slider
        aria-label="Always visible"
        defaultValue={80}
        value={data.temperature}
        getAriaValueText={(value) => `${value}°C`}
        step={10}
        marks={marks}
        valueLabelFormat={(value) => `${value}°C`}
        sx={{
          '& .Mui-disabled': {
            color: data.color,
          },
          '& .MuiSlider-track': {
            color: data.color,
          },
          '& .MuiSlider-rail': {
            color: data.color,
            opacity: 0.3,
          },
          '& .MuiSlider-thumb': {
            backgroundColor: data.color,
          },
          '& .MuiSlider-mark': {
            backgroundColor: data.color,

            '&.MuiSlider-markActive': {
              opacity: 1,
              backgroundColor: data.color,
            },
          },
        }}
        valueLabelDisplay={showTemp ? 'on' : 'auto'}
      />
    </Paper>
  );
}

export default function PrintHeadInfo(props: HTMLProps<any>) {
  const { t } = useTranslation();
  const [speed, setSpeed] = useState(0);
  const [showTemp, setShowTemp] = useState(false);
  const [frequency, setFrequency] = useState(0);
  const [printHeadInfoArr, setPrintHeadInfoArr] = useState<PrintHeadInfoItf[]>([]);
  const [pccRequired, setPccRequired] = useState(0);

  const headInfoIntervalRef = useRef<any>(null);

  useInitHeadInfo((data: PrintHeadInfoItf[]) => {
    setPrintHeadInfoArr(data);
  });

  useOnceCall(() => {
    initHeadInfo();
    headInfoIntervalRef.current = setInterval(() => {
      initHeadInfo();
    }, 10000);
  }, printHeadInfoArr.length > 0);

  useEffect(() => {
    initSpeed();
    initPccInfo();

    const intervalSpeed = setInterval(() => {
      initSpeed();
    }, 10000);

    const intervalPcc = setInterval(() => {
      initPccInfo();
    }, 10000);

    return () => {
      clearInterval(headInfoIntervalRef.current);
      clearInterval(intervalSpeed);
      clearInterval(intervalPcc);
    };
  }, []);

  function initHeadInfo() {
    printHeadInfoArr.map(
      (item: PrintHeadInfoItf, outIdx: number) =>
        item?.data?.map((data, innerIdx) =>
          apis.pcc.queryPccHeadTemperature(data.pcc, [data.pccPosition]).then((res) => {
            setPrintHeadInfoArr(
              (prev) =>
                prev.map((phi, idx) => {
                  if (idx !== outIdx) {
                    return phi;
                  }

                  return {
                    ...phi,
                    data: phi?.data?.map((item, idx) => {
                      if (idx !== innerIdx) {
                        return item;
                      }
                      return {
                        ...item,
                        temperature: res.value[0]?.temperature?.head || 0,
                      };
                    }),
                  };
                }) as PrintHeadInfoItf[],
            );
          }),
        ),
    );
  }

  function initPccInfo() {
    apis.printer.queryPrintStatus().then((resp) => {
      setPccRequired(resp.value.pccsRequired || 0);
    });
  }

  function initSpeed() {
    apis.printer.queryPrintStatus().then(async (resp) => {
      const cfgData = await apis.config.queryConfigCurrent().catch(() => {});
      setFrequency(resp.value.printSpeed);
      setSpeed(freqToSpeed(resp.value.printSpeed, cfgData.value.baseXDpi));
    });
  }

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(2)} ${t('printHeadInfo.speedUnit', '毫米/秒')}`;
  };

  const formatFreq = (frequency: number) => {
    return `${frequency} ${t('printHeadInfo.frequencyUnit', '赫兹（HZ）')}`;
  };

  return (
    <CustomCard
      {...props}
      Head={() => (
        <Box className="flex justify-between items-center w-full">
          <Box className="flex items-center">
            <DisplaySettingsIcon sx={{ color: 'primary.main' }} className="mr2" />
            <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.displayInfo', '喷头信息')}</Typography>
          </Box>

          <Box className="flex justify-end items-center">
            <Typography>{t('digitalInteraction.displayTemp', '显示温度')}</Typography>
            <Switch size="small" checked={showTemp} onChange={(event) => setShowTemp(event.target.checked)} />
          </Box>
        </Box>
      )}
      contentClassName="py1 px2 overflow-y-auto"
    >
      <Box className="flex flex-col h-full w-full ">
        <Box className="flex items-center mt2 mb1">
          <TextField
            size="small"
            label={<Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.frequency', '喷头频率')}</Typography>}
            value={formatFreq(frequency)}
            InputProps={{
              readOnly: true,
            }}
            className="flex-basis-50%"
            sx={{
              mr: '4px',
            }}
          />
          <TextField
            size="small"
            label={<Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.speed', '喷头速度')}</Typography>}
            value={formatSpeed(speed)}
            className="flex-basis-50%"
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Grid container spacing={0.5} sx={{ margin: 0 }}>
          {new Array(pccRequired).fill(0).map((_, idx: number) => (
            <Grid key={idx} sm={1.5}>
              <PccStatus pccNum={idx + 1} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={0.5} className="h-full" sx={{ margin: 0 }}>
          {printHeadInfoArr.map((item: PrintHeadInfoItf, idx: number) => (
            <Grid sm={6} xs={12} key={idx}>
              <CustomCard
                square
                className="h-full"
                contentClassName="flex flex-col items-center w-full p2"
                sx={{ background: '#f8f9fd' }}
              >
                <Box className="w-full flex items-center justify-start" sx={{ color: item.color }}>
                  <Typography>{item.title}</Typography>
                  <Typography>{item.subTitle}</Typography>
                </Box>
                <Box className="w-full">
                  {item.data?.map((data: PrintHeadInfoData, i: number) => (
                    <PrintHeadInfoCard
                      data={data}
                      key={i}
                      sx={{ marginTop: `${i * 2}px` }}
                      label={`${data.pcc}: ${data.pccPosition}`}
                      showTemp={showTemp}
                    />
                  ))}
                </Box>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </CustomCard>
  );
}

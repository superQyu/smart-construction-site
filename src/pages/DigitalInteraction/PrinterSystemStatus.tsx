import { type HTMLProps, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Box, IconButton, CircularProgress, TextField, Divider } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

import apis from '@/apis';
import CustomCard from '@/components/CustomCard';
import PrinterStatus from '@/components/printer/PrinterStatus';
import { usePrinterError } from '@/hooks/printer';

export default function PrinterSystemStatus(props: HTMLProps<any>) {
  const { t } = useTranslation();
  const [loadingState, setLoading] = useState<Record<string, boolean>>({});

  const { handleERet, handleAppError } = usePrinterError();

  const actions = [
    {
      label: t('digitalInteraction.actions.start', '启动'),
      action: 'start',
      click: () => {
        loadingWrapper('start', async () => {
          await apis.printer.open().then(
            (resp) => {
              handleERet(resp, t('digitalInteraction.actions.start', '启动'));
            },
            (err) => {
              handleAppError(err);
            },
          );

          return apis.pcc.powerOnPCC('on');
        }).then(
          (resp) => {
            handleERet(resp, t('digitalInteraction.actions.powerOn', '上电'));
          },
          (err) => {
            handleAppError(err);
          },
        );
      },
      Icon: ({ className }: { className?: string }) => (
        <PlayCircleFilledWhiteIcon fontSize="large" className={className} sx={{ color: '#1dc9a1' }} />
      ),
    },
    {
      label: t('digitalInteraction.actions.stop', '停止'),
      action: 'stop',
      click: () => {
        loadingWrapper('stop', () => apis.printer.close()).then(
          (resp) => {
            handleERet(resp, t('digitalInteraction.actions.stop', '停止'));
          },
          (err) => {
            handleAppError(err);
          },
        );
      },
      Icon: ({ className }: { className?: string }) => (
        <StopCircleIcon fontSize="large" className={className} sx={{ color: '#ff535f' }} />
      ),
    },
    {
      label: t('digitalInteraction.actions.pause', '暂停'),
      action: 'pause',
      click: () => {
        loadingWrapper('pause', () => apis.printer.abort()).then(
          (resp) => {
            handleERet(resp, t('digitalInteraction.actions.pause', '暂停'));
          },
          (err) => {
            handleAppError(err);
          },
        );
      },
      Icon: ({ className }: { className?: string }) => (
        <PauseCircleOutlineIcon className={className} fontSize="large" sx={{ color: '#ffd74c' }} />
      ),
    },
    {
      label: t('digitalInteraction.actions.initial', '初始化'),
      action: 'initial',
      click: () => {
        loadingWrapper('initial', async () => {
          await apis.printer.close();
          return apis.printer.open();
        })
          .then((resp) => {
            handleERet(resp, t('digitalInteraction.actions.initial', '初始化'));
          })
          .catch((err) => {
            handleAppError(err);
          });
      },
      Icon: ({ className }: { className?: string }) => (
        <RotateLeftIcon className={className} fontSize="large" sx={{ color: '#ff8e31' }} />
      ),
    },
  ];

  async function loadingWrapper(action: string, callback: () => Promise<any>) {
    setLoading({
      ...loadingState,
      [action]: true,
    });

    return callback().then(
      (resp) => {
        setLoading({
          ...loadingState,
          [action]: false,
        });
        return resp;
      },
      (err) => {
        setLoading({
          ...loadingState,
          [action]: false,
        });
        return Promise.reject(err);
      },
    );
  }

  const [printerState, setPrinterState] = useState(-1);
  useEffect(() => {
    initQueryPrinterStatus();
    const stateInterval = setInterval(() => {
      initQueryPrinterStatus();
    }, 10000);

    return () => clearInterval(stateInterval);
  }, []);

  function initQueryPrinterStatus() {
    apis.printer.queryPrintStatus().then((resp) => {
      setPrinterState(resp.value.printerState);
    });
  }

  return (
    <CustomCard
      {...props}
      Head={() => (
        <Box className="flex justify-between w-full items-center">
          <Box className="flex items-center">
            <ComputerIcon sx={{ color: 'primary.main' }} className="mr2" />
            <Typography sx={{ fontWeight: 700 }}>
              {t('digitalInteraction.printerSystemStatus', '打印系统信息')}
            </Typography>
          </Box>

          <Box className="flex justify-end items-center">
            <PrinterStatus printerState={printerState} />
          </Box>
        </Box>
      )}
      contentClassName="p2 flex flex-col overflow-y-auto"
    >
      <Box className="flex items-center flex-wrap justify-between ">
        {actions.map((item, idx: number) => (
          <Box onClick={item.click} className="flex flex-col items-center cursor-pointer px2" key={idx}>
            <IconButton disabled={loadingState['start']}>
              <item.Icon className="lg:text-3xl! xxl:text-4xl!" />
              {loadingState[item.action] && (
                <CircularProgress
                  className="w-22px! h-22px! lg:w-27px! lg:h-27px!  xxl:w-34px! xxl:h-34px!"
                  sx={{
                    position: 'absolute',
                    top: 9,
                    left: 9,
                    zIndex: 1,
                  }}
                />
              )}
            </IconButton>
            <Typography className="mt4">{item.label}</Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ marginY: '1rem' }} />
      <Box className="flex mt2">
        <TextField
          size="small"
          label={<Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.totalLength', '打印总长度')}</Typography>}
          value={1}
          InputProps={{
            readOnly: true,
          }}
          className="flex-basis-50%"
          sx={{ mr: '8px' }}
        />
        <TextField
          size="small"
          label={<Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.totalArea', '打印总面积')}</Typography>}
          value={1}
          InputProps={{
            readOnly: true,
          }}
          className="flex-basis-50%"
        />
      </Box>
    </CustomCard>
  );
}

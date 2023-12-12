import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Box, type BoxProps } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import apis from '@/apis';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

interface Props extends BoxProps {
  pccNum: number;
}

export default function PccStatus({ pccNum, sx, className, ...restProps }: Props) {
  const { t } = useTranslation();

  const pccStatus = [
    {
      title: t('digitalInteraction.pccStatus.unconnected', 'PCC未连接'),
      value: 'unconnected',
      color: 'gray',
    },
    {
      title: t('digitalInteraction.pccStatus.initial', 'PCC正在初始化'),
      value: 'initial',
      color: 'purple',
    },
    {
      title: t('digitalInteraction.pccStatus.initFailed', 'PCC初始化失败'),
      value: 'initFailed',
      color: 'red',
    },
    {
      title: t('digitalInteraction.pccStatus.normal', 'PCC正常工作'),
      value: 'normal',
      color: 'green',
    },
  ];

  const [status, setStatus] = useState(pccStatus[0]);
  const [num] = useState(0);

  useEffect(() => {
    initPccState();
    const pccStateInterval = setInterval(() => {
      initPccState();
    }, 100000);

    return () => {
      clearInterval(pccStateInterval);
    };
  }, []);

  function initPccState() {
    apis.pcc.queryPccState(pccNum).then((resp) => {
      switch (resp.value) {
        case 0: // PS_DISCONNECTED
          setStatus(pccStatus[0]);
          break;
        case 1: // PS_CONNECTED
        case 2: // PS_IDLE
        case 3: // PS_READY
        case 4: // PS_PRINTING
          setStatus(pccStatus[3]);
          break;
        case 5: // PS_INITIALIZING
        case 6: // PS_STARTUP
          setStatus(pccStatus[1]);
          break;
        case 7: // PS_FAULT
        case 8: // PS_LOADING
          setStatus(pccStatus[2]);
          break;
        default:
          setStatus(pccStatus[0]);
      }
    });
  }

  return (
    <HtmlTooltip
      title={
        <>
          <Typography sx={{ fontWeight: 700 }}>PCC{pccNum}</Typography>
          <Grid container spacing={0.5} sx={{ margin: 0, height: '100%' }}>
            {pccStatus.map((item, idx: number) => (
              <Grid key={idx} sm={6} className="flex items-center">
                <Typography
                  sx={{ color: status.value === item.value ? item.color : 'text.secondary', fontWeight: 700 }}
                >
                  {item.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      }
    >
      <Box
        {...restProps}
        className={`flex items-center flex-basis-17 rounded-sm ${className || ''}`}
        sx={{ ...sx, backgroundColor: status.color }}
      >
        <Box className="flex-basis-40% h-full p1 text-wrap">
          <Typography>{pccNum}</Typography>
        </Box>
        <Box className="flex-basis-60% flex h-full pt5">
          {new Array(num).fill(0).map((_, idx: number) => (
            <Box className="border-l-solid border-l-3px border-l-black mr0.3 min-h2px" key={idx}></Box>
          ))}
        </Box>
      </Box>
    </HtmlTooltip>
  );
}

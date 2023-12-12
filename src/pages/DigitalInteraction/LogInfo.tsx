import { ReactNode, type HTMLProps, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography, Box, IconButton, Paper, Fade, type SxProps, type Theme } from '@mui/material';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import { useSnackbar } from '@/context/SnackbarContext';
import CustomCard from '@/components/CustomCard';
import apis from '@/apis';

export interface Props extends HTMLProps<ReactNode> {
  sx?: SxProps<Theme>;
}

export default function PrintHeadInfo(props: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logData, setLogData] = useState<string[]>([]);
  const actions = [
    { Icon: FileCopyIcon, name: 'Copy' },
    { Icon: SaveIcon, name: 'Save' },
    { Icon: PrintIcon, name: 'Print' },
    { Icon: ShareIcon, name: 'Share' },
  ];

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    initLogData();
    const intervalId = setInterval(() => {
      initLogData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  function initLogData() {
    apis.printer.queryAllLog().then(
      (resp) => {
        setLogData(resp.value.LOG);
      },
      (err) => {
        showSnackbar({
          message: String(err),
          severity: 'error',
          duration: 10000,
        });
      },
    );
  }

  return (
    <CustomCard
      {...props}
      contentClassName="relative p2"
      Head={() => (
        <Box className="flex justify-between w-full">
          <Box className="flex items-center">
            <DisplaySettingsIcon sx={{ color: 'primary.main' }} className="mr2" />
            <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.logInfo', '日志信息')}</Typography>
          </Box>

          <Box className="flex justify-end">
            <IconButton onClick={() => setOpen(!open)}>
              <FormatIndentDecreaseIcon />
            </IconButton>

            <IconButton onClick={() => navigate('/logInfo')}>
              <FullscreenIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    >
      {open && (
        <Fade
          className="absolute h-95% py8 w60px right-30px flex flex-col items-center justify-between z2 overflow-y-auto"
          in={open}
          mountOnEnter
          unmountOnExit
        >
          <Paper sx={{ backgroundColor: '#f8f9fb' }}>
            {actions.map((item, idx: number) => (
              <IconButton key={idx} className="flex-1">
                <item.Icon />
              </IconButton>
            ))}
          </Paper>
        </Fade>
      )}

      <Box className="overflow-y-auto h-full">
        {logData.map((item: string, idx: number) => (
          <Typography variant="body1" gutterBottom key={idx}>
            {item}
          </Typography>
        ))}
      </Box>
    </CustomCard>
  );
}

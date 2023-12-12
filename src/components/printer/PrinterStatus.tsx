import { useTranslation } from 'react-i18next';
import { type ChipProps, Chip } from '@mui/material';
import { Unplug, Cable, RefreshCcw, XCircle, TrendingUp, Activity, Printer, Check, FolderUp } from 'lucide-react';

export interface Props extends ChipProps {
  printerState: number;
}

export default function PrinterStatus({ printerState, ...restProps }: Props) {
  const { t } = useTranslation();

  const transformPrinterState = (state?: number) => {
    switch (state) {
      case 0:
        return {
          label: t('printerStatus.disconnected', '断开'),
          icon: <Unplug />,
        };
      case 1:
        return {
          label: t('printerStatus.connected', '已连接'),
          icon: <Cable />,
        };
      case 2:
        return {
          label: t('printerStatus.idle', '等待打印数据'),
          icon: <FolderUp />,
        };
      case 3:
        return {
          label: t('printerStatus.ready', '就绪等待触发'),
          icon: <Check />,
        };
      case 4:
        return {
          label: t('printerStatus.printing', '打印中'),
          icon: <Printer />,
        };
      case 5:
        return {
          label: t('printerStatus.initial', '初始化'),
          icon: <Activity />,
        };
      case 6:
        return {
          label: t('printerStatus.startup', '启动中'),
          icon: <TrendingUp />,
        };
      case 7:
        return {
          label: t('printerStatus.fault', '严重错误'),
          icon: <XCircle />,
        };
      case 8:
        return {
          label: t('printerStatus.loading', '加载中'),
          icon: <RefreshCcw />,
        };
      default:
        return {
          label: t('printerStatus.disconnected', '断开'),
          icon: <Unplug />,
        };
    }
  };

  return (
    <Chip
      sx={{ p: '1px' }}
      size="small"
      icon={transformPrinterState(printerState).icon}
      label={transformPrinterState(printerState).label}
      variant="outlined"
      {...restProps}
    ></Chip>
  );
}

import { useTranslation } from 'react-i18next';
import { Chip, type ChipProps } from '@mui/material';

type LogStatus = 'serious' | 'error' | 'warning' | 'info' | 'debug';

export interface Props extends ChipProps {
  status: LogStatus;
}

export default function LogStatus({ status, ...restProps }: Props) {
  const { t } = useTranslation();

  const statusMap: Record<LogStatus, any> = {
    serious: {
      label: t('logStatus.serious', '严重'),
      color: 'secondary',
    },
    error: {
      label: t('logStatus.error', '错误'),
      color: 'error',
    },
    warning: {
      label: t('logStatus.warning', '警告'),
      color: 'warning',
    },
    info: {
      label: t('logStatus.info', '信息'),
      color: 'info',
    },
    debug: {
      label: t('logStatus.debug', '调试'),
      color: 'success',
    },
  };

  return <Chip {...restProps} size="small" label={statusMap[status].label} color={statusMap[status].color}></Chip>;
}

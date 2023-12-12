import { useTranslation } from 'react-i18next';
import { Box, Typography, Badge, type BoxProps, type BadgeProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type Status = 'success' | 'terminate' | 'error' | 'pause';

type Props = BoxProps &
  BadgeProps & {
    status: Status;
  };

const StyledBadge = styled(Badge)(() => ({
  '.MuiBadge-dot': {
    top: '9px',
    left: '-9px',
  },
}));

export default function PrintStatus(props: Props) {
  const { t } = useTranslation();

  const statusToColor: Record<Status, any> = {
    success: {
      color: 'success',
      title: t('printStatus.success', '成功'),
    },
    error: {
      color: 'error',
      title: t('printStatus.error', '错误'),
    },
    terminate: {
      color: 'warning',
      title: t('printStatus.terminate', '终止'),
    },
    pause: {
      color: 'info',
      title: t('printStatus.pause', '暂停'),
    },
  };
  return (
    <Box {...props} className={`${props.className || ''}} flex`}>
      <StyledBadge
        variant="dot"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        color={statusToColor[props.status].color || props.color}
      >
        <Typography>{statusToColor[props.status].title}</Typography>
      </StyledBadge>
    </Box>
  );
}

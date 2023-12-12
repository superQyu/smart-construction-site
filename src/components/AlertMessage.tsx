import { type SyntheticEvent } from 'react';
import { Snackbar, Alert, type SnackbarProps, type AlertColor } from '@mui/material';

interface Props extends SnackbarProps {
  severity?: AlertColor;
  message?: string;
}

export default function AlertMessage(props: Props) {
  return (
    <Snackbar
      open={props.open}
      onClose={props.onClose}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      {...props}
    >
      <Alert
        onClose={(event: SyntheticEvent) => props.onClose?.(event, 'clickaway')}
        severity={props.severity}
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}

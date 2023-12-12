import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { type DialogProps, Typography } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface Props extends DialogProps {
  title?: string;
  Foot?: React.FC;
  Content?: React.FC;
  open: boolean;
  onClose: () => void;
}

export default function SimpleModal(props: Props) {
  const { Foot, title, open, onClose, children, Content, ...restProps } = props;
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      {...restProps}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {Content && <Content />}
        {children}
      </DialogContent>
      <DialogActions>{Foot && <Foot />}</DialogActions>
    </BootstrapDialog>
  );
}

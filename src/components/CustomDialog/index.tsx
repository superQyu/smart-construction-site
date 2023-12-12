import React, { ReactNode, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<void>; // 提交数据的回调函数
  title?: ReactNode;
  content?: ReactNode;
  cancelButton?: ReactNode;
  confirmButton?: ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title = '标题',
  content = '内容',
  cancelButton,
  confirmButton,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // 加载状态

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setLoading(true);
    await onSubmit();
    setLoading(false);
    onClose();
  };
  const handleCloseClick = () => {
    if (!loading) {
      onClose();
    }
  };
  const handleMaskClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // 阻止冒泡
  };
  return (
    <Dialog open={open} onClose={handleMaskClick} PaperProps={{ sx: { maxWidth: 'none' } }}>
      <DialogTitle sx={{ padding: '11px 40px 11px 24px', backgroundColor: '#ecf4ff' }}>{title}</DialogTitle>
      <DialogContent sx={{ p: '20px 30px 0!important' }}>
        {content}
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, opacity: 0.5 }} />
        )}
      </DialogContent>
      <DialogActions sx={{ p: '30px' }}>
        {loading ? (
          <CircularProgress size={24} /> // 加载状态显示 loading
        ) : (
          confirmButton || (
            <Button
              sx={{ padding: '3px 16px', backgroundColor: '#4671f5' }}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {t('genericName.enter', '确认')}
            </Button>
          )
        )}
        {cancelButton || (
          <Button sx={{ padding: '3px 16px' }} onClick={onClose} variant="outlined">
            {t('genericName.cancel', '取消')}
          </Button>
        )}
      </DialogActions>
      {!loading && (
        <Button
          disabled={loading}
          sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'initial' }}
          onClick={handleCloseClick}
          color="inherit"
        >
          <CloseIcon onClick={handleCloseClick}></CloseIcon>
        </Button>
      )}
    </Dialog>
  );
};

export default CustomDialog;

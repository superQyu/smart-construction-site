import React, { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import RestoreIcon from '@mui/icons-material/Restore';
import TuneIcon from '@mui/icons-material/Tune';

import { open as openFile } from '@tauri-apps/api/dialog';
import CustomDialog from '@/components/CustomDialog';
import About from './about';
import Operation from './operation';

type MenuItemData = {
  key: string;
  ico: JSX.Element;
  label: JSX.Element | string;
  handler?: () => void;
  content?: JSX.Element;
};

type MenuList = {
  label: string;
  key: string;
  anchorEl: null | HTMLElement;
  open: boolean;
  handler?: () => void;
  ico?: JSX.Element;
  children?: MenuItemData[];
};
type DialogOptionType = {
  label: string;
  content: null | JSX.Element;
};
export default function ActionMenu({ className, style }: { className?: string; style?: any }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [dialogOption, setDialogOption] = useState<DialogOptionType>({
    label: '标题',
    content: null,
  });
  const closeDialog = () => setOpen(false);
  const handleOpenFile = async () => {
    // Open a selection dialog for image files
    const selected = await openFile({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg'],
        },
      ],
    });
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
    }
  };
  const routeHandler = (path: string) => {
    navigate(path);
  };
  const [menuList, setMenuList] = useState<MenuList[]>([
    {
      anchorEl: null,
      open: false,
      key: 'file',
      label: t('actionMenu.file', '文件'),
      children: [
        {
          key: 'addFile',
          ico: <CreateNewFolderIcon sx={{ mr: '5px' }} />,
          handler: handleOpenFile,
          label: t('digitalInteraction.addFile', '添加文件'),
        },
      ],
    },
    {
      anchorEl: null,
      open: false,
      key: 'tool',
      label: t('actionMenu.tool', '工具'),
      children: [
        {
          key: 'printSettings',
          ico: <LocalPrintshopIcon sx={{ mr: '5px' }} />,
          handler: () => routeHandler('/pccPdcSettings?target=2'),
          label: t('genericName.printSettings', '打印设置'),
        },
        {
          key: 'operation',
          ico: <RestoreIcon sx={{ mr: '5px' }} />,
          handler: () => {
            setDialogOption({
              label: t('actionMenu.operation', '操作'),
              content: <Operation />,
            });
            setOpen(true);
          },
          label: t('genericName.operation', '操作'),
        },
        {
          key: 'logHistory',
          ico: <TuneIcon sx={{ mr: '5px' }} />,
          handler: () => routeHandler('/logInfo'),
          label: t('genericName.logHistory', '日志和历史'),
        },
      ],
    },
    { anchorEl: null, open: false, key: 'view', label: t('actionMenu.view', '视图') },
    {
      anchorEl: null,
      open: false,
      key: 'help',
      label: t('actionMenu.help', '帮助'),
      children: [
        {
          key: 'about',
          ico: <InfoOutlinedIcon sx={{ mr: '5px' }} />,
          handler: () => {
            setDialogOption({
              label: t('actionMenu.about', '关于'),
              content: <About />,
            });
            setOpen(true);
          },
          label: t('actionMenu.about', '关于'),
        },
      ],
    },
  ]);
  const handleMenuClick = (i: number, event: MouseEvent<HTMLElement>) => {
    const updatedMenuList = menuList.map((item, index) => {
      if (i === index) {
        return {
          ...item,
          anchorEl: event.currentTarget,
          open: true,
        };
      } else {
        return {
          ...item,
          anchorEl: null,
          open: false,
        };
      }
    });
    setMenuList(updatedMenuList);
  };

  const handleMenuClose = () => {
    const updatedMenuList = menuList.map((item) => {
      return {
        ...item,
        anchorEl: null,
        open: false,
      };
    });
    setMenuList(updatedMenuList);
  };

  return (
    <>
      <Box className={`${className} flex items-center text-center flex-wrap`} style={style}>
        {menuList.map((item, index) => (
          <React.Fragment key={index}>
            <Typography
              className="min-w-15 cursor-default  text-left"
              sx={{ cursor: 'pointer', fontWeight: '700' }}
              onClick={(e) => handleMenuClick(index, e)}
              aria-controls={item.open ? `${index}-menu` : undefined}
              aria-expanded={item.open ? 'true' : undefined}
              aria-haspopup="true"
            >
              {item.label}
            </Typography>
            {item.children && (
              <Menu
                anchorEl={item.anchorEl}
                id={`${index}-menu`}
                open={item.open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                sx={{
                  top: '30px',
                  '&>.MuiBackdrop-root': { top: '30px' },
                  '&>.MuiPaper-root': {
                    mt: '-30px!important',
                    '& li': {
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#6086fe',
                      },
                    },
                  },
                }}
              >
                {item.children.map((childItem, childIndex) => (
                  <MenuItem key={childIndex} onClick={childItem.handler} sx={{ fontWeight: '700' }}>
                    {childItem.ico}
                    {childItem.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </React.Fragment>
        ))}
      </Box>

      <CustomDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        confirmButton={<></>}
        cancelButton={
          <Button
            onClick={closeDialog}
            sx={{
              cursor: 'pointer',
              padding: '3px 16px',
              border: ' 1px solid #e1e1e1',
              borderRadius: '4px',
              fontWeight: '500',
              fontSize: '0.625rem',
              lineHeight: '1.75',
            }}
          >
            {t('genericName.close', '关闭')}
          </Button>
        }
        title={<Typography sx={{ fontWeight: 700, textAlign: 'left' }}>{dialogOption.label}</Typography>}
        content={dialogOption.content}
      />
    </>
  );
}

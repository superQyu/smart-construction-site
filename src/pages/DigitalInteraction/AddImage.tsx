import { type HTMLProps, type ReactDOM, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { sep } from '@tauri-apps/api/path';
import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
import { WebviewWindow } from '@tauri-apps/api/window';
import { open as openFile } from '@tauri-apps/api/dialog';
import { Button, LinearProgress } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';

import { generateRandomId } from '@/utils';
import CustomCard from '@/components/CustomCard';
import type { PrintItemItf } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {
  // eslint-disable-next-line no-unused-vars
  onAdd?: (param: PrintItemItf[]) => void;
}

async function buildPrintItem(path: string): Promise<PrintItemItf> {
  const id = generateRandomId();

  const printItem: PrintItemItf = {
    id: id,
    path: path,
    imageName: `${id}-${path.split(sep).slice(-1)[0]}`,
    imageSrc: convertFileSrc(path),
    num: 1,
    checked: false,
  };

  invoke('get_file_modified_time', { filePath: path }).then((res: any) => {
    printItem.imageModifiedTime = dayjs(new Date(res.secs_since_epoch * 1000))
      .locale('zh-cn')
      .format('YYYY/MM/DD HH:mm:ss');
  });

  return printItem;
}

export default function AddImage(props: Props) {
  const { t } = useTranslation();
  const [addLoading, setAddLoading] = useState(false);

  function handleEdit() {
    const webview = new WebviewWindow('编辑图片', {
      url: '/imageEditor',
      title: '图片编辑器',
    });

    webview.once('tauri://created', function () {
      // webview window successfully created
    });
    webview.once('tauri://error', function (e) {
      // an error happened creating the webview window
      console.error(e);
    });
  }

  async function handleOpenFile() {
    // Open a selection dialog for image files
    const selected = await openFile({
      multiple: true,
      filters: [
        {
          name: t('addImage.fileName', '文件类型'),
          extensions: ['png', 'jpeg', 'pdf', 'jpg', 'tif', 'tiff', 'bmp'],
        },
        {
          name: t('addImage.folderName', '文件夹'),
          extensions: ['*'],
        },
      ],
    });
    if (Array.isArray(selected)) {
      setAddLoading(true);
      Promise.all(selected.map(async (item: string) => await buildPrintItem(item))).then((results) => {
        props.onAdd?.(results);
        setAddLoading(false);
      });
      // user selected multiple files
    }
  }

  return (
    <CustomCard {...props} contentClassName="overflow-y-auto p4 flex flex-col items-center justify-center">
      <Button
        className="w-full m-auto"
        variant="contained"
        sx={{ marginBottom: '0.5rem' }}
        onClick={handleOpenFile}
        disabled={addLoading}
      >
        {addLoading ? (
          <LinearProgress
            color="primary"
            sx={{
              position: 'absolute',
              top: '46%',
              left: '16px',
              width: '90%',
            }}
          />
        ) : (
          <>
            <CreateNewFolderIcon sx={{ color: '#ffca26', mr: '0.5rem' }} />
            {t('digitalInteraction.addFile', '添加文件')}
          </>
        )}
      </Button>
      <Button
        className="w-full m-auto"
        sx={{ backgroundColor: 'primary.light' }}
        variant="contained"
        startIcon={<EditIcon sx={{ color: '#ffca26' }} />}
        onClick={handleEdit}
      >
        {t('digitalInteraction.editFile', '编辑文件')}
      </Button>
    </CustomCard>
  );
}

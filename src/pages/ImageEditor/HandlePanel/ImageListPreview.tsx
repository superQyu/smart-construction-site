import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Button, Box, Typography } from '@mui/material';

import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open as openFile } from '@tauri-apps/api/dialog';
import { readDir } from '@tauri-apps/api/fs';

import { useImageEditorContext } from '@/context/ImageEditorContext';
import CustomCard from '@/components/CustomCard';
import { tifImageSrcParser } from '@/utils/image';

interface ImageItemItf {
  name: string;
  imageSrc: string;
  path: string;
}

export function ImageListPreview() {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState<ImageItemItf[]>([]);
  const [imageEditorContext, setImageEditorContext] = useImageEditorContext();
  const openDir = async () => {
    // Open a selection dialog for image files
    const selected = await openFile({
      multiple: false,
      directory: true,
    });

    const res = await readDir(selected as string).catch(() => []);

    res.map(async (item) => {
      let imgSrc = convertFileSrc(item.path);
      if (item.path.endsWith('tif' || item.path.endsWith('tiff'))) {
        imgSrc = await tifImageSrcParser(item.path);
      }

      setImageData((prev) => [
        ...prev,
        {
          path: item.path,
          imageSrc: imgSrc,
          name: item.name,
        } as ImageItemItf,
      ]);
    });
  };

  return (
    <CustomCard
      className="mt2 h-full"
      contentClassName="overflow-y-auto"
      Head={() => (
        <Box className="flex justify-between w-full">
          <Box className="flex items-center">
            <Typography>{t('imageEditor.imageList', '图片列表')}</Typography>
          </Box>

          <Button size="small" variant="outlined" startIcon={<FolderOpenIcon />} onClick={openDir}>
            {t('imageEditor.open', '打开')}
          </Button>
        </Box>
      )}
    >
      <ImageList cols={2} className="h-full">
        {imageData.map((item, idx) => (
          <ImageListItem
            className="cursor-pointer"
            key={idx}
            onClick={() => setImageEditorContext({ ...imageEditorContext, files: [item] })}
          >
            <img src={`${item.imageSrc}`} alt={item.name} />
          </ImageListItem>
        ))}
      </ImageList>
    </CustomCard>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Slider, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import ImageIcon from '@mui/icons-material/Image';

import { convertFileSrc } from '@tauri-apps/api/tauri';
import { open as openFile } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { save } from '@tauri-apps/api/dialog';

import { tifImageSrcParser } from '@/utils/image';
import { useImageEditorContext } from '@/context/ImageEditorContext';
import { ImageListPreview } from './ImageListPreview';

export default function HandlePanel() {
  const { t } = useTranslation();
  const [imageEditorContext, setImageEditorContext] = useImageEditorContext();
  const [scaleX, setScaleX] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [angle, setAngle] = useState(0);

  const buildImageInfo = (files: string[]) => {
    return files.map(async (item) => {
      let imageSrc = convertFileSrc(item);
      if (item.endsWith('tif') || item.endsWith('tiff')) {
        imageSrc = await tifImageSrcParser(item);
      }

      return {
        path: item,
        imageSrc: imageSrc,
      };
    });
  };

  const buttonArr = [
    {
      label: t('imageEditor.open', '打开'),
      name: 'open',
      icon: <ImageIcon />,
      onclick: async () => {
        // Open a selection dialog for image files
        const selected = await openFile({
          multiple: true,
          filters: [
            {
              name: t('addImage.fileName', '文件类型'),
              extensions: ['png', 'jpeg', 'pdf', 'jpg', 'tiff', 'tif'],
            },
          ],
        });
        if (Array.isArray(selected)) {
          const files = await Promise.all(buildImageInfo(selected)).catch(() => []);
          // user selected multiple files
          setImageEditorContext({
            ...imageEditorContext,
            files: files,
          });
        }
      },
    },
    {
      label: t('imageEditor.export', '导出'),
      name: 'export',
      icon: <ExitToAppIcon />,
      onclick: async () => {
        const content =
          imageEditorContext?.currentCanvas?.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 4,
            withoutShadow: true,
          }) || '';

        // fabricJs Canvas have no toBlob method
        const blob = await (await (await fetch(content)).blob()).arrayBuffer();

        const filePath =
          (await save({
            filters: [
              {
                name: 'Image',
                extensions: ['jpeg', 'png'],
              },
            ],
          })) || '';

        await writeBinaryFile(filePath, blob);
      },
    },
    {
      label: t('imageEditor.setting', '设置'),
      name: 'setting',
      icon: <SettingsIcon />,
    },
  ];

  useEffect(() => {
    if (imageEditorContext?.selectedObj) {
      setScaleX(imageEditorContext?.selectedObj.scaleX || 0);
      setSkewX(imageEditorContext?.selectedObj.skewX || 0);
      setSkewY(imageEditorContext?.selectedObj.skewY || 0);
      setAngle(imageEditorContext?.selectedObj.angle || 0);
    }
  }, [imageEditorContext?.selectedObj]);

  useEffect(() => {
    if (imageEditorContext?.currentCanvas) {
      imageEditorContext?.currentCanvas.on('object:scaling', onCanvasObjectUpdate);
    }
  }, [imageEditorContext?.currentCanvas]);

  useEffect(() => {
    return () => {
      if (imageEditorContext?.currentCanvas) {
        imageEditorContext?.currentCanvas.off('object:scaling', onCanvasObjectUpdate);
      }
    };
  }, []);

  function onCanvasObjectUpdate(event: fabric.IEvent) {
    setScaleX((event?.target as any)?.scaleX || 0);
    setSkewX((event?.target as any)?.skewX || 0);
    setSkewY((event?.target as any)?.skewY || 0);
    setAngle((event?.target as any)?.angle || 0);
  }

  const slideOperateArr = [
    {
      label: t('imageEditor.scale', '缩放'),
      max: 2,
      step: 0.00001,
      onChange: (_: Event, newValue: number | number[]) => {
        setScaleX(newValue as number);
        imageEditorContext?.selectedObj?.scale(newValue as number).setCoords();
        imageEditorContext?.currentCanvas?.requestRenderAll();
      },
      value: scaleX,
    },
    {
      label: t('imageEditor.angle', '角度'),
      onChange: (_: Event, newValue: number | number[]) => {
        setAngle(newValue as number);
        imageEditorContext?.selectedObj?.set('angle', newValue as number).setCoords();
        imageEditorContext?.currentCanvas?.requestRenderAll();
      },
      max: 720,
      value: angle,
    },
    {
      label: t('imageEditor.skewX', 'X轴切变'),
      onChange: (_: Event, newValue: number | number[]) => {
        setSkewX(newValue as number);
        imageEditorContext?.selectedObj?.set('skewX', newValue as number).setCoords();
        imageEditorContext?.currentCanvas?.requestRenderAll();
      },
      value: skewX,
      min: -90,
      max: 90,
    },
    {
      label: t('imageEditor.skewY', 'Y轴切变'),
      onChange: (_: Event, newValue: number | number[]) => {
        setSkewY(newValue as number);
        imageEditorContext?.selectedObj?.set('skewY', newValue as number).setCoords();
        imageEditorContext?.currentCanvas?.requestRenderAll();
      },
      value: skewY,
      min: -90,
      max: 90,
    },
  ];

  return (
    <Box className="flex flex-col h-full px3 py2">
      <Grid container spacing={1} sx={{ margin: 0 }}>
        {buttonArr.map((item, idx) => (
          <Grid xs={6} sm={4} key={idx}>
            <Button variant="outlined" className="w-full" startIcon={item.icon} onClick={item.onclick}>
              {item.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box className="mt2">
        {slideOperateArr.map((operate, idx: number) => (
          <Box key={idx}>
            <Divider sx={{ marginBottom: '0.8rem' }} />
            <Typography sx={{ margin: 0 }}>{operate.label}</Typography>
            <Slider
              max={operate.max}
              min={operate.min}
              step={operate.step}
              value={operate.value}
              valueLabelDisplay="auto"
              onChange={operate.onChange}
            />
            <Divider />
          </Box>
        ))}
      </Box>

      <ImageListPreview />
    </Box>
  );
}

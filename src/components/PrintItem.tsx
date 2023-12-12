import { useRef, useEffect, useState, type HTMLProps, type BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, pdfjs, Thumbnail } from 'react-pdf';

import 'pdfjs-dist/build/pdf.worker.entry';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/Info';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { Box, Typography, LinearProgress, IconButton, TextField, Checkbox, type BoxProps } from '@mui/material';

import { durationWithAutoUnit, formatTimeHourMinSec, formatTimeYearMonthDay } from '@/utils';
import type { PrintItemItf } from '@/types';
import { tifImageSrcParserWithBuf } from '@/utils/image';

pdfjs.GlobalWorkerOptions.workerSrc = (window as any).pdfjsWorker;

interface Props extends HTMLProps<BoxProps> {
  isEdit?: boolean;
  isFinished?: boolean;
  item: PrintItemItf;
  isShowCheckBox?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChanged?: (item: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (event: BaseSyntheticEvent, item: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onUpload?: (event: BaseSyntheticEvent, item: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onFinished?: (item: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onStartJob?: (item: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onStopJob?: (item: PrintItemItf) => void;
}

export default function PrintItem(props: Props) {
  const { t } = useTranslation();
  const [printNum, setPrintNum] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [startTime] = useState(new Date());
  const { onChanged } = props;

  const progressRef = useRef(() => {});
  useEffect(() => {
    if (props.isEdit || props.isFinished) {
      return;
    }
    progressRef.current = () => {
      if (props.item.status === 'printing') {
        if (progress > 100) {
          setProgress(0);
          setBuffer(10);
          setPrintNum(printNum + 1);
        } else {
          const diff = Math.random() * 10;
          const diff2 = Math.random() * 10;
          setProgress(progress + diff);
          setBuffer(progress + diff + diff2);
        }
      }
    };

    if (props.item.status === 'finished') {
      const finishedTime = new Date();
      props.onFinished?.({
        ...props.item,
        finishedTime: `${formatTimeYearMonthDay(finishedTime)} ${formatTimeHourMinSec(finishedTime)}`,
        lastedTime: durationWithAutoUnit(finishedTime.getTime() - startTime.getTime()),
      });
    }
  });

  useEffect(() => {
    if (props.isEdit || props.isFinished) {
      return;
    }
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (props.item.imageSrc.endsWith('tiff') || props.item.imageSrc.endsWith('tif')) {
      if (props.item.imageSrc) {
        fetch(props.item.imageSrc).then(async (resp) => {
          const ab = await (await resp.blob()).arrayBuffer();
          tifImageSrcParserWithBuf(ab).then((res) => {
            props.onChanged?.({
              ...props.item,
              imageSrc: res,
            });
          });
        });
      }
      return;
    }
  }, []);

  const handleCheckedChange = (_: unknown, checked: boolean) => {
    onChanged?.({ ...props.item, checked });
  };

  const handleInputChange = (event: BaseSyntheticEvent) => {
    onChanged?.({ ...props.item, num: parseInt(event.target?.value, 10) });
  };

  const handleStop = () => {
    props.onStopJob?.(props.item);
  };

  const handleStart = () => {
    props.onStartJob?.(props.item);
  };

  const isPDFSuffix = (imagePath: string) => {
    return imagePath.endsWith('pdf');
  };

  const handlePDFLoadSuccess = (document: any) => {
    onChanged?.({ ...props.item, pages: document._pdfInfo.numPages });
  };

  return (
    <Box className={`flex items-center justify-between ${props.className}`}>
      <Box className="flex items-center">
        <DragIndicatorIcon />
        {props.isShowCheckBox && <Checkbox checked={props.item?.checked || false} onChange={handleCheckedChange} />}
        {isPDFSuffix(props.item.path as string) ? (
          <Document
            className="mr3 max-h60px max-w80px"
            loading={() => <Typography>{t('printItem.pdfLoading', 'PDF缩略图加载中')}</Typography>}
            file={props.item.imageSrc}
            onLoadSuccess={handlePDFLoadSuccess}
          >
            <Thumbnail
              className="max-h60px max-w80px"
              width={35}
              height={35}
              pageNumber={1}
              loading={() => <Typography>{t('printItem.pdfLoading', 'PDF缩略图加载中')}</Typography>}
            />
          </Document>
        ) : (
          <img
            src={props.item?.imageSrc}
            className="text-xs mr3 max-h60px max-w80px"
            alt={t('common.thumbnail', '缩略图')}
          />
        )}

        <Box className="flex flex-col">
          <Typography>{props.item?.imageName || '--'}</Typography>

          <Box className="flex items-center">
            <Typography sx={{ color: 'text.secondary', marginRight: '5px' }}>{t('common.items', '份数')}</Typography>
            {props.isEdit && !props.isFinished ? (
              <TextField
                className="flex-1"
                size="small"
                variant="standard"
                defaultValue={props.item.num || 0}
                sx={{ width: '5ch' }}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
              />
            ) : (
              <Typography sx={{ color: 'text.secondary' }}>{props.item?.num || '--'}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {props.isEdit ? (
        <Box className="flex flex-basis-50% items-center justify-end">
          <IconButton
            sx={{ color: 'text.secondary' }}
            onClick={(event: BaseSyntheticEvent) => props.onUpload?.(event, props.item)}
          >
            <PlaylistAddIcon />
          </IconButton>
          <IconButton
            sx={{ color: 'text.secondary' }}
            onClick={(event: BaseSyntheticEvent) => props.onDelete?.(event, props.item)}
          >
            <DeleteOutlineIcon />
          </IconButton>
          <IconButton sx={{ color: 'text.secondary' }}>
            <InfoIcon />
          </IconButton>
        </Box>
      ) : props.isFinished ? (
        <Box className="flex flex-basis-50% items-center justify-end">
          <Typography sx={{ color: 'text.secondary' }}>
            {props.item.finishedTime || '--'} <br />
          </Typography>
          <Typography className="text-center" sx={{ color: 'text.secondary' }}>
            {props.item.lastedTime || '--'}
          </Typography>

          <Box className="flex">
            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={(event: BaseSyntheticEvent) => props.onDelete?.(event, props.item)}
            >
              <DeleteOutlineIcon />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary' }}>
              <InfoIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box className="flex justify-between flex-basis-50%">
          <Box className="flex  flex-col flex-basis-80%">
            {props.item.status !== 'printing' ? (
              props.item.status === 'failed' ? (
                <Typography className="flex-basis-50%" sx={{ color: 'primary.secondary' }}>
                  {t('printItem.failed', '打印任务失败...')}
                </Typography>
              ) : (
                <Typography className="flex-basis-50%" sx={{ color: 'primary.main' }}>
                  {t('printItem.waitPrinting', '等待中...')}
                </Typography>
              )
            ) : (
              <Typography className="flex-basis-50%" sx={{ color: 'primary.main' }}>
                {t('printItem.printing', '打印中...')}
              </Typography>
            )}
            <Box className="w-full mt1">
              <LinearProgress className="w-full h5px" variant="buffer" value={progress} valueBuffer={buffer} />
            </Box>
          </Box>
          <Box className="flex flex-basis-20% items-center justify-end">
            {props.item.status !== 'printing' ? (
              <IconButton sx={{ color: 'text.secondary' }} onClick={handleStart}>
                <PlayCircleFilledIcon />
              </IconButton>
            ) : (
              <IconButton sx={{ color: 'text.secondary' }} onClick={handleStop}>
                <StopCircleIcon />
              </IconButton>
            )}

            <IconButton
              sx={{ color: 'text.secondary' }}
              onClick={(event: BaseSyntheticEvent) => props.onDelete?.(event, props.item)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}

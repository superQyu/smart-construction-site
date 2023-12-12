import { type HTMLProps, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, pdfjs, Page } from 'react-pdf';

import { Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';

import { CurrentPrintItemContext } from '@/context/digitalInteractionContext';
import CustomCard from '@/components/CustomCard';
import ImagePreview from '@/components/ImagePreview';

import 'pdfjs-dist/build/pdf.worker.entry';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = (window as any).pdfjsWorker;

export default function PrintPreview(props: HTMLProps<any>) {
  const { t } = useTranslation();
  const [printItem] = useContext(CurrentPrintItemContext);

  const [pageNumber] = useState<number>(1);

  const isPDFSuffix = (imagePath: string) => {
    return imagePath.endsWith('pdf');
  };

  return (
    <CustomCard
      {...props}
      Head={() => (
        <>
          <PreviewIcon sx={{ color: 'primary.main' }} className="mr2" />
          <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.preview', '打印预览')}</Typography>
        </>
      )}
      contentClassName="overflow-y-auto"
    >
      <ImagePreview>
        {printItem ? (
          isPDFSuffix(printItem.path as string) ? (
            <Document loading={t('digitalInteraction.printPreview.pdfLoading', 'PDF加载中')} file={printItem.imageSrc}>
              <Page
                width={200}
                height={200}
                pageNumber={pageNumber}
                loading={t('digitalInteraction.printPreview.pdfPageLoading', 'PDF页加载中')}
              />
            </Document>
          ) : (
            <img src={printItem.imageSrc} alt="" className="max-h100% max-w100%"></img>
          )
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            {t('digitalInteraction.noPreviewImage', '无可用预览')}
          </Typography>
        )}
      </ImagePreview>
    </CustomCard>
  );
}

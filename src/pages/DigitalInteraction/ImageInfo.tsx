import { type ReactNode, type HTMLProps, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type SxProps, type Theme } from '@mui/material';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import CustomCard from '@/components/CustomCard';
import { CurrentPrintItemContext } from '@/context/digitalInteractionContext';
import apis from '@/apis';

export interface Props extends HTMLProps<ReactNode> {
  sx?: SxProps<Theme>;
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  () => ({
    background: '#f8f9fd',
    border: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  minHeight: '24px',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: '0 2rem',
}));

export default function ImageInfo(props: Props) {
  const { t } = useTranslation();
  const [printItem] = useContext(CurrentPrintItemContext);

  const imageMetaInfo = [
    {
      label: t('imageInfo.page', '页数'),
      value: printItem?.pages,
    },
    {
      label: t('imageInfo.file', '文件'),
      value: printItem?.imageName,
    },
    {
      label: t('imageInfo.sizeInMillimeters', '大小（毫米）'),
    },
    {
      label: t('imageInfo.sizeInPixels', '大小（像素）'),
    },
    {
      label: t('imageInfo.dpi', '每英寸像素点'),
    },
    {
      label: t('imageInfo.planes', '颜色通道'),
    },
    {
      label: t('imageInfo.bpp', 'BPP'),
    },
    {
      label: t('imageInfo.imageStoreJob', '存储卡上的作业'),
    },
    {
      label: t('imageInfo.modified', '修改时间'),
      value: printItem?.imageModifiedTime,
    },
  ];

  useEffect(() => {
    if (printItem) {
      apis.rip.preview(printItem.imageName, printItem.from as string).then(console.log);
    }
  }, [printItem]);

  return (
    <CustomCard {...props} contentClassName="relative overflow-y-auto">
      {imageMetaInfo.map((item, idx: number) => {
        return (
          <Accordion defaultExpanded={true} key={idx}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography sx={{ fontWeight: 700 }}>{item.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.value || '--'}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </CustomCard>
  );
}

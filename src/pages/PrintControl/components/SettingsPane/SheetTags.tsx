import { useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import Subtitle from '@/components/ContentCard/SubCardTitle';
import SubCard from '@/components/ContentCard/SubCard';
import Counter from '@/components/Counter';

import { Box } from '@mui/material';
export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center' },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  box: { marginBottom: '13px' },
  subCard: { marginBottom: '15px' },
};
export default function SmartMedium(props: Props) {
  const { t } = useTranslation();

  const handleValueChange = (newValue: any) => {
    console.log('Counter value:', newValue);
  };

  useEffect(() => {}, []);
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Subtitle sx={{ marginBottom: '5px' }} label={t('printControl.sheetTags.dbmark', '双面标记')} />
        <Box className="overflow-y-auto" sx={{ padding: '2px', height: 'calc(100% - 50px)' }}>
          <SubCard
            sx={{ ...defSX.subCard }}
            contentClassName="overflow-y-auto"
            Head={() => (
              <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                {t('printControl.sheetTags.CUEMarks', 'CUE Marks')}
              </Typography>
            )}
          >
            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('genericName.width', '宽度')}</Typography>
              <Counter
                initialValue={11}
                step={1}
                format={(value) => `${value}.000 mm`}
                onValueChange={handleValueChange}
              />
            </Box>

            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('genericName.height', '高度')}</Typography>
              <Counter
                initialValue={6}
                step={1}
                format={(value) => `${value}.000 mm`}
                onValueChange={handleValueChange}
              />
            </Box>
          </SubCard>

          <SubCard
            {...props}
            contentClassName="overflow-y-auto"
            Head={() => (
              <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                {t('printControl.sheetTags.barCode', '条形码')}
              </Typography>
            )}
          >
            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('printControl.sheetTags.barCodeHeight', '条形码高')}</Typography>
              <Counter
                initialValue={11}
                step={1}
                format={(value) => `${value}.000 mm`}
                onValueChange={handleValueChange}
              />
            </Box>
            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('genericName.fontSize', '字体大小')}</Typography>
              <Counter
                initialValue={10}
                step={1}
                format={(value) => `${value} pts`}
                onValueChange={handleValueChange}
              />
            </Box>
            <Box sx={defSX.box}>
              <Typography sx={defSX.itemTitle}>{t('genericName.letterSpacing', '字体间距')}</Typography>
              <Counter
                initialValue={1}
                step={1}
                format={(value) => `${value} dots`}
                onValueChange={handleValueChange}
              />
            </Box>
          </SubCard>
        </Box>
      </Box>
    </ContentCard>
  );
}

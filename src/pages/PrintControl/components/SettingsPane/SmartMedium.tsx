import React, { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Box, Typography } from '@mui/material';

import ContentCard from '@/components/ContentCard';
import Subtitle from '@/components/ContentCard/SubCardTitle';
import CustomDialog from '@/components/CustomDialog';
import SmartMediumDetails from './details/SmartMedium';

export interface Props extends HTMLProps<HTMLElement> {}

export default function SmartMedium(props: Props) {
  const { t } = useTranslation();
  const [smartMediumList, setSmartMedium] = useState<Array<string>>([]);

  const [open, setOpen] = React.useState(false);

  const handlerItem = ({}: any) => {
    setOpen(true);
  };

  useEffect(() => {
    setSmartMedium([
      t('printControl.setting.medisName1', '介质1'),
      t('printControl.setting.medisName2', '介质2'),
      t('printControl.setting.medisName3', '介质3'),
    ]);
  }, []);
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Subtitle label={t('printControl.setting.medisName', '介质名称')} />
        <Box className="overflow-y-auto" sx={{ height: 'calc(100% - 50px)' }}>
          {smartMediumList.map((item, index: number) => (
            <div key={index} onClick={() => handlerItem(item)}>
              <Typography
                className="flex"
                sx={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ebf0fe',
                  height: '24px',
                  fontWeight: 600,
                  textAlign: 'center',
                  m: '0 3px 5px 3px',
                  cursor: 'pointer',
                }}
              >
                {item}
                <TextSnippetIcon sx={{ position: 'absolute', right: 0, margin: '0 7px', color: '#94abc0' }} />
              </Typography>
            </div>
          ))}
        </Box>
      </Box>
      <CustomDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={
          <Typography sx={{ fontWeight: 700, textAlign: 'left' }}>
            {t('printControl.setting.mediumDetails', '介质详细信息')}
          </Typography>
        }
        content={<SmartMediumDetails />}
      />
    </ContentCard>
  );
}

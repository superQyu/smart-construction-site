import React, { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Box, Typography } from '@mui/material';

import ContentCard from '@/components/ContentCard';
import Subtitle from '@/components/ContentCard/SubCardTitle';
import CustomDialog from '@/components/CustomDialog';
import PrintColumnDetails from './details/PrintColumn';

export interface Props extends HTMLProps<HTMLElement> {}

export default function PrintColumn(props: Props) {
  const { t } = useTranslation();
  const [printColumnList, setPrintColumn] = useState<Array<string>>([]);
  const [printItem, setPrintItem] = useState<{ id: number; name: string }>({ id: -1, name: '' });
  const [open, setOpen] = React.useState(false);

  const handlerItem = (item: any, index: number) => {
    setPrintItem({ id: index, name: item });
    setOpen(true);
  };
  useEffect(() => {
    setPrintColumn([
      t('printControl.setting.printColumn1', '打印栏1'),
      t('printControl.setting.printColumn2', '打印栏2'),
      t('printControl.setting.printColumn3', '打印栏3'),
    ]);
  }, []);
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Subtitle label={t('printControl.setting.printColumnGroup', '打印栏组')} />
        <Box className="overflow-y-auto" sx={{ height: 'calc(100% - 50px)' }}>
          {printColumnList.map((item, index: number) => (
            <div key={index} onClick={() => handlerItem(item, index)}>
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
                key={index}
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
            {t('printControl.setting.printBarDetails', '打印栏详细信息')}
          </Typography>
        }
        content={<PrintColumnDetails params={printItem} />}
      />
    </ContentCard>
  );
}

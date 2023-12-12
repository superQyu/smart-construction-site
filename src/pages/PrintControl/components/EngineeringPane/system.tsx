import React, { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Box, Typography } from '@mui/material';

import ContentCard from '@/components/ContentCard';
import Subtitle from '@/components/ContentCard/SubCardTitle';
import CustomDialog from '@/components/CustomDialog';
import SystemAdd from './details/AddServer';
import ServerDetails from './details/server';

import CusButton from '@/components/CustomComponents/CusButton';
interface DialogType {
  key: string;
  label: string;
  compoment: JSX.Element;
}

export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  buttonBox: { padding: '5px 10px', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#c8d5ff',
    color: '#577df6',
    borderRadius: '26px',
    padding: '2px 16px',

    '&:hover': {
      backgroundColor: 'rgba(200,213,255,0.85)',
    },
  },
};
export default function PrintColumn(props: Props) {
  const { t } = useTranslation();
  const [printColumnList, setPrintColumn] = useState<Array<string>>([]);
  const [serverItem, setServerItem] = useState<{ id: number; name: string }>({ id: -1, name: '' });
  const [open, setOpen] = React.useState(false);

  const [dialogType, setDialogType] = useState<DialogType[]>([
    {
      key: 'detail',
      label: t('printControl.engineeringPane.serverDetails', '服务器详细信息'),
      compoment: <ServerDetails params={serverItem} />,
    },
    {
      key: 'add',
      label: t('printControl.engineeringPane.addServer', '添加服务器'),
      compoment: <SystemAdd />,
    },
  ]);
  const [dialogIndex, setDialogIndex] = useState<number>(0);

  const handlerItem = (item: any, index: number, diaIdx: number) => {
    setServerItem({ id: index, name: item });

    setDialogIndex(diaIdx);
    setOpen(true);
  };

  useEffect(() => {
    setPrintColumn([
      t('server.setting.servr', '服务器') + '1',
      t('server.setting.servr', '服务器') + '2',
      t('server.setting.servr', '服务器') + '3',
    ]);
    if (!dialogType) setDialogType([]);
  }, []);
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Subtitle label={t('printControl.setting.RIPserver', 'RTP服务器')} />
        <Box className="overflow-y-auto" sx={{ height: 'calc(100% - 86px)' }}>
          {printColumnList.map((item, index: number) => (
            <div key={index} onClick={() => handlerItem(item, index, 0)}>
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
        <Box className="flex " sx={defSX.buttonBox}>
          <CusButton onClick={() => handlerItem(null, -1, 1)}>
            {t('genericName.loadServer', '添加服务器')}
          </CusButton>
          <CusButton sx={{ backgroundColor: '#dfe0e3', color: '#4b4b4d' }}>
            {t('genericName.deleteServer', '删除服务器')}
          </CusButton>
        </Box>
      </Box>
      <CustomDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={<Typography sx={{ fontWeight: 700, textAlign: 'left' }}>{dialogType[dialogIndex]['label']}</Typography>}
        content={React.cloneElement(dialogType[dialogIndex]['compoment'], { params: { ...serverItem } })}
      />
    </ContentCard>
  );
}

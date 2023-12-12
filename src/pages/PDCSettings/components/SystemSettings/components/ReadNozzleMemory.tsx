import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { open as openFolder } from '@tauri-apps/api/dialog';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem from '@/components/CustomComponents/FormItem';
import AntdInput from '@/components/CustomComponents/CusInput';
import { PrintReadHeadMemItf } from '@/types';

interface State extends PrintReadHeadMemItf {}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '100%' },
  subTitle: {
    p: '0 15px 0 9px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    whiteSpace: 'nowrap',
  },
};
export default function ReadNozzleMemory() {
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setState((prev) => ({
        ...prev,
        enableSaveToFile: config.Test.HeadInfoLog === '1',
        saveFolder: config.Test?.HeadInfoLogPath?.replaceAll('"', '') || '',
      }));
    }
  }, [config]);

  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    enableSaveToFile: false,
    saveFolder: '',
  });
  const handleClick = (key: string) => {
    openFolder({
      directory: true,
      multiple: false,
    }).then((res) => {
      if (res) {
        setState((prev) => ({ ...prev, [key]: res }));
        setPdcSettingsCtx((prev) => ({
          ...prev,
          systemSetting: {
            ...prev.systemSetting,
            readHeadMem: {
              ...prev.systemSetting?.readHeadMem,
              [key]: res,
            },
          },
        }));
      }
    });
  };
  const handleChange = (key: string, val: any) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPdcSettingsCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        readHeadMem: {
          ...prev.systemSetting?.readHeadMem,
          [key]: val,
        },
      },
    }));
  };
  return (
    <Box>
      <Box
        sx={{
          '& .item__box': {
            mt: '0',
            '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
          },
        }}
      >
        <FormItem
          {...{
            label: `${t('genericName.saveToFile ', '保存至文件')}`,
            type: 'checkbox',
            itemkey: 'enableSaveToFile',
            value: true,
          }}
          onChange={handleChange}
        />
      </Box>
      <Box className="flex" sx={{ ...defSX.box }}>
        <Typography sx={{ ...defSX.subTitle }}>{t('genericName.saveToFilePath', '文件路径')}</Typography>
        <Box sx={{ ...defSX.boxInner }}>
          <AntdInput
            size="small"
            value={state.saveFolder as string}
            onChange={(val) => handleChange('saveFolder', val)}
            buttonText={<MoreHorizIcon />}
            onButtonClick={() => {
              handleClick('saveFolder');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

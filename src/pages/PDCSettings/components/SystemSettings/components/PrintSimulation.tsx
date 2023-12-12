import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { open as openFile } from '@tauri-apps/api/dialog';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';

import FormItem from '@/components/CustomComponents/FormItem';
import AntdInput from '@/components/CustomComponents/CusInput';

interface State {
  filePath: string;
  enableSave: boolean;
}
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
export default function PrintSimulation() {
  const { config } = useMeteorConfigContext();
  const { t } = useTranslation();
  const setPdcSettingsContext = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setState((prev) => ({
        ...prev,
        enableSave: config.Test.SaveSimFiles === '1',
        filePath: config.Test.SimFilePath.replaceAll('"', ''),
      }));
    }
  }, [config]);
  const [state, setState] = useState<State>({
    enableSave: false,
    filePath: 'SimFiles',
  });
  const handleClick = (key: string) => {
    openFile({ directory: true }).then((res) => {
      handleChange(key, res);
    });
  };
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    setPdcSettingsContext((prev) => ({
      ...prev,
      systemSetting: {
        ...prev?.systemSetting,
        simPrint: {
          ...prev?.systemSetting?.simPrint,
          enableSave: state.enableSave,
          filePath: state.filePath,
          [key]: val,
        },
      },
    }));
  };
  return (
    <Box sx={{ p: '10px 0' }}>
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
            label: `${t('genericName.fileSave ', '保存文件')}`,
            type: 'checkbox',
            itemkey: 'enableSave',
            value: state.enableSave,
          }}
          onChange={handleChange}
        />
      </Box>
      <Box className="flex" sx={{ ...defSX.box }}>
        <Typography sx={{ ...defSX.subTitle }}>{t('genericName.filePath', '文件路径')}</Typography>
        <Box sx={{ ...defSX.boxInner }}>
          <AntdInput
            size="small"
            value={state.filePath}
            onChange={(val) => handleChange('filePath', val)}
            buttonText={<MoreHorizIcon />}
            onButtonClick={() => {
              handleClick('filePath');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

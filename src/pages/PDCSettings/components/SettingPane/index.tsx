import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { open as openFile } from '@tauri-apps/api/dialog';

import { useInitSettingPane } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import SubCard from '@/components/ContentCard/SubCard';
import AntdInput from '@/components/CustomComponents/CusInput';
import PlaneOffsetTable from './PlaneOffsetTable';
import ImagePosition from './ImagePosition';
import { PlaneOffsetItf, SettingPaneItf } from '@/types';

interface State extends SettingPaneItf {}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '40%' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '30px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    width: '80px',
  },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};

export default function SettingsPane() {
  const { t } = useTranslation();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];
  const [state, setState] = useState<State>({
    folderPath: '',
    enableBackup: false,
    hotFolder: '',
    imageX: 0,
    imageY: 0,
  });
  const [behavior, setBehavior] = useState<{ [key: string]: boolean }>({
    hotFolderAutoRefresh: true,
  });

  const [initHotFolder, setInitHotFolder] = useState<formItemProps[]>([
    {
      label: t('genericName.fileGroupingMode', '文件分组模式'),
      type: 'select',
      itemkey: 'pageDelimiters',
      showTypography: false,
      value: '_Page',
      options: [
        { label: t('genericName.fileGroupingModePages', '页面page'), value: '_Page' },
        { label: t('genericName.fileGroupingModeLayer', '层次Layer'), value: '_Layer' },
      ],
    },
    {
      label: t('genericName.fileType', '文件类型'),
      type: 'select',
      itemkey: 'canPrintBmpFiles',
      showTypography: false,
      value: '0',
      options: [
        { label: t('genericName.fileTypePreview', '.BMP作为预览图像'), value: '0' },
        { label: t('genericName.fileTypePrintData', '.BMP作为打印数据'), value: '1' },
      ],
    },
  ]);
  const [thoroughfareOffset, setThoroughfareOffset] = useState<PlaneOffsetItf[]>([]);

  useInitSettingPane((data) => {
    setThoroughfareOffset(data.planeOffsetTable || []);
    setState((prev) => ({
      ...prev,
      ...data,
      folderPath: data.folderPath || '',
      enableBackup: data.enableBackup ?? false,
      hotFolder: data.hotFolder || '',
      imageX: data.imageX || 0,
      imageY: data.imageY || 0,
    }));
    setBehavior((prev) => ({
      ...prev,
      hotFolderAutoRefresh: data.hotFolderAutoRefresh ?? false,
    }));

    setInitHotFolder((prev) => {
      prev[0].value = data.pageDelimiters;
      prev[1].value = data.canPrintBmpFiles;
      return [...prev];
    });
  });

  const handleInputChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        [key]: val,
      },
    }));
  };
  const handleClick = (key: string, value?: string | number) => {
    openFile({
      defaultPath: value as string,
      directory: true,
    }).then((res) => {
      if (!res) {
        return;
      }
      setState((prev) => ({
        ...prev,
        [key]: ((res || '') as string).replaceAll('\\\\', '\\'),
      }));

      setPdcSettingsCtx((prev) => ({
        ...prev,
        settingPane: {
          ...prev.settingPane,
          [key]: ((res || '') as string).replaceAll('\\\\', '\\'),
        },
      }));
    });
  };
  const handleThoroughfareOffset = (index: number, key: string, val: any) => {
    const updatedRows = [...thoroughfareOffset];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setThoroughfareOffset(updatedRows);

    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        planeOffsetTable: updatedRows,
      },
    }));
  };
  const resetThoroughfareOffset = () => {
    const updatedRows = [...thoroughfareOffset].map((item) => {
      return { ...item, x: 0.0, y: 0.0 };
    });
    setThoroughfareOffset(updatedRows);
    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        planeOffsetTable: updatedRows,
      },
    }));
  };
  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBehavior({
      ...behavior,
      [event.target.name]: event.target.checked,
    });

    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        [event.target.name]: event.target.checked,
      },
    }));
  };
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        [key]: val,
      },
    }));
  };

  const handleHotFolderCheckChange = (key: string, val: any) => {
    setInitHotFolder((prev) => {
      const idx = prev.findIndex((item) => item.itemkey === key);
      if (idx >= 0) {
        prev[idx].value = val;
      }

      return [...prev];
    });
    setPdcSettingsCtx((prev) => ({
      ...prev,
      settingPane: {
        ...prev.settingPane,
        [key]: val,
      },
    }));
  };

  const handleOpenConfigFilePath = () => {
    openFile({
      defaultPath: state.folderPath as string,
      directory: true,
    }).then((res) => {
      if (!res) {
        return;
      }
      setState((prev) => ({
        ...prev,
        folderPath: ((res || '') as string).replaceAll('\\\\', '\\'),
      }));
      setPdcSettingsCtx((prev) => ({
        ...prev,
        settingPane: {
          ...prev.settingPane,
          folderPath: ((res || '') as string).replaceAll('\\\\', ''),
        },
      }));
    });
  };
  return (
    <Box
      sx={{ bgcolor: 'background.paper', height: '100%', padding: '0 5px' }}
      className="overflow-y-auto flex flex-col"
    >
      <SubCard
        sx={{ flexBasis: '10%' }}
        contentClassName="flex flex-col p4!"
        Head={() => (
          <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
            {t('genericName.profile', '配置文件')}
          </Typography>
        )}
      >
        <Box className="flex items-center flex-wrap" sx={{ ...defSX.box }}>
          <Box className="flex items-center">
            <Typography sx={{ ...defSX.subTitle }}>{t('genericName.saveConfigFile', '存档配置文件')}</Typography>
            <FormItem
              sx={{
                marginTop: 0,
                '& .item__content__checkbox': {
                  pl: '10px',
                  ml: '-10px',
                },
              }}
              label=""
              type="checkbox"
              value={state.enableBackup}
              onChange={handleChange}
              itemkey="enableBackup"
            />
          </Box>
          <Box className="flex flex-1 items-center">
            <Typography sx={{ ...defSX.subTitle }}>{t('genericName.folderPath', '文件夹路径')}</Typography>
            <Box sx={{ ...defSX.boxInner }}>
              <AntdInput
                size="small"
                value={state.folderPath as string}
                onChange={(val) => handleInputChange('folderPath', val)}
                buttonText={<MoreHorizIcon />}
                readOnly={true}
                disabled={!state.enableBackup}
                onButtonClick={handleOpenConfigFilePath}
              />
            </Box>
          </Box>
        </Box>
      </SubCard>
      <SubCard
        sx={{ flexBasis: '30%' }}
        contentClassName="flex flex-col p4!"
        Head={() => (
          <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
            {t('genericName.hotFolder', '热文件夹')}
          </Typography>
        )}
      >
        <Box className="flex" sx={{ ...defSX.box }}>
          <Typography sx={{ ...defSX.subTitle }}>{t('genericName.imageFolder', '图像文件夹')}</Typography>
          <Box sx={{ ...defSX.boxInner }}>
            <AntdInput
              readOnly
              size="small"
              value={state.hotFolder as string}
              onChange={(val) => handleInputChange('hotFolder', val)}
              buttonText={<MoreHorizIcon />}
              onButtonClick={() => {
                handleClick('hotFolder', state.hotFolder);
              }}
            />
          </Box>
        </Box>
        <Box className="flex" sx={{ ...defSX.box }}>
          <Typography sx={{ ...defSX.subTitle }}>{t('genericName.behavior', '行为')}</Typography>
          <Box className="flex" sx={{ ...defSX.boxInner, '& span.MuiCheckbox-root': { p: '0 9px' } }}>
            <FormControlLabel
              sx={defSX.checkbox}
              control={
                <Checkbox
                  checked={behavior.hotFolderAutoRefresh}
                  onChange={handleCheckChange}
                  name="hotFolderAutoRefresh"
                />
              }
              label={t('genericName.autoRefresh', '自动刷新')}
            />
          </Box>
        </Box>
        <Box
          sx={{
            '& .item__label': { minWidth: 'initial' },
            '& .item__select': {
              borderRadius: 0,
              '& .MuiSelect-select': {
                padding: '3px 14px',
              },
              '.Mui-disabled': {
                background: '#f5f5f5',
              },
            },
          }}
        >
          {initHotFolder.map((item, index) => (
            <Box key={index} className="flex" sx={{ ...defSX.box }}>
              <Typography sx={{ ...defSX.subTitle }}>{item.label}</Typography>
              <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
                <FormItem {...item} onChange={handleHotFolderCheckChange} />
              </Box>
            </Box>
          ))}
        </Box>
      </SubCard>

      <Box className="flex flex-wrap" sx={{ flexBasis: '60%' }}>
        <SubCard
          sx={{ mr: '4px', flex: 2 }}
          contentClassName="flex flex-col p4!"
          Head={() => (
            <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>{`${t(
              'genericName.thoroughfare',
              '通道',
            )}${t('genericName.setting', '配置')}`}</Typography>
          )}
        >
          <PlaneOffsetTable
            tableData={thoroughfareOffset}
            onTableOffsetChange={handleThoroughfareOffset}
            onReset={resetThoroughfareOffset}
          />
        </SubCard>
        <SubCard
          contentClassName="flex flex-col p4! overflow-y-auto items-center"
          sx={{ flex: 1 }}
          Head={() => (
            <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
              {t('genericName.imagePosition', '图像位置')}
            </Typography>
          )}
        >
          <ImagePosition state={state} onStateChange={handleChange} />
        </SubCard>
      </Box>
    </Box>
  );
}

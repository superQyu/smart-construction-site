import { useEffect, useState } from 'react';
import type { HTMLProps, ReactDOM, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Tabs, Tab } from '@mui/material';

import { usePdcSettingsContext } from '@/context/PDCSettings';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { useSnackbar } from '@/context/SnackbarContext';
import {
  pdcSettingParser,
  colorPlaneParser,
  voltageAdjustmentParser,
  systemSettingParser,
  settingPaneParse,
  headInfoParse,
} from '@/hooks/printer';

import DrawIcon from '@/components/DrawIcon';
import CusButton from '@/components/CustomComponents/CusButton';
import SettingsPane from './SettingPane';
import SprayNozzleSettings from './SprayNozzleSettings';
import PCCPDCSetting from './PCCPDCSetting';
import ColorChannel from './ColorChannel';
import VoltageRegulation from './VoltageRegulation';
import SystemSettings from './SystemSettings';

export interface Props extends HTMLProps<ReactDOM> {
  // eslint-disable-next-line no-unused-vars
}
const defSX = {
  formItem: { marginRight: '12px' },
  label: { fontWeight: 700, color: '#4671f5', whiteSpace: 'nowrap' },
  inputBox: { width: '100%' },
  input: { '& input': { padding: '7px 14px' }, '& label': { top: '-8px' } },
};
export default function PDCSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [enableApplyBtnState, setEnableApplyBtnState] = useState(false);
  const { config, writeConfigFunc, restoreFunc, setConfigFunc } = useMeteorConfigContext();
  const { showSnackbar } = useSnackbar();

  const [configCtx, setConfigCtx] = usePdcSettingsContext();

  const tabs = [
    { label: t('genericName.generalSetting', '一般设置'), name: 'setting', content: <SettingsPane /> },
    { label: t('genericName.sprayNozzleSettings', '喷头设置'), name: 'engineering', content: <SprayNozzleSettings /> },
    { label: `PCC/PDC${t('genericName.setting', '配置')}`, name: 'printer', content: <PCCPDCSetting /> },
    { label: t('genericName.colorChannel', '颜色通道'), name: 'colorChannel', content: <ColorChannel /> },
    {
      label: t('genericName.voltageRegulation', '电压调整'),
      name: 'voltageRegulation',
      content: <VoltageRegulation />,
    },
    { label: t('genericName.systemSettings', '系统设置'), name: 'systemSettings', content: <SystemSettings /> },
  ];

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    if (value === 0) {
      settingPaneParse(configCtx?.settingPane || {}, config);
    }

    if (value === 1) {
      headInfoParse(configCtx?.headSetting || {}, config);
    }

    if (value === 2) {
      pdcSettingParser(configCtx?.pdcSettings || {}, config);
    }

    if (value === 3) {
      colorPlaneParser(configCtx?.colorPlane, config);
    }

    if (value === 4) {
      voltageAdjustmentParser(configCtx?.voltageAdjustment, config);
    }

    if (value === 5) {
      systemSettingParser(configCtx?.systemSetting, config);
    }
    setConfigFunc?.({ ...config });
    setValue(newValue);

    searchParams.set('target', newValue.toString());
    const newSearch = searchParams.toString();
    navigate({
      pathname: location.pathname,
      search: newSearch,
    });
  };

  useEffect(() => {
    if (Object.keys(configCtx).length > 0) {
      setEnableApplyBtnState(true);

      console.log('ctx=>', configCtx);
    }
  }, [configCtx]);

  useEffect(() => {
    const target = searchParams.get('target');
    setValue(target ? parseInt(target) : 0);
  });
  const handleApplyClick = () => {
    const localConfig = [
      (c: any) => settingPaneParse(configCtx?.settingPane || {}, c),
      (c: any) => headInfoParse(configCtx?.headSetting || {}, c),
      (c: any) => pdcSettingParser(configCtx?.pdcSettings || {}, c),
      (c: any) => colorPlaneParser(configCtx?.colorPlane, c),
      (c: any) => voltageAdjustmentParser(configCtx?.voltageAdjustment, c),
      (c: any) => systemSettingParser(configCtx?.systemSetting, c),
    ].reduce((c, curFn) => curFn(c), config);

    writeConfigFunc?.(localConfig)?.then?.(() => {
      showSnackbar({
        message: t('PDCSettings.applySuccess', '应用成功'),
        severity: 'success',
        duration: 2000,
      });
    });
  };

  const handleRestoreClick = () => {
    restoreFunc?.();
    setConfigCtx({});
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Box
        sx={{ width: '215px', marginRight: '3px', position: 'relative', border: '1px solid #d6e0fd' }}
        className="flex flex-col justify-between"
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          aria-label="Vertical tabs example"
          sx={{
            '& .Mui-selected': { color: '#fff!important', background: '#4671f5' },
          }}
          value={value}
          onChange={handleChange}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    ml: '15px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <DrawIcon name={tab.name} fill={index === value ? '#fff' : '#4671f5'} />
                  <span style={{ marginLeft: '15px' }}>{tab.label}</span>
                </Box>
              }
              sx={defSX.label}
            />
          ))}
        </Tabs>
        <Box className="py2 px6 w-full bg-white flex justify-between">
          <CusButton sx={{ mr: '8px' }} onClick={handleRestoreClick}>
            {t('genericName.restore', '恢复')}
          </CusButton>
          <CusButton disabled={!enableApplyBtnState} onClick={handleApplyClick}>
            {t('genericName.apply', '应用')}
          </CusButton>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          border: '1px solid #d6e0fd',
          width: 'calc(100% - 215px)',
        }}
      >
        {tabs.map((tab, index) => (
          <Box
            key={index}
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className=" flex flex-col w-full h-full"
            sx={{ position: 'absolute', paddingTop: '3px', visibility: value !== index ? 'hidden' : 'initial' }}
          >
            {value === index && tab.content}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

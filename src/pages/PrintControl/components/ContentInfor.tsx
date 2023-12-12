import * as React from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Tabs, Tab } from '@mui/material';
import DrawIcon from '@/components/DrawIcon';

import SettingsPane from './SettingsPane';
import EngineeringPane from './EngineeringPane';
import PrinterSettings from './PrinterSettings';
import SmartMedium from './SmartMedium';

export interface Props extends HTMLProps<ReactDOM> {
  // eslint-disable-next-line no-unused-vars
}
const defSX = {
  formItem: { marginRight: '12px' },
  label: { fontWeight: 700, color: '#4671f5', whiteSpace: 'nowrap' },
  inputBox: { width: '100%' },
  input: { '& input': { padding: '7px 14px' }, '& label': { top: '-8px' } },
};
export default function VerticalTabs({}: Props) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const tabs = [
    { label: t('printControl.tab.settingsPane', '设置窗格'), name: 'setting', content: <SettingsPane /> },
    { label: t('printControl.tab.engineeringPane', '工程窗格'), name: 'engineering', content: <EngineeringPane /> },
    { label: t('printControl.tab.printerConfig', '打印机配置'), name: 'printer', content: <PrinterSettings /> },
    { label: t('printControl.tab.smartMedium', '智能介质'), name: 'smartMedium',content: <SmartMedium /> },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (event) {
    }
  };
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        aria-label="Vertical tabs example"
        sx={{
          border: '1px solid #d6e0fd',
          width: '150px',
          marginRight: '3px',
          '& .Mui-selected': { color: '#fff!important', background: '#4671f5' },
        }}
        value={value}
        onChange={handleChange}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                {tab.name && <DrawIcon name={tab.name} fill={index === value ? '#fff' : '#4671f5'} />}
                <span style={{ marginLeft: '8px' }}>{tab.label}</span>
              </Box>
            }
            sx={defSX.label}
          />
        ))}
      </Tabs>
      <Box
        sx={{
          position: 'relative',
          border: '1px solid #d6e0fd',
          width: 'calc(100% - 150px)',
        }}
      >
        {tabs.map((tab, index) => (
          <Box
            key={index}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className=" flex flex-col w-full h-full"
            sx={{ position: 'absolute', paddingTop: '3px', visibility: value !== index ? 'hidden' : 'initial' }}
          >
            {value === index && <>{tab.content}</>}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

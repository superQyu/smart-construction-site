import { useState, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TabWithClose from '@/components/tabs/TabWithClose';

import ImageRuler from './ImageRuler';
import InnerCanvas from './InnerCanvas';
import { generateRandomId } from '@/utils';

interface CanvasItemItf {
  label: string;
  canvasId: string;
  rulerValue?: { rulerX: number; rulerY: number };
  canvasData?: any;
}

export default function ImageCanvas() {
  const { t } = useTranslation();

  const [tabs, setTabs] = useState<CanvasItemItf[]>([
    {
      label: t('imageEditor.defaultFigure', '默认画布'),
      canvasId: 'default',
    },
  ]);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    if (newValue === -1) {
      return;
    }
    setTabValue(newValue);
  };

  const onAddTab = () => {
    const randomId = generateRandomId();
    const idx = tabs.length;
    setTabs((prev) => [
      ...prev,
      {
        label: `${t('imageEditor.figure', '画布')}-${randomId}`,
        canvasId: randomId,
      },
    ]);
    setTabValue(idx);
  };

  const onCloseTab = (event: SyntheticEvent | undefined, idx: number) => {
    event?.stopPropagation();
    event?.preventDefault();
    setTabs(tabs.filter((_, i) => i !== idx));
    setTabValue(0);
  };

  const handleRulerChange = (rulerValue: any) => {
    if (tabs[tabValue]) {
      tabs[tabValue].rulerValue = rulerValue;
      setTabs(tabs);
    }
  };

  const handleCanvasChange = (data: any) => {
    if (tabs[tabValue]) {
      tabs[tabValue].canvasData = data;
      setTabs(tabs);
    }
  };

  return (
    <Box className="w-full h-full relative" sx={{ backgroundColor: '#e9edf0' }}>
      <ImageRuler key={`${tabs[tabValue]?.canvasId}-ruler`} onRulerChange={handleRulerChange}>
        <InnerCanvas
          canvasId={tabs[tabValue]?.canvasId}
          key={tabs[tabValue]?.canvasId}
          onExportData={handleCanvasChange}
          defaultCanvasData={tabs[tabValue]?.canvasData}
        />
      </ImageRuler>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        className="absolute bottom-0 w-full z2"
        sx={{
          backgroundColor: '#e9edf0',
        }}
      >
        {tabs.map((item, idx) => (
          <TabWithClose
            label={item.label}
            key={idx}
            className="shadow-inner"
            hideClose={tabs.length === 1}
            onClose={(event) => onCloseTab(event, idx)}
          ></TabWithClose>
        ))}
        <Tab
          value={-1}
          label={
            <Box className="flex items-center">
              <AddIcon /> {t('imageEditor.new', '新建')}
            </Box>
          }
          onClick={onAddTab}
        ></Tab>
      </Tabs>
    </Box>
  );
}

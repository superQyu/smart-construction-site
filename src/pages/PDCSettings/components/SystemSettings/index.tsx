import { useState, type HTMLProps, type ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import CusButton from '@/components/CustomComponents/CusButton';
import SubCard from '@/components/ContentCard/SubCard';

import Encoder from './components/Encoder';
import PrintDataBitDepth from './components/PrintDataBitDepth';
import PrintSimulation from './components/PrintSimulation';
import PrintArea from './components/PrintArea';

import PDTriggerSignal from './components/PDTriggerSignal';
import AutoFlashSpraying from './components/AutoFlashSpraying';
import NozzleColor from './components/NozzleColor';
import NetworkAdaptorModal from './components/NetworkAdaptorModal';
import ReadNozzleMemory from './components/ReadNozzleMemory';
import ERPServer from './components/ERPServer';
import TCPConfig from './components/TCPConfig';
import TestPattern from './components/TestPattern';

import NozzlePowerSupply from './components/NozzlePowerSupply';
import DataTransmissionMode from './components/DataTransmission';
import ImageStorage from './components/ImageStorage';
import OnSemandPrinting from './components/OnSemandPrinting';
import type { DataPathModeItf } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  subCard: {
    '.MuiPaper-root': { p: '0 5px', '& .MuiTypography-root': { p: '0 20px', textAlign: 'center' } },
  },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function SettingsPane() {
  const { t } = useTranslation();
  const [openNetworkAdapter, setOpenNetworkAdapter] = useState(false);
  const [enableSaveImageMode, setEnableSaveImageMode] = useState(false);
  const setGridAdapter = () => {
    setOpenNetworkAdapter(true);
  };

  const handleDataTransmissionModeChange = (mode: DataPathModeItf['mode']) => {
    if (mode === 'imageStore') {
      setEnableSaveImageMode(true);
    } else {
      setEnableSaveImageMode(false);
    }
  };
  return (
    <Box sx={{ bgcolor: 'background.paper', height: '100%', padding: '0 5px' }} className="overflow-y-auto">
      <Grid
        spacing={0.2}
        className="h-full"
        sx={{
          '.MuiGrid-root:not(:last-child)': { marginRight: '3px' },
          '.MuiGrid-root': { paddingBottom: '3px' },
          '& .cus__content': { p: '10px 15px' },
        }}
        container
      >
        <Grid xs={12} sm={12} md={4} className="flex flex-col">
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">{t('systemSettings.setting.encoder', '编码器')}</Typography>
            )}
          >
            <Encoder />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.printDataBitDepth', '打印数据位深度')}
              </Typography>
            )}
          >
            <PrintDataBitDepth />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.printSimulation', '打印仿真')}
              </Typography>
            )}
          >
            <PrintSimulation />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.printArea', '#TODO打印区域')}
              </Typography>
            )}
          >
            <PrintArea />
          </SubCard>
        </Grid>
        <Grid xs={12} sm={12} md={4} className="flex flex-col">
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.PDTriggerSignal', 'PD触发信号')}
              </Typography>
            )}
          >
            <PDTriggerSignal />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.autoFlashSpraying', '自动闪喷')}
              </Typography>
            )}
          >
            <AutoFlashSpraying />
          </SubCard>
          <Grid className="w-full" container spacing={0.2}>
            <Grid xs={12}>
              <SubCard
                contentClassName="flex flex-col overflow-y-auto cus__content"
                sx={{ ...defSX.subCard }}
                Head={() => (
                  <Typography className="w-full color-white">
                    {t('systemSettings.setting.nozzleColor', '喷头颜色')}
                  </Typography>
                )}
              >
                <NozzleColor />
              </SubCard>
            </Grid>
            <Grid xs={12} className="w-full" sx={{ flex: 1 }}>
              <SubCard
                contentClassName="flex flex-col overflow-y-auto cus__content"
                sx={{ ...defSX.subCard }}
                Head={() => (
                  <Typography className="w-full color-white">
                    {t('systemSettings.setting.PCCGrid', 'PCC网格')}
                  </Typography>
                )}
              >
                <Box className="w-full flex" sx={{ justifyContent: 'center' }}>
                  {openNetworkAdapter && (
                    <NetworkAdaptorModal open={openNetworkAdapter} onClose={() => setOpenNetworkAdapter(false)} />
                  )}

                  <CusButton onClick={setGridAdapter}>{t('genericName.setGridAdapter', '设置网格适配器')}</CusButton>
                </Box>
              </SubCard>
            </Grid>
          </Grid>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.readNozzleMemory', '读取喷头内存')}
              </Typography>
            )}
          >
            <ReadNozzleMemory />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.ERPServer', 'ERP服务器')}
              </Typography>
            )}
          >
            <ERPServer />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.TCPserverConfig', 'TCP服务器配置')}
              </Typography>
            )}
          >
            <TCPConfig />
          </SubCard>
        </Grid>
        <Grid xs={12} sm={12} md={4} className="flex flex-col">
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.testPattern', '测试图案')}
              </Typography>
            )}
          >
            <TestPattern />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.dataTransmissionMode', '数据传输模式')}
              </Typography>
            )}
          >
            <DataTransmissionMode onModeChange={handleDataTransmissionModeChange} />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.imageStorage', '图像存储')}
              </Typography>
            )}
          >
            <ImageStorage enableSaveImageMode={enableSaveImageMode} />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.nozzlePowerSupply', '喷头供电')}
              </Typography>
            )}
          >
            <NozzlePowerSupply />
          </SubCard>
          <SubCard
            contentClassName="flex flex-col overflow-y-auto cus__content"
            sx={{ ...defSX.subCard }}
            Head={() => (
              <Typography className="w-full color-white">
                {t('systemSettings.setting.onSemandPrinting', '#TODO按需打印')}
              </Typography>
            )}
          >
            <OnSemandPrinting />
          </SubCard>
        </Grid>
      </Grid>
    </Box>
  );
}

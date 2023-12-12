import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  Select,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import SubCard from '@/components/ContentCard/SubCard';
import LabelText from '@/components/LabelText';

export interface Props extends HTMLProps<HTMLElement> {
  params: {
    name: string;
  };
}

interface StateType {
  [key: string]: any;
}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', alignItems: 'center', mr: '10px' },
  subCard: {
    marginBottom: '18px',
    div: { justifyContent: 'center' },
    '.content': { padding: '0 19px' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
  formControl: { m: 1, minWidth: 120, margin: 0, width: '100%' },
  input: { '& input': { padding: '7px 14px' }, '& label': { top: '-8px' } },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 700 }, svg: { fill: '#648aff' } },
};
//  打印详情
export default function PrintColumnDetail({ params }: Props) {
  const { t } = useTranslation();

  const [state, setState] = useState<StateType>({
    RIPServerPath: '\\\\127.0.0.1SPCHD',
    port: 0,
    printColumn: '',
    RIPDirect: { profile: '0' },
    RIPAhead: { profile: '0' },
    screenDirect: { profile: '0' },
    TIFFOutputConfigurationSettings: {
      outputDirectory: '',
      outputFileFormat: '',
      ignoredSpotColors: '',
      enableCompression: false,
      addColorMap: false,
    },
    RIPAheadConfiguration: { outputDirectory: '', enableCompression: false },
    screenDirectModeConfiguration: { PDConfiguration: '' },
  });
  const handleChange = (mainkey: string, key: string, val: any) => {
    setState({
      ...state,
      [mainkey]: { ...state[mainkey], [key]: val },
    });
  };
  useEffect(() => {
    setState({
      RIPServerPath: params.name,
      port: 0,
      printColumn: '黑色、青色、品红、黄色',
      RIPDirect: { profile: '0' },
      RIPAhead: { profile: '0' },
      screenDirect: { profile: '0' },
      TIFFOutputConfigurationSettings: {
        outputDirectory: 'TIFF_Output',
        outputFileFormat: 'Jobld_%j_Imageld_%i_Plane_%p.tif',
        ignoredSpotColors: 'IGNORE',
        enableCompression: true,
        addColorMap: true,
      },
      RIPAheadConfiguration: { outputDirectory: 'xxxx', enableCompression: true },
      screenDirectModeConfiguration: {
        PDConfiguration: '0',
      },
    });
  }, []);
  return (
    <Box className="h-full" sx={{ width: '640px', margin: ' 0 90px' }}>
      <Box sx={{ mb: '16px', pl: '8px' }}>
        <LabelText label={t('printControl.server.RIPServerPath', 'RIP服务器路径') + '：'} text={state.RIPServerPath} />
      </Box>
      <Box sx={{ mb: '16px', pl: '8px' }}>
        <LabelText label={t('printControl.server.port', '端口号') + '：'} text={state.port} />
      </Box>
      <Box sx={{ mb: '16px', pl: '8px' }}>
        <LabelText label={t('printControl.server.printColumn', '打印栏') + '：'} text={state.printColumn} />
      </Box>

      <Box sx={{ height: 'calc(100% - 48px)' }}>
        <Grid
          item
          className="flex"
          sx={{
            '.MuiGrid-root': { paddingBottom: '3px' },
            '& > :not(style)': { paddingLeft: '8px', paddingRight: '8px' },
          }}
          container
        >
          <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.RIPDirect', 'RIP Direct')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '20px 0 20px 0' }}>
                <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                  {t('genericName.configurationFile', '配置文件')}
                </Typography>
                <FormControl sx={{ ...defSX.formControl }} size="small">
                  <Select
                    value={state.RIPDirect.profile}
                    onChange={(e) => handleChange('RIPDirect', 'profile', e.target.value)}
                  >
                    <MenuItem value="0">HarlequinDirect_TIFF</MenuItem>
                    <MenuItem value="1">1-HarlequinDirect_TIFF</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SubCard>
            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.RIPAhead', 'RIP Ahead')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '20px 0 20px 0' }}>
                <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                  {t('genericName.configurationFile', '配置文件')}
                </Typography>
                <FormControl sx={{ ...defSX.formControl }} size="small">
                  <Select
                    value={state.RIPAhead.profile}
                    onChange={(e) => handleChange('RIPAhead', 'profile', e.target.value)}
                  >
                    <MenuItem value="0">HarlequinDirect_RipAhead</MenuItem>
                    <MenuItem value="1">HarlequinDirect_RipAhead1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SubCard>
            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.screenDirect', 'Screen Direct')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '20px 0 20px 0' }}>
                <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                  {t('genericName.configurationFile', '配置文件')}
                </Typography>
                <FormControl sx={{ ...defSX.formControl }} size="small">
                  <Select
                    value={state.screenDirect.profile}
                    onChange={(e) => handleChange('screenDirect', 'profile', e.target.value)}
                  >
                    <MenuItem value="0">HarlequinDirect_Meteor_ScreenDirect</MenuItem>
                    <MenuItem value="1">HarlequinDirect_Meteor_ScreenDirect1</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.TIFFOutputConfigurationSettings', 'TIFF输出配置设置')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '13px 0 0' }}>
                <Box className="flex" sx={{ mb: '12px' }}>
                  <Typography className="flex" sx={{ ...defSX.subTitle }}>
                    {t('genericName.configurationFile', '配置文件')}
                  </Typography>
                  <FormControl sx={{ ...defSX.formControl }} size="small">
                    <TextField
                      name="name"
                      value={state.TIFFOutputConfigurationSettings.outputDirectory}
                      onChange={(e) =>
                        handleChange('TIFFOutputConfigurationSettings', 'outputDirectory', e.target.value)
                      }
                      sx={defSX.input}
                    />
                  </FormControl>
                </Box>
                <Box className="flex" sx={{ mb: '12px' }}>
                  <Typography className="flex" sx={{ ...defSX.subTitle }}>
                    {t('genericName.outputFileFormat', '输出文件格式')}
                  </Typography>
                  <FormControl sx={{ ...defSX.formControl }} size="small">
                    <TextField
                      name="name"
                      value={state.TIFFOutputConfigurationSettings.outputFileFormat}
                      onChange={(e) =>
                        handleChange('TIFFOutputConfigurationSettings', 'outputFileFormat', e.target.value)
                      }
                      sx={defSX.input}
                    />
                  </FormControl>
                </Box>
                <Box className="flex" sx={{ mb: '5px' }}>
                  <Typography className="flex" sx={{ ...defSX.subTitle }}>
                    {t('genericName.ignoredSpotColors', '忽略的专色')}
                  </Typography>
                  <FormControl sx={{ ...defSX.formControl }} size="small">
                    <TextField
                      name="name"
                      value={state.TIFFOutputConfigurationSettings.ignoredSpotColors}
                      onChange={(e) =>
                        handleChange('TIFFOutputConfigurationSettings', 'ignoredSpotColors', e.target.value)
                      }
                      sx={defSX.input}
                    />
                  </FormControl>
                </Box>
                <Box className="flex" sx={{ margin: '0 11px', justifyContent: 'flex-start!important' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.TIFFOutputConfigurationSettings.enableCompression}
                        onChange={(e) =>
                          handleChange('TIFFOutputConfigurationSettings', 'enableCompression', e.target.checked)
                        }
                        name="enableCompression"
                      />
                    }
                    label={t('printControl.setting.enableCompression', '启用压缩')}
                    sx={{ ...defSX.checkbox, display: 'flex', flexDirection: 'row-reverse' }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.TIFFOutputConfigurationSettings.addColorMap}
                        onChange={(e) =>
                          handleChange('TIFFOutputConfigurationSettings', 'addColorMap', e.target.checked)
                        }
                        name="enableCompression"
                      />
                    }
                    label={t('printControl.setting.addColorMap', '添加颜色图')}
                    sx={{ ...defSX.checkbox, display: 'flex', flexDirection: 'row-reverse' }}
                  />
                </Box>
              </Box>
            </SubCard>
            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.RIPAhead', 'RIP Ahead') +
                    t('printControl.setting.modeConfiguration', '模式配置')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '13px 0 0' }}>
                <Box className="flex" sx={{ mb: '5px' }}>
                  <Typography className="flex" sx={{ ...defSX.subTitle }}>
                    {t('genericName.outputDirectory', '输出目录')}
                  </Typography>
                  <FormControl sx={{ ...defSX.formControl }} size="small">
                    <TextField
                      name="name"
                      value={state.RIPAheadConfiguration.outputDirectory}
                      onChange={(e) => handleChange('RIPAheadConfiguration', 'outputDirectory', e.target.value)}
                      sx={defSX.input}
                    />
                  </FormControl>
                </Box>
                <Box className="flex" sx={{ margin: '0 11px', justifyContent: 'flex-start!important' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.RIPAheadConfiguration.enableCompression}
                        onChange={(e) => handleChange('RIPAheadConfiguration', 'enableCompression', e.target.checked)}
                        name="RTPenableCompression"
                      />
                    }
                    label={t('printControl.setting.enableCompression', '启用压缩')}
                    sx={{ ...defSX.checkbox, display: 'flex', flexDirection: 'row-reverse' }}
                  />
                </Box>
              </Box>
            </SubCard>

            <SubCard
              contentClassName="content-input overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.setting.screenDirect', 'Screen Direct') +
                    t('printControl.setting.modeConfiguration', '模式配置')}
                </Typography>
              )}
            >
              <Box className="flex" sx={{ margin: '14px 0' }}>
                <Typography className="flex" sx={{ ...defSX.subTitle }}>
                  {t('genericName.PDConfiguration', 'PDC配置')}
                </Typography>
                <FormControl sx={{ ...defSX.formControl }} size="small">
                  <Select
                    value={state.screenDirectModeConfiguration.PDConfiguration}
                    onChange={(e) => handleChange('screenDirectModeConfiguration', 'PDConfiguration', e.target.value)}
                  >
                    <MenuItem value="0">Meteor_Default.cfg</MenuItem>
                    <MenuItem value="1">1-Meteor_Default.cfg</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

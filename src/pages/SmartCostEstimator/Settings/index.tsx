import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { open as openFile } from '@tauri-apps/api/dialog';

import CustomCard from '@/components/ContentCard';
import SubCard from '@/components/ContentCard/SubCard';
import CusButton from '@/components/CustomComponents/CusButton';
import CostSettings from './CostSettings';

export default function Settings() {
  const { t } = useTranslation();

  const [configList] = useState([
    {
      label: t('smartCostEstimator.settings.default', '默认'),
      value: 'default',
    },
  ]);
  const [configValue, setConfigValue] = useState('default');
  const configLabelId = useId();

  const [detailConfig] = useState([
    {
      label: t('smartCostEstimator.settings.black', '黑色'),
      value: 'black',
      dpi: '640*400dpi',
      example: '4drop_pearl_example',
    },
    {
      label: t('smartCostEstimator.settings.cyan', '青色'),
      value: 'cyan',
      dpi: '640*400dpi',
      example: '4drop_pearl_example',
    },
    {
      label: t('smartCostEstimator.settings.pink', '玫红'),
      value: 'pink',
      dpi: '640*400dpi',
      example: '4drop_pearl_example',
    },
    {
      label: t('smartCostEstimator.settings.yellow', '黄色'),
      value: 'yellow·',
      dpi: '640*400dpi',
      example: '4drop_pearl_example',
    },
  ]);

  const [layout] = useState(t('smartCostEstimator.settings.duplex', '全双工'));
  const [colorSupport] = useState(t('smartCostEstimator.settings.color', '色彩'));

  const handleConfigChange = (event: SelectChangeEvent) => {
    setConfigValue(event.target.value as string);
  };

  async function handleOpenFile() {
    // Open a selection dialog for image files
    const selected = await openFile({
      multiple: true,
      filters: [
        {
          name: t('addImage.fileName', '文件类型'),
          extensions: ['png', 'jpeg', 'pdf', 'jpg'],
        },
      ],
    });
    if (Array.isArray(selected)) {
      // user selected multiple files
      console.log(selected);
    }
  }

  return (
    <CustomCard
      className="h-full"
      contentClassName="flex flex-col p2 overflow-y-auto"
      Head={() => (
        <Box className="text-center w-full">
          <Typography sx={{ fontWeight: 700, letterSpacing: '0.2rem' }}>
            {t('smartCostEstimator.settings.setting', '设置')}
          </Typography>
        </Box>
      )}
    >
      <SubCard
        sx={{ padding: 0, flexBasis: '50%', maxHeight: 'inherit' }}
        contentSx={{ padding: '1rem' }}
        Head={() => (
          <Box className="text-center w-full">
            <Typography sx={{ color: 'white' }}>
              {t('smartCostEstimator.settings.printerSetting', '打印机设置')}
            </Typography>
          </Box>
        )}
      >
        <Box className="flex flex-wrap justify-between">
          <FormControl fullWidth className="flex-basis-45%" sx={{ marginRight: '0.25rem', marginBottom: '1rem' }}>
            <InputLabel id={configLabelId}>{t('smartCostEstimator.settings.config', '配置')}</InputLabel>
            <Select
              size="small"
              labelId={configLabelId}
              label={t('smartCostEstimator.settings.config', '配置')}
              value={configValue}
              onChange={handleConfigChange}
            >
              {configList.map((item, idx: number) => (
                <MenuItem key={idx} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box className="flex md:justify-end flex-wrap">
            <CusButton
              onClick={handleOpenFile}
              size="small"
              className="flex-basis-15%"
              sx={{ marginRight: '0.25rem', marginBottom: '1rem' }}
            >
              {t('smartCostEstimator.settings.import', '导入')}
            </CusButton>
            <CusButton size="small" className="flex-basis-15%" sx={{ marginRight: '0.25rem', marginBottom: '1rem' }}>
              {t('smartCostEstimator.settings.export', '导出')}
            </CusButton>
            <CusButton size="small" cType="secondary" className="flex-basis-15%" sx={{ marginBottom: '1rem' }}>
              {t('smartCostEstimator.settings.delete', '删除')}
            </CusButton>
          </Box>
        </Box>

        <Typography
          sx={{ marginBottom: '0.6rem', borderColor: '#6689ff' }}
          className="border-l-solid border-l-width-3 px2"
        >
          {t('smartCostEstimator.settings.relatedInfo', '相关信息')}
        </Typography>
        <Grid container sx={{ margin: 0 }} spacing={1}>
          <Grid sm={6} xs={12}>
            <TextField
              size="small"
              disabled
              className="w-full"
              sx={{
                '.MuiInputLabel-root.Mui-disabled': {
                  color: 'inherit',
                },
              }}
              label={t('smartCostEstimator.settings.layout', '页面布局')}
              value={layout}
            />
          </Grid>
          <Grid sm={6} xs={12}>
            <TextField
              size="small"
              sx={{
                '.MuiInputLabel-root.Mui-disabled': {
                  color: 'inherit',
                },
              }}
              disabled
              className="w-full"
              label={t('smartCostEstimator.settings.colorSupport', '色彩支持')}
              value={colorSupport}
            />
          </Grid>

          {detailConfig.map((item, idx: number) => (
            <Grid sm={12} key={idx}>
              <Box className="flex w-full">
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={item.label}
                  variant="filled"
                  size="small"
                  className="flex-basis-32%"
                  sx={{ mr: '0.5rem' }}
                  disabled
                />
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={item.dpi}
                  variant="filled"
                  size="small"
                  className="flex-basis-32%"
                  sx={{ mr: '0.5rem' }}
                  disabled
                />
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={item.example}
                  variant="filled"
                  className="flex-basis-32%"
                  size="small"
                  disabled
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </SubCard>

      <SubCard
        sx={{ padding: 0, flexBasis: '50%', maxHeight: 'inherit' }}
        contentSx={{ padding: '1rem' }}
        Head={() => (
          <Box className="text-center w-full">
            <Typography sx={{ color: 'white' }}>{t('smartCostEstimator.settings.costSetting', '成本设置')}</Typography>
          </Box>
        )}
      >
        <CostSettings />
      </SubCard>
    </CustomCard>
  );
}

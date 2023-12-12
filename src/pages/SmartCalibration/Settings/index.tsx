import { useId, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  FormHelperText,
  FormLabel,
  FormGroup,
  InputAdornment,
} from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';
import CustomCard from '@/components/ContentCard';
import SubCard from '@/components/ContentCard/SubCard';
import CusButton from '@/components/CustomComponents/CusButton';

export default function Settings() {
  const { t } = useTranslation();
  const [smartCalibration, setSmartCalibration] = useState('defaultCalibration');
  const [scanner, setScanner] = useState('epson');
  const labelId = useId();
  const scannerId = useId();
  const awakeColHeightId = useId();
  const paperNumId = useId();
  const [enableAwake, setEnableAwake] = useState(false);
  const [paperNum, setPaperNum] = useState(0);
  const [awakeColHeight, setAwakeColHeight] = useState(0);
  const { showSnackbar } = useSnackbar();

  const calibrationList = [
    {
      label: t('smartCalibration.setting.defaultCalibration', '默认介质'),
      value: 'defaultCalibration',
    },
  ];

  const scannerList = [
    {
      label: t('smartCalibration.setting.epson', 'EPSON'),
      value: 'epson',
    },
  ];

  const [colorantList, setColorantList] = useState([
    {
      label: t('smartCalibration.setting.black', '黑色'),
      checked: false,
    },
    {
      label: t('smartCalibration.setting.cyan', '青色'),
      checked: false,
    },
    {
      label: t('smartCalibration.setting.pink', '玫红'),
      checked: false,
    },
    {
      label: t('smartCalibration.setting.yellow', '黄色'),
      checked: false,
    },
    {
      label: t('smartCalibration.setting.orange', '橙色'),
      checked: false,
    },
    {
      label: t('smartCalibration.setting.purple', '紫色'),
      checked: false,
    },
  ]);

  const handleSmartCalibrationChange = (event: SelectChangeEvent) => {
    setSmartCalibration(event.target.value as string);
  };

  const handleScannerChange = (event: SelectChangeEvent) => {
    setScanner(event.target.value as string);
  };

  const handleEnableAwakeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEnableAwake(event.target.checked);
  };

  const handleColorantChange = (idx: number, checked: boolean) => {
    setColorantList(colorantList.map((item, i) => (i === idx ? { ...item, checked } : item)));
  };

  const handleAwakeHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      return;
    }
    let value = 0;
    try {
      value = parseFloat(event.target.value);
    } catch (err) {
      value = 0;
    }

    setAwakeColHeight(value);
  };

  const onComplete = () => {
    showSnackbar({
      duration: 1000,
      message: `启用唤醒栏：${enableAwake} 唤醒栏高度：${awakeColHeight} 份数：${paperNum}, 校准方式：${smartCalibration}, 扫描仪：${scanner}, 着色剂： ${colorantList
        .filter((item) => item.checked)
        .map((item) => item.label)
        .join(',')} `,
      severity: 'info',
    });
  };

  return (
    <CustomCard
      className="h-full"
      contentClassName="flex flex-col p2 overflow-y-auto"
      Head={() => (
        <Box className="text-center w-full">
          <Typography sx={{ fontWeight: 700, letterSpacing: '0.2rem' }}>
            {t('smartCalibration.setting.settings', '设置')}
          </Typography>
        </Box>
      )}
    >
      <Box className="flex flex-col p4 flex-basis-20%">
        <Typography sx={{ marginBottom: '1rem' }}>
          {t('smartCalibration.setting.preTip', '要开始生成校准或线性化，请从下面的选项中选择并继续。')}
        </Typography>

        <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
          <InputLabel id={labelId}> {t('smartCalibration.setting.labelSmartCali', '智能介质')}</InputLabel>
          <Select
            size="small"
            labelId={labelId}
            label={t('smartCalibration.setting.labelSmartCali', '智能介质')}
            value={smartCalibration}
            onChange={handleSmartCalibrationChange}
          >
            {calibrationList.map((item, idx: number) => (
              <MenuItem key={idx} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id={scannerId}> {t('smartCalibration.setting.scanner', '扫描仪')}</InputLabel>
          <Select
            size="small"
            labelId={scannerId}
            label={t('smartCalibration.setting.scanner', '扫描仪')}
            value={scanner}
            onChange={handleScannerChange}
          >
            {scannerList.map((item, idx: number) => (
              <MenuItem key={idx} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <SubCard
        contentClassName="flex flex-col p4! overflow-y-auto"
        Head={() => (
          <Typography className="w-full text-center color-white">
            {t('smartCalibration.setting.goal', '设置打印目标')}
          </Typography>
        )}
      >
        <FormControl sx={{ marginBottom: '0.5rem' }}>
          <FormControlLabel
            control={<Checkbox checked={enableAwake} onChange={handleEnableAwakeChange} name="enableAwake" />}
            label={t('smartCalibration.setting.enableAwake', '启用唤醒栏')}
          />
        </FormControl>
        <FormControl
          sx={{
            marginBottom: '1rem',
            label: {
              top: '-7px',
            },
          }}
        >
          <InputLabel htmlFor={awakeColHeightId}>
            {t('smartCalibration.setting.awakeColHeight', '唤醒栏高度')}
          </InputLabel>
          <OutlinedInput
            size="small"
            id={awakeColHeightId}
            value={awakeColHeight}
            onChange={handleAwakeHeightChange}
            endAdornment={
              <InputAdornment position="end">{t('smartCalibration.setting.awakeColHeightUnit', 'mm')}</InputAdornment>
            }
            label={t('smartCalibration.setting.awakeColHeight', '唤醒栏高度')}
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
          />
        </FormControl>

        <FormControl
          sx={{
            marginBottom: '1rem',
            label: {
              top: '-7px',
            },
          }}
        >
          <InputLabel htmlFor={paperNumId}>{t('smartCalibration.setting.paperNum', '份数')}</InputLabel>
          <OutlinedInput
            size="small"
            id={paperNumId}
            value={paperNum}
            onChange={(event) => setPaperNum(parseInt(event.target.value, 10))}
            endAdornment={
              <InputAdornment position="end">{t('smartCalibration.setting.paperNumUnit', '份')}</InputAdornment>
            }
            label={t('smartCalibration.setting.paperNum', '份数')}
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
              prefix: 'mm',
            }}
          />
          <FormHelperText sx={{ margin: 0 }}>
            {t('smartCalibration.setting.paperNumTip', '（为了获得最佳质量，请使用偶数份）')}
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">{t('smartCalibration.setting.colorant', '着色剂')}</FormLabel>
          <FormGroup>
            {colorantList.map((item, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    name={item.label}
                    checked={item.checked}
                    onChange={(event) => handleColorantChange(idx, event.target.checked)}
                  />
                }
                label={item.label}
              />
            ))}
          </FormGroup>
        </FormControl>
      </SubCard>

      <Box className="flex justify-end py4 flex-basis-50px">
        <CusButton onClick={onComplete}>{t('smartCalibration.setting.finished', '完成设置')}</CusButton>
      </Box>
    </CustomCard>
  );
}

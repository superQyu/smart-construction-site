import { useState, useId, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  type SelectChangeEvent,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import SubCard from '@/components/ContentCard/SubCard';
import CusButton from '@/components/CustomComponents/CusButton';

export default function JobSetting() {
  const { t } = useTranslation();
  const [medium, setMedium] = useState('default');
  const mediumLabelId = useId();
  const mediumCostLabelId = useId();
  const pageRangeLabelId = useId();
  const originPathLabelId = useId();
  const projectNumLabelId = useId();
  const numLabelId = useId();

  const [mediumCost, setMediumCost] = useState(0);
  const [pageRange, setPageRange] = useState(1);
  const [originPath, setOriginPath] = useState('C:\\');
  const [preComposition, setPreComposition] = useState(false);
  const [waitComposition, setWaitComposition] = useState(false);
  const [exitRotation, setExitRotation] = useState(false);
  const [projectNum, setProjectNum] = useState(0);
  const [num, setNum] = useState(0);

  const mediumList = [
    {
      label: t('smartCostEstimator.settings.defaultMedium', '默认介质'),
      value: 'default',
    },
  ];

  const handleMediumChange = (event: SelectChangeEvent) => {
    setMedium(event.target.value);
  };

  const handlePreCompositionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPreComposition(event.target.checked);
  };

  const handleWaitComposition = (event: ChangeEvent<HTMLInputElement>) => {
    setWaitComposition(event.target.checked);
  };

  const handleExitRotation = (event: ChangeEvent<HTMLInputElement>) => {
    setExitRotation(event.target.checked);
  };
  return (
    <SubCard
      sx={{ padding: 0, height: '100%' }}
      contentSx={{ paddingX: '0.5rem', display: 'flex', flexDirection: 'column' }}
      Head={() => (
        <Box className="text-center w-full">
          <Typography sx={{ color: 'white' }}>{t('smartCostEstimator.settings.jobSetting', '作业设置')}</Typography>
        </Box>
      )}
    >
      <Box className="p2 flex flex-col">
        <FormControl sx={{ marginBottom: '1rem' }} size="small">
          <InputLabel id={mediumLabelId}>{t('smartCostEstimator.settings.medium', '介质')}</InputLabel>
          <Select
            labelId={mediumLabelId}
            id={mediumLabelId}
            value={medium}
            label={t('smartCostEstimator.settings.medium', '介质')}
            onChange={handleMediumChange}
          >
            {mediumList.map((item, idx: number) => (
              <MenuItem value={item.value} key={idx}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            marginBottom: '1rem',
          }}
        >
          <InputLabel htmlFor={mediumCostLabelId}>{t('smartCostEstimator.settings.mediumCost', '介质成本')}</InputLabel>
          <OutlinedInput
            size="small"
            id={mediumCostLabelId}
            value={mediumCost}
            onChange={(event) => setMediumCost(parseInt(event.target.value, 10))}
            label={t('smartCostEstimator.settings.mediumCost', '介质成本')}
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
          />
        </FormControl>
        <Box className="flex justify-between mb4 items-center">
          <FormControl
            sx={{
              marginRight: '0.5rem',
              'label:not([data-shrink="true"])': { top: '-7px' },
              flex: '1',
            }}
          >
            <InputLabel htmlFor={originPathLabelId}>{t('smartCostEstimator.settings.originPath', '源路径')}</InputLabel>
            <OutlinedInput
              size="small"
              id={originPathLabelId}
              value={originPath}
              onChange={(event) => setOriginPath(event.target.value)}
              label={t('smartCostEstimator.settings.originPath', '源路径')}
            />
          </FormControl>
          <Box>
            <CusButton sx={{ mr: '0.5rem' }}>TIFF</CusButton>
            <CusButton>PDF</CusButton>
          </Box>
        </Box>

        <FormControl
          sx={{
            marginBottom: '1rem',
          }}
        >
          <InputLabel htmlFor={pageRangeLabelId}>{t('smartCostEstimator.settings.pageRange', '页面范围')}</InputLabel>
          <OutlinedInput
            size="small"
            id={pageRangeLabelId}
            value={pageRange}
            onChange={(event) => setPageRange(parseInt(event.target.value, 10))}
            label={t('smartCostEstimator.settings.pageRange', '页面范围')}
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
          />
        </FormControl>
      </Box>
      <SubCard
        sx={{ padding: 0, height: '100%' }}
        contentSx={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}
        Head={() => (
          <Box className="text-center w-full">
            <Typography sx={{ color: 'white' }}>
              {t('smartCostEstimator.settings.compositionSetting', '拼版设置')}
            </Typography>
          </Box>
        )}
      >
        <Box>
          <FormControl sx={{ m: 3 }} variant="standard">
            <FormControlLabel
              control={<Checkbox checked={preComposition} onChange={handlePreCompositionChange} />}
              label={t('smartCostEstimator.settings.preComposition', '预拼版')}
            />
          </FormControl>
          <FormControl sx={{ m: 3 }} variant="standard">
            <FormControlLabel
              control={<Checkbox checked={waitComposition} onChange={handleWaitComposition} />}
              label={t('smartCostEstimator.settings.waitComposition', '待拼版')}
            />
          </FormControl>
          {waitComposition && (
            <FormControl sx={{ m: 3 }} variant="standard">
              <FormControlLabel
                control={<Checkbox checked={exitRotation} onChange={handleExitRotation} />}
                label={t('smartCostEstimator.settings.exitRotation', '存在旋转')}
              />
            </FormControl>
          )}
        </Box>

        <FormControl
          sx={{
            marginBottom: '1rem',
          }}
        >
          <InputLabel htmlFor={projectNumLabelId}>
            {t('smartCostEstimator.settings.projectNum', '每项项目数')}
          </InputLabel>
          <OutlinedInput
            size="small"
            id={projectNumLabelId}
            value={projectNum}
            onChange={(event) => setProjectNum(parseInt(event.target.value, 10))}
            label={t('smartCostEstimator.settings.projectNum', '每项项目数')}
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
          }}
        >
          <InputLabel htmlFor={numLabelId}>{t('smartCostEstimator.settings.num', '份数')}</InputLabel>
          <OutlinedInput
            size="small"
            id={numLabelId}
            value={num}
            onChange={(event) => setNum(parseInt(event.target.value, 10))}
            label={t('smartCostEstimator.settings.num', '份数')}
            inputProps={{
              step: 1,
              min: 0,
              max: 99999,
              type: 'number',
            }}
          />
        </FormControl>
      </SubCard>
    </SubCard>
  );
}

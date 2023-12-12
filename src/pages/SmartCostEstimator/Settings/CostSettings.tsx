import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Box,
  type BoxProps,
  Typography,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';

export interface Props extends BoxProps {}

export default function CostSettings(props: Props) {
  const { t } = useTranslation();

  const inkCostLabelId = useId();
  const inkBoxCostLabelId = useId();
  const inkBoxWeightLabelId = useId();
  const repairCostLabelId = useId();
  const repairGapLabelId = useId();

  const [inkCost, setInkCost] = useState(0);
  const [inkBoxCost, setInkBoxCost] = useState(0);
  const [inkBoxWeight, setInkBoxWeight] = useState(0);
  const [repairCost, setRepairCost] = useState(0);
  const [repairGap, setRepairGap] = useState(0);
  const [currencyUnit, setCurrencyUnit] = useState('yuan');

  const currencyUnitArr = [
    {
      label: t('smartCostEstimator.settings.yuan', '元'),
      value: 'yuan',
    },
  ];

  const handleCurrencyUnitChange = (event: SelectChangeEvent) => {
    setCurrencyUnit(event.target.value);
  };

  return (
    <Box {...props}>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={inkCostLabelId}>{t('smartCostEstimator.settings.inkCost', '墨水成本')}</InputLabel>
        <OutlinedInput
          size="small"
          id={inkCostLabelId}
          value={inkCost}
          onChange={(event) => setInkCost(parseInt(event.target.value, 10))}
          endAdornment={
            <InputAdornment position="end">{t('smartCostEstimator.settings.inkCostUnit', '元/升')}</InputAdornment>
          }
          label={t('smartCostEstimator.settings.inkCost', '墨水成本')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
            prefix: 'mm',
          }}
        />
      </FormControl>
      <Typography sx={{ marginBottom: '0.6rem' }}>{t('smartCostEstimator.settings.tonerCost', '碳粉成本')}</Typography>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={inkBoxCostLabelId}>{t('smartCostEstimator.settings.inkBoxCost', '墨盒成本')}</InputLabel>
        <OutlinedInput
          size="small"
          id={inkBoxCostLabelId}
          value={inkBoxCost}
          onChange={(event) => setInkBoxCost(parseInt(event.target.value, 10))}
          endAdornment={
            <InputAdornment position="end">{t('smartCostEstimator.settings.inkBoxCostUnit', '元/个')}</InputAdornment>
          }
          label={t('smartCostEstimator.settings.inkBoxCost', '墨盒成本')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
            prefix: 'mm',
          }}
        />
      </FormControl>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={inkBoxWeightLabelId}>
          {t('smartCostEstimator.settings.inkBoxWeight', '墨盒重量')}
        </InputLabel>
        <OutlinedInput
          size="small"
          id={inkBoxWeightLabelId}
          value={inkBoxWeight}
          onChange={(event) => setInkBoxWeight(parseInt(event.target.value, 10))}
          label={t('smartCostEstimator.settings.inkBoxWeight', '墨盒重量')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
            prefix: 'mm',
          }}
        />
      </FormControl>
      <Typography sx={{ marginBottom: '0.6rem' }}>
        {t('smartCostEstimator.settings.serviceCost', '服务成本')}
      </Typography>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={repairCostLabelId}>{t('smartCostEstimator.settings.repairCost', '维修成本')}</InputLabel>
        <OutlinedInput
          size="small"
          id={repairCostLabelId}
          value={repairCost}
          onChange={(event) => setRepairCost(parseInt(event.target.value, 10))}
          label={t('smartCostEstimator.settings.repairCost', '维修成本')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
            prefix: 'mm',
          }}
        />
      </FormControl>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={repairGapLabelId}>{t('smartCostEstimator.settings.repairGap', '维修间隔')}</InputLabel>
        <OutlinedInput
          size="small"
          id={repairGapLabelId}
          value={repairGap}
          onChange={(event) => setRepairGap(parseInt(event.target.value, 10))}
          label={t('smartCostEstimator.settings.repairGap', '维修间隔')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
            prefix: 'mm',
          }}
        />
      </FormControl>
      <Typography sx={{ marginBottom: '0.3rem' }}>{t('smartCostEstimator.settings.currency', '货币')}</Typography>
      <FormControl
        sx={{
          width: '100%',
        }}
      >
        <Select
          size="small"
          value={currencyUnit}
          onChange={handleCurrencyUnitChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {currencyUnitArr.map((item, idx: number) => (
            <MenuItem value={item.value} key={idx}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

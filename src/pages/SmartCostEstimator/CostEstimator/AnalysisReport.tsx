import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, OutlinedInput, type BoxProps } from '@mui/material';

export interface Props extends BoxProps {
  defaultSinglePageCost?: number;
  defaultEveryJobCost?: number;
  defaultEveryProjectCost?: number;
}

export default function AnalysisReport({
  defaultSinglePageCost,
  defaultEveryJobCost,
  defaultEveryProjectCost,
  ...resProps
}: Props) {
  const { t } = useTranslation();
  const singlePageCostLabelId = useId();
  const everyJobCostLabelId = useId();
  const everyProjectLabelId = useId();

  const [singlePageCost, setSinglePageCost] = useState(defaultSinglePageCost || 0);
  const [everyJobCost, setEveryJobCost] = useState(defaultEveryJobCost || 0);
  const [everyProjectCost, setEveryProjectCost] = useState(defaultEveryProjectCost || 0);

  return (
    <Box className="flex flex-col items-center" {...resProps}>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={singlePageCostLabelId}>
          {t('smartCostEstimator.settings.singlePageCost', '单页成本')}
        </InputLabel>
        <OutlinedInput
          size="small"
          id={singlePageCostLabelId}
          value={singlePageCost}
          onChange={(event) => setSinglePageCost(parseFloat(event.target.value))}
          label={t('smartCostEstimator.settings.singlePageCost', '单页成本')}
          inputProps={{
            step: 0.1,
            min: 0,
            max: 99999,
            type: 'number',
          }}
        />
      </FormControl>
      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={everyJobCostLabelId}>
          {t('smartCostEstimator.settings.everyJobCost', '每份工作的成本')}
        </InputLabel>
        <OutlinedInput
          size="small"
          id={everyJobCostLabelId}
          value={everyJobCost}
          onChange={(event) => setEveryJobCost(parseFloat(event.target.value))}
          label={t('smartCostEstimator.settings.everyJobCost', '每份工作的成本')}
          inputProps={{
            step: 0.1,
            min: 0,
            max: 99999,
            type: 'number',
          }}
        />
      </FormControl>

      <FormControl
        sx={{
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <InputLabel htmlFor={everyProjectLabelId}>
          {t('smartCostEstimator.settings.everyProjectCost', '每个项目的成本')}
        </InputLabel>
        <OutlinedInput
          size="small"
          id={everyProjectLabelId}
          value={everyProjectCost}
          onChange={(event) => setEveryProjectCost(parseFloat(event.target.value))}
          label={t('smartCostEstimator.settings.everyProjectCost', '每个项目的成本')}
          inputProps={{
            step: 0.1,
            min: 0,
            max: 99999,
            type: 'number',
          }}
        />
      </FormControl>
    </Box>
  );
}

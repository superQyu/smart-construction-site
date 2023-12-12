import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';

import SubCard from '@/components/ContentCard/SubCard';
import ImagePreview from '@/components/ImagePreview';

export default function JobPreview() {
  const { t } = useTranslation();
  const widthLabelId = useId();
  const heightLabelId = useId();
  const pageNumLabelId = useId();
  const unitLabelId = useId();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [unit, setUnit] = useState('mm');
  const unitList = [
    {
      label: t('smartCostEstimator.settings.mm', '毫米'),
      value: 'mm',
    },
  ];

  const handleMediumChange = (event: SelectChangeEvent) => {
    setUnit(event.target.value);
  };

  const [previewImageItem] = useState(null);

  return (
    <SubCard
      sx={{ padding: 0, height: '100%' }}
      contentSx={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}
      contentClassName="overflow-y-auto"
      Head={() => (
        <Box className="text-center w-full">
          <Typography sx={{ color: 'white' }}>{t('smartCostEstimator.settings.jobPreview', '作业预览')}</Typography>
        </Box>
      )}
    >
      <FormControl
        sx={{
          marginBottom: '1rem',
        }}
      >
        <InputLabel htmlFor={widthLabelId}>{t('smartCostEstimator.settings.width', '宽度')}</InputLabel>
        <OutlinedInput
          size="small"
          id={widthLabelId}
          value={width}
          onChange={(event) => setWidth(parseFloat(event.target.value))}
          label={t('smartCostEstimator.settings.width', '宽度')}
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
        }}
      >
        <InputLabel htmlFor={heightLabelId}>{t('smartCostEstimator.settings.height', '高度')}</InputLabel>
        <OutlinedInput
          size="small"
          id={heightLabelId}
          value={height}
          onChange={(event) => setHeight(parseFloat(event.target.value))}
          label={t('smartCostEstimator.settings.height', '高度')}
          inputProps={{
            step: 0.1,
            min: 0,
            max: 99999,
            type: 'number',
          }}
        />
      </FormControl>

      <FormControl sx={{ marginBottom: '1rem' }} size="small">
        <InputLabel id={unitLabelId}>{t('smartCostEstimator.settings.unit', '单位')}</InputLabel>
        <Select
          labelId={unitLabelId}
          id={unitLabelId}
          value={unit}
          label={t('smartCostEstimator.settings.medium', '介质')}
          onChange={handleMediumChange}
        >
          {unitList.map((item, idx: number) => (
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
        <InputLabel htmlFor={pageNumLabelId}>{t('smartCostEstimator.settings.pageNum', '页数')}</InputLabel>
        <OutlinedInput
          size="small"
          id={pageNumLabelId}
          value={pageNum}
          onChange={(event) => setPageNum(parseInt(event.target.value, 10))}
          label={t('smartCostEstimator.settings.pageNum', '页数')}
          inputProps={{
            step: 1,
            min: 0,
            max: 99999,
            type: 'number',
          }}
        />
      </FormControl>

      <ImagePreview>
        {previewImageItem ? (
          <img src={previewImageItem} alt="" className="max-h100% max-w100%"></img>
        ) : (
          <Typography sx={{ color: 'text.secondary' }}>
            {t('digitalInteraction.noPreviewImage', '无可用预览')}
          </Typography>
        )}
      </ImagePreview>
    </SubCard>
  );
}

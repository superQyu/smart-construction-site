import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import CustomCard from '@/components/ContentCard';
import CusButton from '@/components/CustomComponents/CusButton';
import CustomDialog from '@/components/CustomDialog';
import { useSnackbar } from '@/context/SnackbarContext';

import JobSetting from './JobSetting';
import JobPreview from './JobPreview';
import AnalysisReport from './AnalysisReport';

export default function CostEstimator() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleGenerateReport = () => {
    showSnackbar({
      message: t('smartCostEstimator.settings.generateReport', '生成分析报告'),
      severity: 'info',
    });
  };

  return (
    <CustomCard
      className="h-full"
      contentClassName="flex flex-col justify-between p2 overflow-y-auto"
      Head={() => (
        <Box className="text-center w-full">
          <Typography sx={{ fontWeight: 700 }}>{t('smartCostEstimator.settings.costEstimate', '成本估计')}</Typography>
        </Box>
      )}
    >
      <Grid container sx={{ margin: 0 }} className="flex-1 h-full" spacing={0.5}>
        <Grid xs={12} sm={6}>
          <JobSetting />
        </Grid>

        <Grid xs={12} sm={6}>
          <JobPreview />
        </Grid>
      </Grid>

      <Box className="flex justify-end p2">
        <CusButton onClick={() => setOpen(true)}>{t('smartCostEstimator.settings.analysis', '分析')}</CusButton>
      </Box>

      <CustomDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={
          <Typography sx={{ fontWeight: 700, textAlign: 'left' }}>
            {t('smartCostEstimator.settings.analysisReport', '分析报告')}
          </Typography>
        }
        content={<AnalysisReport sx={{ width: '50vw' }} />}
        confirmButton={
          <Button variant="contained" onClick={handleGenerateReport} size="small">
            {t('smartCostEstimator.settings.createAnalysisReport', '创建分析报告')}{' '}
          </Button>
        }
      />
    </CustomCard>
  );
}

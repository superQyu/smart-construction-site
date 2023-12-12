import { Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import Settings from './Settings';
import CostEstimator from './CostEstimator';

export default function SmartCostEstimator() {
  return (
    <Paper elevation={0} sx={{ backgroundColor: '#f8f9fd', height: '100%' }} className="p2 flex flex-col">
      <Grid container sx={{ margin: 0 }} spacing={0.5} className="h-full flex-1 lg:max-h[calc(100vh-136px)]">
        <Grid xs={12} sm={4} className="max-h100vh lg:max-h-inherit">
          <Settings />
        </Grid>
        <Grid xs={12} sm={8} className="max-h100vh lg:max-h-inherit">
          <CostEstimator />
        </Grid>
      </Grid>
    </Paper>
  );
}

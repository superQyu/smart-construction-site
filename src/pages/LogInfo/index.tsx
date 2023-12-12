import { Paper } from '@mui/material';

import CustomCard from '@/components/CustomCard';
import LogStackedBarChart from './LogStackedBarChart';
import LogSearchTable from './LogSearchTable';

export default function LogInfo() {
  return (
    <Paper
      elevation={0}
      sx={{ backgroundColor: '#f8f9fd', height: '100%' }}
      className="p2 flex flex-col lg:max-h[calc(100vh-120px)]"
    >
      <CustomCard className="max-h40% flex-basis-40% px8" contentClassName="flex justify-center overflow-y-auto">
        <LogStackedBarChart />
      </CustomCard>
      <CustomCard className="max-h60% flex-basis-60% mt2 px8" contentClassName="py8 overflow-y-auto">
        <LogSearchTable className="max-h-full h-full" />
      </CustomCard>
    </Paper>
  );
}

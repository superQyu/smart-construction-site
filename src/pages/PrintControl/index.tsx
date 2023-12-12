import { Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import HeaderInfor from './components/HeaderInfor';
import ContentInfor from './components/ContentInfor';

export default function PrintControl() {

  return (
    <>
      <Paper elevation={0} sx={{ backgroundColor: '#f8f9fd', height: '100%' }} className="p2 flex flex-col">
        <Grid container spacing={0.5} className="h-full flex-1 lg:max-h[calc(100vh-136px)]" sx={{ margin: 0 }}>
          <Grid xs={12} sm={12} md={12} className="flex flex-col max-h100vh lg:max-h-inherit">
            <HeaderInfor className="flex-basis-10% mb1 max-h10%" />
            <ContentInfor className="flex-basis-10% mb1 max-h80%" />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

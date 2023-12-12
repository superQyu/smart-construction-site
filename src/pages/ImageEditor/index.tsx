import { Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import HandlePanel from './HandlePanel';
import ImageCanvas from './ImageCanvas';

import { ImageEditorContextProvider } from '@/context/ImageEditorContext';

export default function ImageEditor() {
  return (
    <ImageEditorContextProvider>
      <Paper elevation={0} sx={{ backgroundColor: '#f8f9fd' }} className="p2 flex flex-col h-full">
        <Grid container sx={{ margin: 0 }} spacing={1} className="h-full flex-1">
          <Grid xs={12} sm={4} md={3} className="max-h100vh">
            <Paper className="w-full h-full">
              <HandlePanel />
            </Paper>
          </Grid>
          <Grid xs={12} sm={8} md={9} className="max-h100vh">
            <Paper className="w-full h-full">
              <ImageCanvas />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </ImageEditorContextProvider>
  );
}

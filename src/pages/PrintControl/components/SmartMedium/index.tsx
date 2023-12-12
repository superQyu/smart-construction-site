import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid } from '@mui/material';

import Settings from './settings';
import FeaturedPane from './FeaturedPane';

export interface Props extends HTMLProps<ReactDOM> {}

export default function SettingsPane({}: Props) {
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
      <Box className="h-full" sx={{ padding: '0 5px' }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className="flex flex-col  max-h100vh lg:max-h-inherit h-full"
          sx={{
            flexWrap: 'nowrap',
            '.MuiGrid-root:not(:last-child)': { marginRight: '3px' },
            '.MuiGrid-root': { paddingBottom: '3px' },
          }}
          container
        >
          <Grid item xs={12} sm={12} md={4} className="sm:max-h100% max-h100% h-full">
            <Settings label={t('genericName.settings', '设置')} />
          </Grid>
          <Grid item xs={12} sm={12} md={8} className="sm:max-h100% max-h100% h-full ">
            <FeaturedPane label={t('genericName.featuredPane', '特征化窗格')} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

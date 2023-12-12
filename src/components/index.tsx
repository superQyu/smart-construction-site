import { lazy, useState, Suspense } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const compList = import.meta.glob('./**/*.tsx');
const menuList = Object.entries(compList).map(([key, val]) => {
  // ./AlertMessage.tsx () => import("...")
  let label = key.split('/').slice(-1)[0].split('.')[0];
  if (label === 'index') {
    label = key.split('/').slice(-2)[0];
  }
  return {
    label: label,
    Component: lazy(val as () => Promise<any>),
  };
});

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function ComponentDoc() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const DynamicComp = () => {
    const Comp = menuList[value].Component;
    return <Comp />;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', width: '100%' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {menuList.map((item, idx) => (
          <Tab label={item.label} {...a11yProps(idx)} key={idx} />
        ))}
      </Tabs>
      <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '2rem' }}>
        <Suspense fallback={<CircularProgress size={20} />}>
          <DynamicComp />
        </Suspense>
      </Box>
    </Box>
  );
}

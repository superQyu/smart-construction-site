import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WeiGangLogo from './WeiGangBigLogo';

export default function About() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        width: '540px',
        margin: '20px 0',
        '& svg': { width: '330px', margin: '0 auto 20px' },
        '& p': { fontWeight: 700 },
      }}
    >
      <WeiGangLogo className="sm:block" />
      <Typography sx={{ mb: '10px' }}>版本: 1.2.13</Typography>
      <Typography>©Zhejiang Weigang Technology Co., Ltd. All rights reserved</Typography>
    </Box>
  );
}

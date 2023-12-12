import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import ContentCard from '@/components/ContentCard';

import AntdInput from '@/components/CustomComponents/CusInput';
import CusButton from '@/components/CustomComponents/CusButton';

export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center' },
};
export default function SmartMedium(props: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    page: 2046,
  });

  const handleInputChange = (val: any) => {
    setState({ ...state, page: val });
  };
  const handleReset = () => {
    setState({ ...state, page: 2046 });
  };
  useEffect(() => {}, []);
  const { page } = state;
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="h-full" sx={{ padding: '1px' }}>
        <Box
          className="overflow-y-auto"
          sx={{ marginTop: '29px', padding: '2px 19px 0 19px', height: 'calc(100% - 50px)' }}
        >
          <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
            {t('genericName.engineeringPane.totalPagesPrinted', '已打印总页数')}
          </Typography>
          <AntdInput
            sx={{ input: { textAlign: 'center' } }}
            size='small'
            valueType="number"
            value={page}
            onChange={handleInputChange}
          />
          <CusButton sx={{ mt: '20px' }} onClick={handleReset}>
            {t('genericName.reset', '重置')}
          </CusButton>
        </Box>
      </Box>
    </ContentCard>
  );
}

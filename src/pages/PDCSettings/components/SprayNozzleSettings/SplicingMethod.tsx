import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import CusButton from '@/components/CustomComponents/CusButton';
export default function SplicingMethod() {
  const { t } = useTranslation();

  const [methods, setMethods] = useState([
    {
      label: t('genericName.docking', '对接'),
      checked: true,
    },
    {
      label: 'AABB',
      checked: false,
    },
    {
      label: t('genericName.randomDistribution', '随机分布'),
      checked: false,
    },
    {
      label: t('genericName.overprint', '叠印'),
      checked: false,
    },
    {
      label: 'Dither',
      checked: false,
    },
    {
      label: 'Mask file',
      checked: false,
    },
  ]);

  const handleMethodsChange = (idx: number, checked: boolean) => {
    setMethods(methods.map((item, i) => (i === idx ? { ...item, checked } : item)));
  };

  return (
    <Box sx={{ p: '0 40px' }}>
      <FormGroup>
        {methods.map((item, idx) => (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox
                name={item.label}
                checked={item.checked}
                onChange={(event) => handleMethodsChange(idx, event.target.checked)}
              />
            }
            label={item.label}
          />
        ))}
      </FormGroup>
      <CusButton sx={{ mt: '35px', letterSpacing: '5px' }}>{t('genericName.select', '选择')}</CusButton>
    </Box>
  );
}

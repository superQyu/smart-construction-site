import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';

export interface Props extends HTMLProps<HTMLElement> {}

interface State {
  [key: string]: string;
}

const defSX = {
  box: { mb: '24px', pl: '8px' },
};
//  介质详情
export default function MediumDetail({}: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const [state, setState] = useState<State>();
  useEffect(() => {}, []);
  const [initForm] = useState<formItemProps[]>([
    {
      label: t('genericName.name', '名称'),
      itemkey: 'name',
      value: '黑色',
      style: { label: { justifyContent: 'flex-end', minWidth: 'initial' } },
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  return (
    <Box className="h-full" sx={{ margin: ' 0 90px' }}>
      <Box sx={{ ...defSX.box }}>
        {initForm.map((item, index) => (
          <FormItem key={index} {...item} onChange={handleChange} />
        ))}
      </Box>
    </Box>
  );
}

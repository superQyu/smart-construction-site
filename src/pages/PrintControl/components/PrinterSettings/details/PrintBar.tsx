import { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';

export interface Props extends HTMLProps<HTMLElement> {
  params: {
    name: string;
  };
}

interface State {
  [key: string]: string;
}

const defSX = {
  box: { mb: '24px', pl: '8px' },
};
//  介质详情
export default function PrintBarDetail({ params }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const [state, setState] = useState<State>();
  const [initForm] = useState<formItemProps[]>([
    {
      label: t('genericName.planeNumber', '平面编号'),
      itemkey: 'planeNumber',
      value: params.name,
      style: { label: { justifyContent: 'flex-end', minWidth: 'initial' } },
    },
    {
      label: t('genericName.printBarGroupListNumber', '对应的打印条组列表'),
      itemkey: 'printBarGroupListNumber',
      type: 'select',
      value: '0',
      options: [
        { label: t('printControl.medium.printBarGroup', '打印条组') + '1', value: 0 },
        { label: t('printControl.medium.printBarGroup', '打印条组') + '2', value: 1 },
        { label: t('printControl.medium.printBarGroup', '打印条组') + '3', value: 2 },
      ],
      style: { label: { minWidth: 'initial' } },
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };

  return (
    <Box className="h-full" sx={{ margin: ' 0 90px' }}>
      <Box sx={{ ...defSX.box, '.item__label': { width: '170px' } }}>
        {initForm.map((item, index) => (
          <FormItem key={index} {...item} onChange={handleChange} />
        ))}{' '}
      </Box>
    </Box>
  );
}

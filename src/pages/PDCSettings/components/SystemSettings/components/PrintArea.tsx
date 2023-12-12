import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, InputAdornment, OutlinedInput } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';
import CusButton from '@/components/CustomComponents/CusButton';

interface State {
  [key: string]: string | number;
}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    minWidth: '40px',
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
};
export default function PrintArea({}: Props) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    left: 0,
    right: 0,
  });
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  const resetState = () => {
    const updatedState = { ...state };
    for (const key in updatedState) {
      if (Object.prototype.hasOwnProperty.call(updatedState, key)) updatedState[key] = 0;
    }
    setState(updatedState);
    showSnackbar({ message: '[状态] reset success!', severity: 'success' });
  };

  return (
    <Box sx={{p:'10px'}}>
      <Box sx={{ mb: '10px' }}>
        <CusButton onClick={resetState}>{t('genericName.resetTo', '重置为')}</CusButton>
      </Box>
      <Box
        className="flex"
        sx={{
          flexWrap: 'wrap',
          whiteSpace: 'nowrap',
          '& .settings__item': { flexBasis: '50%', mb: '10px', pr: '10px' },
        }}
      >
        <Box className="flex settings__item">
          <OutlinedInput
            size="small"
            value={state.left}
            onChange={(e) => handleChange('left', e.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '10px', '& p': { fontWeight: 700 } }}>
                ㎡
              </InputAdornment>
            }
            inputProps={{ step: 0.1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
        <Box className="flex settings__item">
          <OutlinedInput
            size="small"
            value={state.right}
            onChange={(e) => handleChange('right', e.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ position: 'absolute', right: '10px', '& p': { fontWeight: 700 } }}>
                m
              </InputAdornment>
            }
            inputProps={{ step: 0.1, min: 0, max: 99999, type: 'number' }}
            sx={{ ...defSX.inputBox }}
          />
        </Box>
      </Box>
    </Box>
  );
}

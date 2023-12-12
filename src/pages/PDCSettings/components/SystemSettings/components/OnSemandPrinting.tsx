import react, { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';

export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  radio: {
    color: '#648aff',
    '&.Mui-checked': {
      color: 'rgba(100,138,255,.85)',
    },
  },
};
export default function ImageStorage() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [state, setState] = useState<string | number>('close');
  const handleChange = (e: react.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
    showSnackbar({ message: `[onSemandPrinting] updated`, severity: 'success' });
  };

  return (
    <Box sx={{ p: '0 20px' }}>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          sx={{
            '& span.MuiFormControlLabel-label': { fontWeight: '700' },
            '& span.MuiButtonBase-root': { p: '4px 9px' },
          }}
          value={state}
          onChange={handleChange}
        >
          <FormControlLabel
            value="close"
            control={<Radio sx={{ ...defSX.radio }} />}
            label={`${t('genericName.close', '关闭')}`}
          />
          <Box>
            <FormControlLabel
              value="printedOnPLCCommands"
              control={<Radio sx={{ ...defSX.radio }} />}
              label={t('OnSemandPrinting.printedOnPLCCommands', '依据PLC命令选择打印图')}
              sx={{ pr: '30px' }}
            />
            <FormControlLabel
              value="imageRotation"
              control={<Radio sx={{ ...defSX.radio }} />}
              label={t('OnSemandPrinting.imageRotation', '图像旋转')}
            />
          </Box>
          <FormControlLabel
            value="fastMasking"
            control={<Radio sx={{ ...defSX.radio }} />}
            label={t('OnSemandPrinting.fastMasking', 'Fast masking')}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

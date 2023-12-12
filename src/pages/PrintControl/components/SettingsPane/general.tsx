import React, { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import ContentCard from '@/components/ContentCard';

import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
export interface Props extends HTMLProps<HTMLElement> {}

const defSX = {
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
};
const options = ['公制'];
export default function PrintGeneral(props: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    externalControl: true,
    addJobInfor: false,
    RIPDirect: false,
    RIPAhead: false,
    ScreenDirect: false,
    unit: options[0],
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { externalControl, addJobInfor, RIPDirect, RIPAhead, ScreenDirect, unit } = state;
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box>
        <FormControl sx={{ m: 3, marginBottom: 0 }} component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={externalControl} onChange={handleChange} name="externalControl" />}
              label={t('printControl.setting.externalControl', '启用外部控制')}
              sx={defSX.checkbox}
            />
            <FormControlLabel
              control={<Checkbox checked={addJobInfor} onChange={handleChange} name="addJobInfor" />}
              label={t('printControl.setting.addJobInfor', '添加作业信息页面')}
              sx={defSX.checkbox}
            />
          </FormGroup>
        </FormControl>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel
            component="legend"
            sx={{
              mb: '10px',
              fontWeight: 700,
              color: '#515152!important',
              marginRight: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {t('printControl.setting.setPrintMode', '设置打印模式')}
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={RIPDirect} onChange={handleChange} name="RIPDirect" />}
              label={t('printControl.setting.RIPDirect', 'RIP Direct')}
              sx={defSX.checkbox}
            />
            <FormControlLabel
              control={<Checkbox checked={RIPAhead} onChange={handleChange} name="RIPAhead" />}
              label={t('printControl.setting.RIPAhead', 'RIP Ahead')}
              sx={defSX.checkbox}
            />
            <FormControlLabel
              control={<Checkbox checked={ScreenDirect} onChange={handleChange} name="ScreenDirect" />}
              label={t('printControl.setting.ScreenDirect', 'Screen Direct')}
              sx={defSX.checkbox}
            />
          </FormGroup>
        </FormControl>

        <Grid item sm={5} className="flex items-center justify-start" sx={{ marginLeft: '24px' }}>
          <Typography sx={{ fontWeight: 700, color: '#515152', marginRight: '12px', whiteSpace: 'nowrap' }}>
            {t('printControl.setting.unit', '单位')}:
          </Typography>
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              value={unit}
              options={options}
              sx={{
                width: '100%',
                '.MuiOutlinedInput-root': {
                  p: '0 80px 0 9px!important',
                  '.MuiAutocomplete-endAdornment': { top: 'calc(50% - 11px)' },
                },
                label: { top: '-8px' },
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </Grid>
      </Box>
    </ContentCard>
  );
}

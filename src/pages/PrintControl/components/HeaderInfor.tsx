import React, { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCard from '@/components/CustomCard';

import { Slider, Grid, Box, Typography, FormControl, Autocomplete, TextField, Button } from '@mui/material';
import { Search } from '@mui/icons-material';

export interface Props extends HTMLProps<ReactDOM> {
  // eslint-disable-next-line no-unused-vars
  className: string;
}
const defSX = {
  formItem: { marginRight: '12px' },
  label: { fontWeight: 700, color: '#515152', marginRight: '12px', whiteSpace: 'nowrap' },
  inputBox: { width: '100%' },
  input: { '& input': { padding: '7px 14px' }, '& label': { top: '-8px' } },
};
const options = ['Option 1', 'Option 2'];
const HeaderInfor: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    RIPStatus: options[0],
  });
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // 在这里处理表单提交逻辑
    console.log(formData);
  };

  useEffect(() => {
    setValue(30);
  }, []);
  return (
    <CustomCard {...props} contentClassName="overflow-y-auto p4 flex flex-col items-center justify-center">
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box className="flex justify-start items-center">
            <Box className="flex items-center" sx={{ marginRight: '15px' }}>
              <Typography sx={defSX.label}>{t('printControl.jobProgress', '当前作业进度')}:</Typography>
            </Box>
            <Box sx={{ width: 120 }}>
              <Typography sx={{ textAlign: 'center', color: '#4671f5' }}>{`${value}%`}</Typography>
              <Slider
                size="medium"
                value={value}
                valueLabelDisplay="off"
                aria-labelledby="non-linear-slider"
                sx={{ colorPrimary: 'transparent', color: '#4671f5', '& .MuiSlider-thumb': { display: 'none' } }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={10} className="flex items-center" sx={{ form: { width: '100%' } }}>
          <form>
            <Box className="flex items-center justify-start">
              <Grid item sm={5} className="flex items-center justify-start" sx={defSX.formItem}>
                <Typography sx={defSX.label}>{t('printControl.jobStatus', '作业状态')}:</Typography>
                <FormControl sx={defSX.inputBox}>
                  <TextField name="name" value={formData.name} onChange={handleChange} sx={defSX.input} />
                </FormControl>
              </Grid>
              <Grid item sm={5} className="flex items-center justify-start" sx={defSX.formItem}>
                <Typography sx={defSX.label}>{t('printControl.jobName', '作业名称')}:</Typography>
                <FormControl sx={defSX.inputBox}>
                  <TextField name="name" value={formData.name} onChange={handleChange} sx={defSX.input} />
                </FormControl>
              </Grid>
              <Grid item sm={5} className="flex items-center justify-start" sx={defSX.formItem}>
                <Typography sx={defSX.label}>{t('printControl.OPCUAstatus', 'OPC UA状态')}:</Typography>
                <FormControl sx={defSX.inputBox}>
                  <TextField name="name" value={formData.name} onChange={handleChange} sx={defSX.input} />
                </FormControl>
              </Grid>
              <Grid item sm={5} className="flex items-center justify-start" sx={defSX.formItem}>
                <Typography sx={defSX.label}>{t('printControl.printMode', '打印模式')}:</Typography>
                <FormControl sx={defSX.inputBox}>
                  <TextField name="name" value={formData.name} onChange={handleChange} sx={defSX.input} />
                </FormControl>
              </Grid>
              <Grid item sm={5} className="flex items-center justify-start" sx={defSX.formItem}>
                <Typography sx={defSX.label}>{t('printControl.RIPServiceStatus', 'RIP服务器状态')}:</Typography>
                <FormControl sx={defSX.inputBox}>
                  <Autocomplete
                    value={formData.RIPStatus}
                    options={options}
                    sx={{
                      width: '100%',
                      '.MuiOutlinedInput-root': {
                        padding: '0 9px',
                        '.MuiAutocomplete-endAdornment': { top: 'calc(50% - 11px)' },
                      },
                      label: { top: '2px' },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={t('printControl.catRIPServiceStatus', '查看RIP服务器状态')} />
                    )}
                  />
                </FormControl>
              </Grid>
              <Button
                variant="contained"
                aria-label={t('printControl.search', '搜索')}
                sx={{ padding: '6px', minWidth: 'initial' }}
                onClick={handleSubmit}
              >
                <Search />
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </CustomCard>
  );
};
export default HeaderInfor;

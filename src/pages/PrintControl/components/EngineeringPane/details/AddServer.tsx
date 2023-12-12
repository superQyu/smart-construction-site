import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

import SubCard from '@/components/ContentCard/SubCard';
import AntdInput from '@/components/CustomComponents/CusInput';

export interface Props extends HTMLProps<HTMLElement> {}

interface StateType {
  RIPServerPath: string;
  port: number;
  ink: CheckInkType;
}
interface CheckInkType {
  [key: string]: boolean;
}
interface InkType {
  [key: string]: string;
}
const defSX = {
  box: { mb: '24px', pl: '8px', '.small-wrapper': { height: '24px!important' } },
  subTitle: { fontWeight: 700, textAlign: 'center' },
  subCard: {
    marginBottom: '8px',
    div: { justifyContent: 'center' },
    svg: { marginRight: '8px' },
    '.content': { padding: '0 19px' },
    '.content-input': { padding: '0 19px', height: '170px', 'div.MuiBox-root': { padding: 0 } },
  },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 700 }, svg: { fill: '#648aff' } },
};
//  介质详情
export default function ServerDetail({}: Props) {
  const { t } = useTranslation();
  const [ink, setInk] = useState<InkType[]>([
    {
      label: t('genericName.color.black', '黑色'),
      colorVal: '#000000',
      key: 'black',
    },
    {
      label: t('genericName.color.cyan', '青色'),
      colorVal: '#2ffbf4',
      key: 'cyan',
    },
    {
      label: t('genericName.color.magenta', '品红'),
      colorVal: '#fd24fa',
      key: 'magenta',
    },
    {
      label: t('genericName.color.yellow', '黄色'),
      colorVal: '#fbf312',
      key: 'yellow',
    },
  ]);

  const [state, setState] = useState<StateType>({
    RIPServerPath: '\\\\127.0.0.1SPCHD',
    port: 0,
    ink: {
      black: true,
      cyan: true,
      magenta: true,
      yellow: true,
    },
  });

  const handleChange = (key: string, val: boolean) => {
    setState({
      ...state,
      ink: {
        ...state.ink,
        [key]: val,
      },
    });
  };
  useEffect(() => {
    setState({
      RIPServerPath: '\\\\127.0.0.1SPCHD',
      port: 0,
      ink: {
        black: true,
        cyan: true,
        magenta: true,
        yellow: true,
      },
    });
    if (!ink) setInk([]);
  }, []);
  const handleInputChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
  };

  const { RIPServerPath, port } = state;
  return (
    <Box className="h-full" sx={{ width: '640px', margin: ' 0 90px' }}>
      <Box sx={{ ...defSX.box }}>
        <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
          {t('printControl.server.RIPServerPath', 'RIP服务器路径')}
        </Typography>
        <AntdInput size="small" value={RIPServerPath} onChange={(val) => handleInputChange('RIPServerPath', val)} />
      </Box>

      <Box sx={{ ...defSX.box, width: '190px' }}>
        <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
          {t('printControl.server.port', '端口号')}
        </Typography>
        <AntdInput size="small" value={port} onChange={(val) => handleInputChange('port', val)} />
      </Box>
      <Box>
        <Grid
          item
          className="flex"
          sx={{
            '.MuiGrid-root': { paddingBottom: '3px' },
            '& > :not(style)': { paddingLeft: '8px', paddingRight: '8px' },
          }}
          container
        >
          <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.server.ink', '墨水')}
                </Typography>
              )}
            >
              <Box sx={{ padding: '15px 25px' }}>
                <FormGroup>
                  {ink.map(({ key, label, colorVal }, index: number) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={state.ink[key]}
                          onChange={(event) => handleChange(key, event.target.checked)}
                          name={label}
                        />
                      }
                      className="flex"
                      label={
                        <>
                          {label}
                          <Typography
                            sx={{
                              display: 'inline-block',
                              width: '23px',
                              height: '15px',
                              borderRadius: '15px',
                              bgcolor: colorVal,
                              verticalAlign: 'middle',
                              ml: '23px',
                            }}
                          ></Typography>
                        </>
                      }
                      sx={defSX.checkbox}
                    />
                  ))}
                </FormGroup>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

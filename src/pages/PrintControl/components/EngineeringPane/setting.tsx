import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import ContentCard from '@/components/ContentCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useSnackbar } from '@/context/SnackbarContext';

import AntdInput from '@/components/CustomComponents/CusInput';
import Counter from '@/components/Counter';

export interface Props extends HTMLProps<HTMLElement> {}
interface State {
  [key: string]: string | number;
}
interface CheckState {
  [key: string]: boolean;
}
const defSX = {
  box: { mt: '18px' },
  subTitle: { fontWeight: 700, textAlign: 'center' },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
};
export default function SmartMedium(props: Props) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    waiting: '等待队列文件夹路径',
    print: '打印队列文件夹路径',
    completed: '已完成队列文件夹路径',
    node: 'XXXXX',
    completedJobSaveDay: 7,
    logSaveDay: 7,
  });
  const [checkState, setCheckState] = useState<CheckState>({
    allowSubJob: true,
    enableOPCUAServer: true,
    allowUnembeddedFonts: true,
    allowExtendedLogging: true,
    clearFinishedJob: true,
  });

  const handleInputChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
  };
  const handleClick = (key: string, value?: string | number) => {
    showSnackbar({ message: `[${key}]::${value ?? ''}`, severity: 'info' });
  };
  const handleValueChange = (newValue: any) => {
    console.log('Counter value:', newValue);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckState({
      ...checkState,
      [event.target.name]: event.target.checked,
    });
  };
  useEffect(() => {}, []);
  const { waiting, print, completed, node, completedJobSaveDay, logSaveDay } = state;
  const { allowSubJob, enableOPCUAServer, allowUnembeddedFonts, allowExtendedLogging, clearFinishedJob } = checkState;
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="overflow-y-auto" sx={{ padding: '2px 20px 1px 20px', marginTop: '29px' }}>
        <Box sx={{ ...defSX.box }}>
          <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
            {t('printControl.engineeringPane.waitingQueueFolder', '等待队列文件夹')}
          </Typography>
          <AntdInput
            size="small"
            value={waiting}
            onChange={(val) => handleInputChange('waiting', val)}
            buttonText={<MoreHorizIcon />}
            disabled
            onButtonClick={() => {
              handleClick('waiting', waiting);
            }}
          />
        </Box>
        <Box sx={{ ...defSX.box }}>
          <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
            {t('printControl.engineeringPane.printQueueFolder', '打印队列文件夹')}
          </Typography>
          <AntdInput
            size="small"
            value={print}
            onChange={(val) => handleInputChange('print', val)}
            buttonText={<MoreHorizIcon />}
            disabled
            onButtonClick={() => {
              handleClick('print', print);
            }}
          />
        </Box>
        <Box sx={{ ...defSX.box }}>
          <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
            {t('printControl.engineeringPane.completedQueueFolder', '已完成队列文件夹')}
          </Typography>
          <AntdInput
            size="small"
            value={completed}
            onChange={(val) => handleInputChange('completed', val)}
            buttonText={<MoreHorizIcon />}
            disabled
            onButtonClick={() => {
              handleClick('completed', completed);
            }}
          />
        </Box>
        <Box>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            className="flex"
            sx={{
              flexWrap: 'nowrap',
            }}
            container
          >
            <Grid item xs={12} sm={6} md={8} className="sm:max-h100% max-h100% h-full pb2">
              <Box sx={{ ...defSX.box, width: '80%' }}>
                <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                  {t('printControl.engineeringPane.OPCUAnode', 'OPC UA节点')}
                </Typography>
                <AntdInput size="small" value={node} onChange={(val) => handleInputChange('node', val)} disabled />
              </Box>
              <Box sx={defSX.box}>
                <Typography sx={defSX.itemTitle}>
                  {t('printControl.engineeringPane.completedJobSaveDay', '已完成的作业保留期')}
                </Typography>
                <Counter
                  initialValue={completedJobSaveDay as number}
                  step={1}
                  format={(value) => `${value} 天`}
                  onValueChange={handleValueChange}
                />
              </Box>
              <Box sx={{ ...defSX.box }}>
                <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                  {t('printControl.engineeringPane.logSaveDay', '日志文件保留期')}
                </Typography>
                <Counter
                  initialValue={logSaveDay as number}
                  step={1}
                  format={(value) => `${value} 天`}
                  onValueChange={handleValueChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full pb2">
              <Box sx={{ mt: '20px','label':{mb:'5px'} }}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={allowSubJob} onChange={handleChange} name="allowSubJob" />}
                    label={t('printControl.engineeringPane.allowSubJob', '允许直接提交作业')}
                    sx={defSX.checkbox}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={enableOPCUAServer} onChange={handleChange} name="enableOPCUAServer" />}
                    label={t('printControl.engineeringPane.enableOPCUAServer', '启用OPC UA服务器')}
                    sx={defSX.checkbox}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={allowUnembeddedFonts} onChange={handleChange} name="allowUnembeddedFonts" />
                    }
                    label={t('printControl.engineeringPane.allowUnembeddedFonts', '允许非嵌入字体')}
                    sx={defSX.checkbox}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={allowExtendedLogging} onChange={handleChange} name="allowExtendedLogging" />
                    }
                    label={t('printControl.engineeringPane.allowExtendedLogging', '允许扩展日志记录')}
                    sx={defSX.checkbox}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={clearFinishedJob} onChange={handleChange} name="clearFinishedJob" />}
                    label={t('printControl.engineeringPane.clearFinishedJob', '清理已完成的作业')}
                    sx={defSX.checkbox}
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ContentCard>
  );
}

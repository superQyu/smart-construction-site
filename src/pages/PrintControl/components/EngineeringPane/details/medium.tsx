import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AntdInput from '@/components/CustomComponents/CusInput';
import ErrorIcon from '@mui/icons-material/Error';
import LabelText from '@/components/LabelText';
import SubCard from '@/components/ContentCard/SubCard';

export interface Props extends HTMLProps<HTMLElement> {
  params: {
    name: string;
  };
}

const defSX = {
  box: {
    mb: '24px',
    pl: '8px',
    h6: {
      fontWeight: '700',
      minWidth: '80px',
      textAlign: 'right',
    },
  },
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' },
  formControl: { m: 1, minWidth: 120, margin: 0, width: '100%' },
  subCard: {
    marginBottom: '8px',
    div: { justifyContent: 'center' },
    '.content': { padding: '0 19px' },
    '.content-input': { padding: '0 19px', height: '170px', 'div.MuiBox-root': { padding: 0 } },
  },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 700 }, svg: { fill: '#648aff' } },
};

interface StateTypeItem {
  name: string;
  key: string;
  status?: number;
  value?: boolean;
  options?: [{ label: string; value: string }];
  type?: string;
}
interface StateType {
  name: string;
  describe: string;
  totalArea: string;
  width: number;
  status?: number;
  outputConfigurationFile: string;
  printBarGroup: string;
  message: string;
  enableColorManagement: boolean;
  [key: string]: any;
}
export default function MediumDetail({ params }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<StateType>({
    name: '',
    describe: '',
    totalArea: '',
    width: 0,
    outputConfigurationFile: '',
    printBarGroup: '',
    status: 1,
    message: '',
    enableColorManagement: true,
    docControl: { colorOverlayPDF: false, keepblack: false, keepTextInBlack: true, colorGrayAsCMYK: true },
    outputRenderingMethod: { mainWay: '0', cover: '0', CMYKImage: '0', RGBImage: '0' },
    inputConfigurationFile: { RGBConfigurationFile: '', CMYKConfigurationFile: '' },
    outputConfigurationFileSettings: { printerConfigurationFile: '', simulateAnotherPrinter: false },
  });

  const [docControlList] = useState<StateTypeItem[]>([
    { name: '覆盖PDF中的颜色管理', key: 'colorOverlayPDF', value: false },
    { name: '保留100%黑色', key: 'keepblack', value: false },
    { name: '将文本保留为黑色', key: 'keepTextInBlack', value: true },
    { name: '颜色管理灰色作为CMYK', key: 'colorGrayAsCMYK', value: true },
  ]);
  const [outputRenderingMethodList] = useState<StateTypeItem[]>([
    {
      name: t('genericName.mainWay', '主要方式'),
      key: 'mainWay',
      options: [{ label: t('genericName.setting.relativeColorimetricMethod', '相对比色法'), value: '0' }],
    },
    { name: t('genericName.cover', '覆盖'), key: 'cover' },
    {
      name: t('genericName.CMYKImage', 'CMYK图像'),
      key: 'CMYKImage',
      options: [{ label: t('genericName.setting.relativeColorimetricMethod', '相对比色法'), value: '0' }],
    },
    {
      name: t('genericName.RGBImage', 'RGB图像'),
      key: 'RGBImage',
      options: [{ label: t('genericName.setting.perceptualRendering', '感知渲染'), value: '0' }],
    },
  ]);
  const [inputConfigurationFileList] = useState<StateTypeItem[]>([
    { name: t('genericName.RGBConfigurationFile', 'RGB配置文件'), key: 'RGBConfigurationFile' },
    { name: t('genericName.CMYKConfigurationFile', 'CMYK配置文件'), key: 'CMYKConfigurationFile' },
  ]);
  const [outputConfigurationFileList] = useState<StateTypeItem[]>([
    { name: t('genericName.printerConfigurationFile', '打印机配置文件'), key: 'printerConfigurationFile' },
    { name: t('genericName.simulateAnotherPrinter', '模拟另一台打印机'), key: 'CMYKConfigurationFile', type: 'check' },
  ]);
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  const handleChange = (mainKey: string, key: string, val: any) => {
    setState({ ...state, [mainKey]: { ...state[mainKey], [key]: val } });
  };
  const handleClick = (key: string, value?: string | number) => {
    showSnackbar({ message: `[${key}]::${value ?? ''}`, severity: 'info' });
  };
  useEffect(() => {
    setState({
      name: params.name,
      describe: params.name,
      totalArea: '总覆盖面积XXXXXX',
      width: 254,
      outputConfigurationFile: '输出配置文件XXXXXx',
      printBarGroup: 'Black，Cyan，Magenta，Yellow (A) 3drop_pearl_example 2bpp 1200*1200dpi',
      message: '提示信息XXXXXX',
      enableColorManagement: true,
      docControl: { colorOverlayPDF: false, keepblack: false, keepTextInBlack: true, colorGrayAsCMYK: true },
      outputRenderingMethod: { mainWay: '0', cover: '0', CMYKImage: '0', RGBImage: '0' },
      inputConfigurationFile: { RGBConfigurationFile: 'sRGB_IEC61966-2-1_withBPC', CMYKConfigurationFile: 'ISOCoated' },
      outputConfigurationFileSettings: {
        printerConfigurationFile: 'ECI_uSWebCoatedSWOPC',
        CMYKConfigurationFile: false,
      },
    });
  }, []);
  return (
    <Box className="h-full" sx={{ width: '640px', margin: ' 0 90px' }}>
      <Box sx={{ ...defSX.box }}>
        <LabelText label={t('printControl.medium.describe', '介质描述') + '：'} text={state.describe} />
      </Box>
      <Box sx={{ ...defSX.box }}>
        <LabelText label={t('printControl.medium.totalArea', '总覆盖面积') + '：'} text={state.totalArea} />
      </Box>
      <Box sx={{ ...defSX.box }}>
        <LabelText
          label={t('printControl.smartMediumDetail.outputConfigurationFile', '输出配置文件') + '：'}
          text={state.outputConfigurationFile}
        />
      </Box>
      <Box sx={{ ...defSX.box }}>
        <LabelText label={t('printControl.medium.printBarGroup', '打印条组') + '：'} text={state.printBarGroup} />
      </Box>
      <Accordion
        expanded={expanded}
        sx={{
          m: '0!important',
          border: 'none',
          boxShadow: 'none',
          '&::before': { height: '0' },
          '.Mui-expanded': { m: '0!important', minHeight: 'inherit!important' },
        }}
      >
        <AccordionSummary
          sx={{
            '$ .MuiAccordionSummary-content': {
              display: 'none',
            },
          }}
        >
          <Box sx={{ padding: '0 30px' }}>
            <Button
              sx={{ padding: '3px 16px', mr: '20px', backgroundColor: '#4671f5' }}
              variant="contained"
              color="primary"
            >
              {t('genericName.overlayColorOptions', '覆盖颜色选项')}
            </Button>
            <Button sx={{ padding: '3px 16px' }} variant="outlined" onClick={handleExpand}>
              {expanded ? t('genericName.retract', '收起') : t('genericName.expand', '展开')}
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="flex" sx={{ ...defSX.box, mb: '0px', pl: '8px' }}>
            <LabelText label={t('printControl.medium.name', '介质名称') + '：'} text={state.name} />
            <LabelText label={t('printControl.medium.describe', '介质描述') + '：'} text={state.describe} />
          </Box>
          <Box sx={{ padding: '0 30px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.enableColorManagement}
                  onChange={(e) => setState({ ...state, enableColorManagement: e.target.checked })}
                  name="enableCompression"
                />
              }
              label={t('printControl.setting.enableColorManagement', '启用颜色管理')}
              sx={{ ...defSX.checkbox }}
            />
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
                      {t('printControl.smartMediumDetail.docControl', '文档控件')}
                    </Typography>
                  )}
                >
                  <Box sx={{ mt: '4px' }}>
                    {docControlList.map(({ key, name }, index: number) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={state.docControl[key]}
                            onChange={(e) => handleChange('docControl', key, e.target.checked)}
                            name={key}
                          />
                        }
                        label={t(`setting.${key}`, name)}
                        sx={{ ...defSX.checkbox }}
                      />
                    ))}
                  </Box>
                </SubCard>
              </Grid>
              <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full ">
                <SubCard
                  contentClassName="content overflow-y-auto"
                  sx={{ ...defSX.subCard }}
                  Head={() => (
                    <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                      {t('printControl.smartMediumDetail.outputRenderingMethod', '输出渲染方法')}
                    </Typography>
                  )}
                >
                  <Box sx={{ mt: '5px' }}>
                    {outputRenderingMethodList.map(({ name, key, options }, index: number) => (
                      <Box
                        className="flex"
                        sx={{ alignItems: 'center', mb: '5px', justifyContent: 'flex-start!important' }}
                        key={index}
                      >
                        <Typography sx={{ ...defSX.subTitle, mr: '10px' }}>{name}</Typography>
                        {options && (
                          <>
                            <FormControl sx={{ ...defSX.formControl }} size="small">
                              <Select
                                value={state.outputRenderingMethod[key]}
                                onChange={(e) => handleChange('outputRenderingMethod', key, e.target.value)}
                              >
                                {options.map((optionsItem, i) => (
                                  <MenuItem key={i} value={optionsItem.value}>
                                    {optionsItem.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <Tooltip title={name}>
                              <ErrorIcon
                                sx={{
                                  color: '#c7cbd8',
                                  cursor: 'pointer',
                                  marginLeft: '5px',
                                  transform: 'rotate(180deg)',
                                }}
                              />
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </SubCard>
              </Grid>
              <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
                <SubCard
                  contentClassName="content-input overflow-y-auto"
                  sx={{ ...defSX.subCard }}
                  Head={() => (
                    <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                      {t('printControl.smartMediumDetail.inputConfigurationFile', '输入配置文件')}
                    </Typography>
                  )}
                >
                  <Box sx={{ margin: '13px 0' }}>
                    {inputConfigurationFileList.map(({ key }, index: number) => (
                      <Box sx={{ mb: '13px' }} key={index}>
                        <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                          {t('printControl.engineeringPane.waitingQueueFolder', '等待队列文件夹')}
                        </Typography>
                        <AntdInput
                          value={state.inputConfigurationFile[key]}
                          onChange={(val) => handleChange('inputConfigurationFile', key, val)}
                          buttonText={<MoreHorizIcon />}
                          disabled
                          onButtonClick={() => {
                            handleClick('inputConfigurationFile', `${key}`);
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </SubCard>
              </Grid>
              <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full ">
                <SubCard
                  contentClassName="content-input overflow-y-auto"
                  sx={{ ...defSX.subCard }}
                  Head={() => (
                    <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                      {t('printControl.smartMediumDetail.outputConfigurationFile', '输出配置文件')}
                    </Typography>
                  )}
                >
                  <Box sx={{ margin: '13px 0' }}>
                    {outputConfigurationFileList.map(({ name, key, type }, index: number) => (
                      <Box key={index} sx={{ mb: '17px' }}>
                        {type ? (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={!!state.outputConfigurationFileSettings[key]}
                                onChange={(e) => handleChange('outputConfigurationFileSettings', key, e.target.checked)}
                                name={key}
                              />
                            }
                            label={t(`setting.${key}`, name)}
                            sx={{ ...defSX.checkbox }}
                          />
                        ) : (
                          <>
                            <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                              {name}
                            </Typography>
                            <AntdInput
                              value={state.outputConfigurationFileSettings[key]}
                              onChange={(val) => handleChange('outputConfigurationFileSettings', key, val)}
                              buttonText={<MoreHorizIcon />}
                              disabled
                              onButtonClick={() => {
                                handleClick('outputConfigurationFileSettings', `${key}`);
                              }}
                            />
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </SubCard>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

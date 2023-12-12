import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

import SubCard from '@/components/ContentCard/SubCard';
import LabelText from '@/components/LabelText';
import Counter from '@/components/Counter';
import AntdInput from '@/components/CustomComponents/CusInput';

export interface Props extends HTMLProps<HTMLElement> {
  params: {
    name: string;
  };
}

interface StateTypeItem {
  name: string;
  status?: number;
  value?: string;
}

interface StateType {
  planNumber: string;
  horizontalZoom: number;
  verticalZoom: number;
  docControl: StateTypeItem[];
  outputRenderingMethod: StateTypeItem[];
  inputConfigurationFile: StateTypeItem[];
  outputConfigurationFile: StateTypeItem[];
}

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center' },
  subCard: {
    marginBottom: '8px',
    div: { justifyContent: 'center', padding: '15px 5px' },
    svg: { marginRight: '8px' },
    '.content': { padding: '0 19px' },
    '.content-input': { padding: '0 19px', height: '170px', 'div.MuiBox-root': { padding: 0 } },
  },
};
//  打印详情
export default function PrintColumnDetail({ params }: Props) {
  const { t } = useTranslation();

  const [state, setState] = useState<StateType>({
    planNumber: '',
    horizontalZoom: 100,
    verticalZoom: 100,
    docControl: [],
    outputRenderingMethod: [],
    inputConfigurationFile: [],
    outputConfigurationFile: [],
  });

  const handleValueChange = (newValue: any) => {
    console.log('Counter value:', newValue);
  };

  useEffect(() => {
    setState({
      planNumber: params.name,
      horizontalZoom: 110,
      verticalZoom: 105,
      docControl: [
        { name: '覆盖PDF中的颜色管理', status: 1 },
        { name: '保留100%黑色', status: 1 },
        { name: '将文本保留为黑色', status: 0 },
        { name: '颜色管理灰色作为CMYK', status: 0 },
      ],
      outputRenderingMethod: [
        { name: t('genericName.mainWay', '主要方式'), value: '相对比色法' },
        { name: t('genericName.cover', '覆盖'), value: '' },
        { name: t('genericName.CMYKImage', 'CMYK图像'), value: '相对比色法' },
        { name: t('genericName.RGBImage', 'RGB图像'), value: '感知渲染' },
      ],
      inputConfigurationFile: [
        { name: t('genericName.RGBConfigurationFile', 'RGB配置文件'), value: 'sRGB_IEC61966-2-1_withBPC' },
        { name: t('genericName.CMYKConfigurationFile', 'CMYK配置文件'), value: 'ISOCoated' },
      ],
      outputConfigurationFile: [
        { name: t('genericName.printerConfigurationFile', '打印机配置文件'), value: 'ECI_uSWebCoatedSWOP' },
        { name: t('genericName.simulateAnotherPrinter', '模拟另一台打印机'), status: 1 },
      ],
    });
  }, []);
  return (
    <Box className="h-full" sx={{ width: '640px', margin: ' 0 90px' }}>
      <Box sx={{ mb: '16px', pl: '8px' }}>
        <LabelText label={t('printControl.setting.planNumber', '平面编号') + '：'} text={state.planNumber} />
      </Box>
      <Box sx={{ mb: '16px', pl: '8px', '.counter-text': { width: '94px' } }}>
        <Counter
          initialValue={state.horizontalZoom}
          step={1}
          format={(value) => `${value} %`}
          minValue={0}
          maxValue={200}
          onValueChange={handleValueChange}
          prelabel={t('genericName.zoom.horizontal', '水平缩放') + '：'}
        />
      </Box>
      <Box sx={{ mb: '16px', pl: '8px', '.counter-text': { width: '94px' } }}>
        <Counter
          initialValue={state.verticalZoom}
          step={1}
          format={(value) => `${value} %`}
          minValue={0}
          maxValue={200}
          onValueChange={handleValueChange}
          prelabel={t('genericName.zoom.vertical', '垂直缩放') + '：'}
        />{' '}
      </Box>
      <Box sx={{ height: 'calc(100% - 48px)' }}>
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
              <Box>
                {state.docControl.map((item, index: number) => (
                  <Typography key={index} className="flex" sx={{ ...defSX.subTitle, mb: '15px' }}>
                    {item.status ? <CloseIcon sx={{ color: '#ff1a1a' }} /> : <CheckIcon sx={{ color: '#2ebd42' }} />}
                    {item.name}
                  </Typography>
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
              <Box>
                {state.outputRenderingMethod.map((item, index: number) => (
                  <Typography key={index} className="flex" sx={{ ...defSX.subTitle, mb: '15px' }}>
                    {item.name}
                    {item.value && `: ${item.value}`}
                    {item.value && (
                      <Tooltip title={item.value}>
                        <ErrorIcon
                          className=""
                          sx={{ color: '#c7cbd8', cursor: 'pointer', marginLeft: '5px', transform: 'rotate(180deg)' }}
                        />
                      </Tooltip>
                    )}
                  </Typography>
                ))}
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={6} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content-input overflow-y-auto"
              //    div: { padding: '0px' }
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle, color: '#fff' }}>
                  {t('printControl.smartMediumDetail.inputConfigurationFile', '输入配置文件')}
                </Typography>
              )}
            >
              <Box sx={{ margin: '13px 0' }}>
                {state.inputConfigurationFile.map((item, index: number) => (
                  <Box key={index} sx={{ mb: '17px' }}>
                    <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                      {item.name}
                    </Typography>
                    <AntdInput value={item?.value || ''} disabled placeholder="请输入内容" />
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
                {state.outputConfigurationFile.map((item, index: number) => (
                  <Box key={index} sx={{ mb: '17px' }}>
                    {item.hasOwnProperty('status') ? (
                      <Typography key={index} className="flex" sx={{ ...defSX.subTitle, mb: '15px' }}>
                        {item.status ? (
                          <CloseIcon sx={{ color: '#ff1a1a' }} />
                        ) : (
                          <CheckIcon sx={{ color: '#2ebd42' }} />
                        )}
                        {item.name}
                      </Typography>
                    ) : (
                      <>
                        <Typography className="flex" sx={{ ...defSX.subTitle, mb: '13px' }}>
                          {item.name}
                        </Typography>
                        <AntdInput value={item?.value || ''} disabled placeholder="请输入内容" />
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

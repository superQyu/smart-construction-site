import { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography } from '@mui/material';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import ContentCard from '@/components/ContentCard';

import { useSnackbar } from '@/context/SnackbarContext';

export interface Props extends HTMLProps<HTMLElement> {}

interface State {
  [key: string]: string | number | boolean;
}

const defSX = {
  box: { mt: '18px', padding: '0 45px ' },
  subTitle: { fontWeight: 700, textAlign: 'center' },
  formItem: { label: { justifyContent: 'flex-end' } },
};
export default function SmartMedium(props: Props) {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [state, setState] = useState<State>({});

  const [initForm] = useState<formItemProps[]>([
    {
      label: t('genericName.fileName', '文件名称'),
      itemkey: 'fileName',
      value: 'Default',
      style: { ...defSX.formItem },
    },
    {
      label: `${t('genericName.manufacturer', '制造商')}( ${t('genericName.optional', '选填')} )`,
      itemkey: 'manufacturer',
      value: 'Default',
      style: { ...defSX.formItem },
    },
    {
      label: `${t('genericName.printer.model', '型号')}( ${t('genericName.printerModel', '选填')} )`,
      itemkey: 'printerModel',
      value: 'Default',
      style: { ...defSX.formItem },
    },
    {
      label: t('genericName.simplexDuplex', '单工/双工选项'),
      type: 'select',
      itemkey: 'simplexDuplex',
      value: '0',
      options: [
        { label: t('genericName.printer.simplex', '单工'), value: 0 },
        { label: t('genericName.printer.duplex', '双工'), value: 1 },
      ],
      style: { ...defSX.formItem },
    },
    {
      label: t('genericName.clorSupport', '颜色支持选项'),
      type: 'select',
      itemkey: 'clorSupport',
      value: '0',
      options: [
        { label: t('genericName.printer.monochrome', '单色'), value: 0 },
        { label: t('genericName.printer.colour', '彩色'), value: 1 },
      ],
      style: { ...defSX.formItem },
    },
    {
      label: t('genericName.offlineMode', '离线模式选项'),
      type: 'select',
      itemkey: 'offlineMode',
      value: '0',
      options: [
        { label: t('genericName.printer.support', '支持'), value: 0 },
        { label: t('genericName.printer.unsupport', '不支持'), value: 1 },
      ],
      style: { ...defSX.formItem },
    },
    {
      label: t('genericName.directQI', 'Direct QI选项'),
      type: 'select',
      itemkey: 'offlineMode',
      value: '0',
      options: [
        { label: t('genericName.printer.support', '支持'), value: 0 },
        { label: t('genericName.printer.unsupport', '不支持'), value: 1 },
      ],
      style: { ...defSX.formItem },
    },
    {
      label: t('genericName.printerType', '打印机类型'),
      type: 'select',
      itemkey: 'barChart',
      value: '0',
      options: [
        { label: t('genericName.printer.inkjet', '喷墨'), value: 0 },
        { label: t('genericName.printer.laser', '激光'), value: 1 },
      ],
      style: { ...defSX.formItem },
    },
  ]);

  const [initRightForm] = useState<formItemProps[]>([
    {
      label: t('genericName.barChart', '打印与图像水平的条形图'),
      type: 'checkbox',
      itemkey: 'barChart',
      value: true,
    },
    {
      label: t('genericName.mediumWidth', '支持的打印介质宽度（毫米）'),
      itemkey: 'mediumWidth',
      value: '254',
    },
    {
      label: t('genericName.mediumType', '打介质类型'),
      type: 'select',
      itemkey: 'mediumType',
      value: '0',
      options: [
        { label: t('genericName.printer.rollSheet', '卷张'), value: 0 },
        { label: t('genericName.printer.singleSheet', '单张'), value: 1 },
      ],
    },
    {
      label: t('genericName.printSpeedLimit', '打印速度限制（分/分钟）'),
      itemkey: 'printSpeedLimit',
      value: '0',
    },
  ]);

  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };
  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto h-full"
      Head={() => <Typography sx={defSX.subTitle}>{props.label}</Typography>}
    >
      <Box className="overflow-y-auto h-full" sx={{ padding: '25px 0 1px ' }}>
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
            <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full pb2">
              <Box sx={{ ...defSX.box }}>
                {initForm.map((item, index) => (
                  <FormItem key={index} {...item} onChange={handleChange} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className="sm:max-h100% max-h100% h-full pb2">
              <Box sx={{ ...defSX.box, '& .item__label': { minWidth: 'initial' } }}>
                {initRightForm.map((item, index) => (
                  <FormItem key={index} {...item} onChange={handleChange} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ContentCard>
  );
}

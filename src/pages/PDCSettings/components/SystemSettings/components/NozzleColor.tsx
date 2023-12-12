import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, type BoxProps, Popover } from '@mui/material';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import CusButton from '@/components/CustomComponents/CusButton';

export interface Props extends BoxProps {}
const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { '& .item__content__select': { '& div.MuiOutlinedInput-root': { width: '80px' } } },
  subTitle: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    whiteSpace: 'nowrap',
    pr: '10px',
  },
};
export default function NozzleColor({ sx, ...resProps }: Props) {
  const { t } = useTranslation();
  const [nozzleDefaultPosition, setNozzlePosition] = useState<formItemProps[]>([
    {
      label: t('nozzleColor.setting.numOfColorsPerNozzle', '每个喷头颜色数量'),
      type: 'select',
      itemkey: 'printDataBitDepth',
      showTypography: false,
      value: '1',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
    },
  ]);

  const setPdcSettingsCtx = usePdcSettingsContext()[1];
  const { config } = useMeteorConfigContext();
  const [openPopup, setOpenPopup] = useState(false);
  const anchorRef = useRef(null);
  const [nozzleChangeVal, setNozzleChangeVal] = useState<any>();

  useEffect(() => {
    if (config) {
      const planesPerHDC = config?.Planes?.PlanesPerHDC || config?.Planes?.SubSys1?.PlanesPerHDC || '1';
      setNozzlePosition((prev) => {
        prev[0].value = planesPerHDC;
        return [...prev];
      });
    }
  }, [config]);

  const handleChange = (_: string, val: any) => {
    setOpenPopup(true);
    setNozzleChangeVal(val);
  };

  const confirm = () => {
    setOpenPopup(false);
    setNozzlePosition((prev) => {
      prev[0].value = nozzleChangeVal;
      return [...prev];
    });

    setPdcSettingsCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        planesPerHDC: nozzleChangeVal,
      },
    }));
  };
  return (
    <Box
      {...resProps}
      ref={anchorRef}
      sx={{
        '& .item__label': { minWidth: 'initial' },
        '& .item__select': {
          borderRadius: 0,
          '& .MuiSelect-select': { padding: '3px 14px' },
        },
        ...sx,
      }}
    >
      {nozzleDefaultPosition.map((item, index) => (
        <Box key={index} className="flex" sx={{ ...defSX.box }}>
          <Typography sx={{ ...defSX.subTitle }}>{item.label}</Typography>
          <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
            <FormItem {...item} onChange={handleChange} />
          </Box>
        </Box>
      ))}

      <Popover
        open={openPopup}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box className="flex flex-col justify-between p2" sx={{ height: '90px' }}>
          <Typography>{t('nozzoleColor.change.warn', '喷头颜色数量改变！数据重置！')}</Typography>
          <Typography>{t('nozzoleColor.check.confirm', '确认继续吗？')}</Typography>
          <Box className="flex items-center justify-center">
            <CusButton sx={{ mr: 1 }} cType="secondary" onClick={confirm}>
              {t('common.yes', '是')}
            </CusButton>
            <CusButton onClick={() => setOpenPopup(false)}>{t('common.no', '否')}</CusButton>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}

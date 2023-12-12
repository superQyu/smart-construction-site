import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, OutlinedInput, Checkbox, FormControlLabel } from '@mui/material';
import { Shanp, Trigger } from './OperationIco';

const defSX = {
  box: { p: '10px', border: '1px solid #dee3fc', mb: '10px', alignItems: 'center' },
  image: { width: '110px', height: '110px', mr: '60px' },
  subTitle: {
    pr: '5px',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '50px',
  },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
};

export default function Operation() {
  const { t } = useTranslation();
  const [shanp, setShanp] = useState({
    count: 500,
    allNozzle: true,
  });

  const handler = (val: number) => {
    setShanp({
      ...shanp,
      count: val,
    });
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShanp({
      ...shanp,
      allNozzle: event.target.checked,
    });
  };
  return (
    <>
      <Box sx={{ width: '540px' }}>
        <Typography sx={{ fontWeight: '700', mb: '15px' }}>
          {t('menu.operation.disc1', '点击后将立即执行本节中的命令')}
        </Typography>
        <Box className="flex" sx={{ ...defSX.box }}>
          <Box className="ex-image" sx={{ ...defSX.image }}>
            <Shanp />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: '700', mb: '15px' }}>
              {t('menu.operation.disc2', '选择点火喷头及墨滴量')}
            </Typography>
            <Box className="flex items-center mt1 mr1">
              <Typography sx={{ ...defSX.subTitle }}>{t('genericName.shanpCount', '闪喷计数')}</Typography>
              <OutlinedInput
                size="small"
                value={shanp.count}
                onChange={(e) => handler(parseFloat(e.target.value || '0'))}
                inputProps={{
                  step: 1,
                  min: -99999,
                  max: 99999,
                  type: 'number',
                }}
                sx={{ borderRadius: '0', input: { p: '5px 14px' }, mr: '30px' }}
              />

              <FormControlLabel
                sx={defSX.checkbox}
                control={
                  <Checkbox checked={shanp.allNozzle} onChange={handleCheckChange} name="hotFolderAutoRefresh" />
                }
                label={t('genericName.autoRefresh', '自动刷新')}
              />
            </Box>
          </Box>
        </Box>
        <Box className="flex" sx={{ ...defSX.box }}>
          <Box className="ex-image" sx={{ ...defSX.image }}>
            <Trigger />
          </Box>
          <Typography sx={{ fontWeight: '700', mb: '15px' }}>
            {t('menu.operation.disc3', '触发一次内部PD,将会打印下一份图像')}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

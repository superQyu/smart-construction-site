import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import CustomCard from '@/components/ContentCard';
import CusButton from '@/components/CustomComponents/CusButton';
import SubCard from '@/components/ContentCard/SubCard';
export default function CostEstimate() {
  const { t } = useTranslation();

  const [waitScanList] = useState([
    {
      color: '#01ffff',
      info: 'Gradient id: 1 Coqy:1 Nozzles:0-16800',
    },
    {
      color: '#ff00fe',
      info: 'Gradient id: 2 Coqy:1 Nozzles:0-16800',
    },
    {
      color: '#ffff01',
      info: 'Gradient id: 3 Coqy:1 Nozzles:0-16800',
    },
    {
      color: '#000000',
      info: 'Gradient id: 4 Coqy:1 Nozzles:0-16800',
    },
    {
      color: '#ffa600',
      info: 'Gradient id: 5 Coqy:1 Nozzles:0-16800',
    },
  ]);

  return (
    <CustomCard
      contentClassName="flex flex-col p2 items-center overflow-y-auto"
      Head={() => (
        <Typography sx={{ fontWeight: 700 }}>{t('smartCalibration.costEstimate.title', '成本估计')}</Typography>
      )}
    >
      <Box className="flex flex-col p4 px16 items-center flex-basis-20% w-full h-full">
        <Box className="flex flex-1 w-full justify-between items-center mb4">
          <Typography>
            {t(
              'smartCalibration.costEstimate.printDescription',
              '首先，打印你的目标。目标将被生成并发送到连接的智能打印控制器。在尝试打印之前，控制器必须处于校准模式',
            )}
          </Typography>

          <CusButton>{t('smartCalibration.costEstimate.print', '打印')}</CusButton>
        </Box>

        <Box className="flex flex-1 w-full justify-between items-center">
          <Typography>
            {t(
              'smartCalibration.costEstimate.scanDescription',
              '一旦你的目标打印出来，把他们剪下来，然后扫描进去。目标包含虚线来指导切割的位置。单独扫描每个面板。',
            )}
          </Typography>
          <CusButton>{t('smartCalibration.costEstimate.scan', '扫描')}</CusButton>
        </Box>
      </Box>

      <Grid container sx={{ margin: 0, width: '100%' }} spacing={0.5} className="px4  flex-basis-100%">
        <Grid sm={6} xs={12}>
          <SubCard
            sx={{ height: '100%' }}
            contentClassName="flex flex-col items-center overflow-y-auto"
            Head={() => (
              <Typography className="w-full text-center color-white">
                {t('smartCalibration.costEstimate.waitScanList', '待扫描列表')}
              </Typography>
            )}
          >
            {waitScanList.map((item, idx: number) => (
              <Box className="flex mt2 items-center" key={idx}>
                <Box className="w-15px h-15px mr2" sx={{ backgroundColor: item.color }}></Box>
                <Typography sx={{ mr: '1rem' }}>{item.info}</Typography>
              </Box>
            ))}
          </SubCard>
        </Grid>
        <Grid sm={6} xs={12}>
          <SubCard
            sx={{ height: '100%' }}
            Head={() => (
              <Typography className="w-full text-center color-white">
                {t('smartCalibration.costEstimate.scannedList', '已扫描列表')}
              </Typography>
            )}
          ></SubCard>
        </Grid>
      </Grid>

      <Box className="flex justify-end py4 flex-basis-50px w-full">
        <CusButton>{t('smartCalibration.setting.createAndUpdate', '创建和更新SMD')}</CusButton>
      </Box>
    </CustomCard>
  );
}

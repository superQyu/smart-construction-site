import dayjs from 'dayjs';
import { BarChart } from '@mui/x-charts/BarChart';

import { useTranslation } from 'react-i18next';

const chartSetting = {};

const valueFormatter = (value: number) => `${value}`;

export default function LogStackedBarChart() {
  const { t } = useTranslation();

  const dataset = [
    {
      success: 100,
      error: 57,
      terminate: 86,
      pause: 21,
      date: new Date(Date.now() - 7000),
    },
    {
      success: 150,
      error: 52,
      terminate: 78,
      pause: 28,
      date: new Date(Date.now() - 6000),
    },
    {
      success: 147,
      error: 53,
      terminate: 106,
      pause: 41,
      date: new Date(Date.now() - 5000),
    },
    {
      success: 154,
      error: 56,
      terminate: 92,
      pause: 73,
      date: new Date(Date.now() - 4000),
    },
    {
      success: 157,
      error: 69,
      terminate: 92,
      pause: 99,
      date: new Date(Date.now() - 3000),
    },
    {
      success: 160,
      error: 63,
      terminate: 103,
      pause: 144,
      date: new Date(Date.now() - 2000),
    },
    {
      success: 159,
      error: 60,
      terminate: 105,
      pause: 29,
      date: new Date(Date.now() - 1000),
    },
  ];

  return (
    <BarChart
      dataset={dataset}
      legend={{
        direction: 'column',
        position: {
          vertical: 'middle',
          horizontal: 'right',
        },
      }}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'date',
          valueFormatter: (value) => dayjs(value).locale('zh-cn').format('MM/DD HH:mm:ss '),
        },
      ]}
      series={[
        { dataKey: 'success', label: t('logInfo.success', '成功'), valueFormatter, stack: 'a', color: '#2e7d32' },
        { dataKey: 'error', label: t('logInfo.error', '错误'), valueFormatter, stack: 'a', color: '#d32f2f' },
        { dataKey: 'terminate', label: t('logInfo.terminate', '终止'), valueFormatter, stack: 'a', color: '#ed6c02' },
        { dataKey: 'pause', label: t('logInfo.pause', '暂停'), valueFormatter, stack: 'a', color: '#0288d1' },
      ]}
      {...chartSetting}
    />
  );
}

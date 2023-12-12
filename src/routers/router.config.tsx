import type { MenuItem } from '@/types/router.type';
import BaseLayout from '@/layouts/BaseLayout.tsx';
import Digital from '@/pages/DigitalInteraction/index.tsx';

const routerTable: MenuItem[] = [
  {
    label: '首页',
    path: '/',
    filepath: 'layouts/BaseLayout.tsx',
    component: <BaseLayout />,
    isStaticLoad: true,
    redirect: '0',
    children: [
      {
        key: 'digitalInteraction',
        label: '数字交互',
        path: '/digitalInteraction',
        filepath: '/pages/DigitalInteraction/index.tsx',
        component: <Digital />,
        isStaticLoad: true,
      },
      {
        key: 'logInfo',
        label: '日志信息',
        path: '/logInfo',
        filepath: 'pages/LogInfo/index.tsx',
        component: () => import('@/pages/LogInfo/index.tsx'),
      },
      {
        key: 'printControl',
        label: '智能打印控制器',
        path: '/printControl',
        filepath: 'pages/PrintControl/index.tsx',
        component: () => import('@/pages/PrintControl/index.tsx'),
      },
      {
        key: 'pccPdcSettings',
        label: 'PDC设置',
        path: '/pccPdcSettings',
        filepath: 'pages/PDCSettings/index.tsx',
        component: () => import('@/pages/PDCSettings/index.tsx'),
      },
      {
        key: 'smartCalibration',
        label: '智能校准器',
        path: '/smartCalibration',
        filepath: 'pages/SmartCalibration/index.tsx',
        component: () => import('@/pages/SmartCalibration/index.tsx'),
      },
      // {
      //   key: 'profileEditor',
      //   label: '配置文件编辑器',
      //   path: '/profileEditor',
      //   filepath: '',
      // },
      // {
      //   key: 'mediaControl',
      //   label: '智能媒体控制器',
      //   path: '/mediaControl',
      //   filepath: '',
      // },
      {
        key: 'smartCostEstimator',
        label: '智能作业成本估算器',
        path: '/smartCostEstimator',
        filepath: 'pages/SmartCostEstimator/index.tsx',
        component: () => import('@/pages/SmartCostEstimator/index.tsx'),
      },
    ],
  },
  {
    label: 'imageEditor',
    path: '/imageEditor',
    filepath: 'pages/ImageEditor/index.tsx',
    component: () => import('@/pages/ImageEditor/index.tsx'),
  },
];

if (import.meta.env.DEV) {
  routerTable.push({
    label: 'component lib',
    path: '/dev',
    filepath: 'components/index.tsx',
    component: () => import('@/components/index.tsx'),
  });
}

export default routerTable;

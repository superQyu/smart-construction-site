import { cloneElement, useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';
import ContentCard from '@/components/ContentCard';
import CusButton from '@/components/CustomComponents/CusButton';

import DropletMixingCurve from './FeaturedPane/DropletMixingCurve';
import DropletMixingTargets from './FeaturedPane/DropletMixingTargets';
import ReadDropletMixingTargets from './FeaturedPane/ReadDropletMixingTargets';
import ViewDropletMixingTargets from './FeaturedPane/ViewDropletMixingTargets';
import PrintPointGainTarget from './FeaturedPane/PrintPointGainTarget';
import ReadPointGainTarget from './FeaturedPane/ReadPointGainTarget';
import PrintInkLimitTarget from './FeaturedPane/PrintInkLimitTarget';
import ReadInkLimitTarget from './FeaturedPane/ReadInkLimitTarget';
import PrintGrayBalanceTarget from './FeaturedPane/PrintGrayBalanceTarget';
import ReadGrayBalanceTarget from './FeaturedPane/ReadGrayBalanceTarget';
import PrintReferenceStatusTarget from './FeaturedPane/PrintReferenceStatusTarget';
import ReadReferenceStatusTarget from './FeaturedPane/ReadReferenceStatusTarget';
import ExportMediaDefinition from './FeaturedPane/ExportMediaDefinition';

interface ComponentType {
  key: string;
  label: string;
  skip?: boolean;
  compoment: JSX.Element;
}
export interface Props extends HTMLProps<HTMLElement> {}

export default function PrintBarComponents(props: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const [stepComponent] = useState<ComponentType[]>([
    {
      key: 'dropletMixingCurve',
      label: `${t('genericName.step', '步骤')}1：${t('genericName.dropletMixingCurve', '液滴混合曲线')}`,
      compoment: <DropletMixingCurve />,
    },
    {
      key: 'printDropletMixingTargets',
      label: `${t('genericName.step', '步骤')}1a：${t('genericName.printDropletMixingTargets', '打印液滴混合目标')}`,
      compoment: <DropletMixingTargets />,
    },
    {
      key: 'readDropletMixingTargets',
      label: `${t('genericName.step', '步骤')}1b：${t('genericName.readDropletMixingTargets', '读取液滴混合目标')}`,
      compoment: <ReadDropletMixingTargets />,
      skip: true,
    },
    {
      key: 'viewDropletMixingTargets',
      label: `${t('genericName.step', '步骤')}1c：${t('genericName.viewDropletMixingTargets', '查看液滴混合目标')}`,
      compoment: <ViewDropletMixingTargets />,
      skip: true,
    },
    {
      key: 'printPointGainTarget',
      label: `${t('genericName.step', '步骤')}2a：${t('genericName.printPointGainTarget', '打印点增益目标')}`,
      compoment: <PrintPointGainTarget />,
      skip: true,
    },
    {
      key: 'readPointGainTarget',
      label: `${t('genericName.step', '步骤')}2b：${t('genericName.readPointGainTarget', '读取点增益目标')}`,
      compoment: <ReadPointGainTarget />,
      skip: true,
    },
    {
      key: 'printInkLimitTarget',
      label: `${t('genericName.step', '步骤')}3a：${t('genericName.printInkLimitTarget', '打印油墨限制目标')}`,
      compoment: <PrintInkLimitTarget />,
      skip: true,
    },
    {
      key: 'readInkLimitTarget',
      label: `${t('genericName.step', '步骤')}3b：${t('genericName.readInkLimitTarget', '读取油墨限制目标')}`,
      compoment: <ReadInkLimitTarget />,
      skip: true,
    },
    {
      key: 'printGrayBalanceTarget',
      label: `${t('genericName.step', '步骤')}4a：${t('genericName.PrintGrayBalanceTarget', '打印灰平衡目标')}`,
      compoment: <PrintGrayBalanceTarget />,
      skip: true,
    },
    {
      key: 'readGrayBalanceTarget',
      label: `${t('genericName.step', '步骤')}4b：${t('genericName.readGrayBalanceTarget', '读取灰平衡目标')}`,
      compoment: <ReadGrayBalanceTarget />,
      skip: true,
    },
    {
      key: 'printReferenceStatusTarget',
      label: `${t('genericName.step', '步骤')}5a：${t('genericName.printReferenceStatusTarget', '打印参考状态目标')}`,
      compoment: <PrintReferenceStatusTarget />,
      skip: true,
    },
    {
      key: 'readReferenceStatusTarget',
      label: `${t('genericName.step', '步骤')}5b：${t('genericName.readReferenceStatusTarget', '读取参考状态目标')}`,
      compoment: <ReadReferenceStatusTarget />,
      skip: true,
    },
    {
      key: 'exportMediaDefinition',
      label: `${t('genericName.step', '步骤')}6：${t('genericName.exportMediaDefinition', '导出介质定义')}`,
      compoment: <ExportMediaDefinition />,
    },
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const handleNext = () => {
    let newSkipped = skipped;
    if (activeStep === stepComponent.length - 1) {
      showSnackbar({ message: `已经处于最后一步`, severity: 'success' });
    } else {
      if (skipped.has(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!stepComponent[activeStep].skip) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <ContentCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>{props.label}</Typography>}
    >
      <Box className="overflow-y-auto h-full" sx={{ padding: '8px 5px' }}>
        <Box sx={{ height: 'calc(100% - 35px)', p: '10px 20px 13px' }}>
          {cloneElement(stepComponent[activeStep].compoment, {
            params: {
              key: stepComponent[activeStep].key,
              label: stepComponent[activeStep].label,
            },
          })}
        </Box>
        <Box className="flex justify-end" sx={{ mt: '5px', height: '25px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {stepComponent[activeStep].skip && (
              <CusButton
                color="inherit"
                onClick={handleSkip}
                sx={{ mr: 1, backgroundColor: '#dfe0e3', color: '#4b4b4d' }}
              >
                {t('genericName.skip', '跳过')}
              </CusButton>
            )}
            <CusButton color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              {t('genericName.previousStep', '上一步')}
            </CusButton>
            <CusButton onClick={handleNext}>
              {activeStep === stepComponent.length - 1
                ? t('genericName.finish', '完成')
                : t('genericName.nextStep', '下一步')}
            </CusButton>
          </Box>
        </Box>
      </Box>
    </ContentCard>
  );
}

import { useState, useEffect } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Alert } from '@mui/material';

import LabelText from '@/components/LabelText';
import Counter from '@/components/Counter';

export interface Props extends HTMLProps<HTMLElement> {}

interface StateType {
  describe: string;
  totalArea: string;
  width: number;
  outputConfigurationFile: string;
  printBarGroup: string;
  status?: number;
  message: string;
}
const defSX = {
  box: { mb: '24px', pl: '8px' },
};
//  介质详情
export default function SmartMediumDetail({}: Props) {
  const { t } = useTranslation();

  const [state, setState] = useState<StateType>({
    describe: '',
    totalArea: '',
    width: 0,
    outputConfigurationFile: '',
    printBarGroup: '',
    status: 1,
    message: '',
  });
  useEffect(() => {
    setState({
      describe: '介质描述XXXXXX',
      totalArea: '总覆盖面积XXXXXX',
      width: 254,
      outputConfigurationFile: '输出配置文件XXXXXx',
      printBarGroup: 'Black，Cyan，Magenta，Yellow (A) 3drop_pearl_example 2bpp 1200*1200dpi',
      message: '提示信息XXXXXX',
    });
  }, []);
  const handleValueChange = (newValue: any) => {
    console.log('Counter value:', newValue);
  };
  return (
    <Box className="h-full" sx={{ width: '640px', margin: ' 0 90px' }}>
      <Box sx={{ ...defSX.box }}>
        <LabelText label={t('printControl.medium.describe', '介质描述') + '：'} text={state.describe} />
      </Box>
      <Box sx={{ ...defSX.box }}>
        <LabelText label={t('printControl.medium.totalArea', '总覆盖面积') + '：'} text={state.totalArea} />
      </Box>
      <Box sx={{ ...defSX.box, '.counter-text': { width: '94px' } }}>
        <Counter
          initialValue={state.width}
          step={1}
          format={(value) => `${value}.000mmm`}
          minValue={0}
          maxValue={200}
          onValueChange={handleValueChange}
          prelabel={t('genericName.medium.width', '介质宽度') + '：'}
        />
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
      <Alert icon={false} severity={state.status || state.status == 0 ? 'success' : 'error'}>
        提示: {state.message}
      </Alert>
    </Box>
  );
}

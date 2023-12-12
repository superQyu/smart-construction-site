import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { usePdcSettingsContext } from '@/context/PDCSettings';

export interface Props extends HTMLProps<ReactDOM> {}
export default function TestPattern() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setCheck((prev) => {
        prev[0].value = config.Application.ContinuousTestPatterns === '1';
        prev[1].value = config.Application.MergeTestPatternSubsystems === '1';
        return [...prev];
      });
    }
  }, [config]);

  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('TestPattern.printAllTasksWithSinglePD ', '用单个PD打印所有任务'),
      type: 'checkbox',
      itemkey: 'printAllWithOneProductDetect',
      value: true,
    },
    {
      label: 'print Double Sided',
      type: 'checkbox',
      itemkey: 'printDoubleSided',
      value: false,
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setCheck((prev) => {
      const idx = prev.findIndex((item) => item.itemkey === key);
      if (idx >= 0) {
        prev[idx].value = val;
      }
      return [...prev];
    });

    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          printTestPatterns: {
            ...prev.systemSetting?.printTestPatterns,
            [key]: val,
          },
        },
      };
    });
  };

  return (
    <Box>
      <Box
        className="flex"
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          '& .checkbox__item': { flexBasis: '50%', pr: '10px' },
        }}
      >
        {check.map((item, index) => (
          <Box
            className={`flex checkbox__item ord__${index}`}
            key={index}
            sx={{
              alignItems: 'center',
              '& .item__box': {
                mt: '0',
                '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
              },
            }}
          >
            <FormItem {...item} onChange={handleChange} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

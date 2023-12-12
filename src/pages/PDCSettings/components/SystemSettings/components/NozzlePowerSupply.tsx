import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';

export interface Props extends HTMLProps<ReactDOM> {}

export default function NozzlePowerSupply() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setCheck((prev) => {
        prev[0].value = config.Application.PowerOffDisabledHeads === '1';
        return [...prev];
      });
    }
  }, [config]);

  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('NozzlePowerSupply.poweDowProhibitedNozzle ', '对已禁喷头进行下电'),
      type: 'checkbox',
      itemkey: 'powerOffDisabledHeads',
      value: true,
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
          [key]: val,
        },
      };
    });
  };

  return (
    <Box
      className="flex"
      sx={{
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        '& .checkbox__item': { pl: '20px' },
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
  );
}

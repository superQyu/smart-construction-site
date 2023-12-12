import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { usePdcSettingsContext } from '@/context/PDCSettings';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';

export interface Props extends HTMLProps<ReactDOM> {}

export default function ERPServer() {
  const { t } = useTranslation();
  const { config } = useMeteorConfigContext();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useEffect(() => {
    if (config) {
      setCheck((prev) => {
        prev[0].value = config.Application.TcpCommandServerEnabled === '1';
        return prev;
      });
    }
  }, [config]);
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: t('ERPServer.acceptTCPInstructions ', '接受TCP的指令'),
      type: 'checkbox',
      itemkey: 'acceptTCPInstructions',
      value: true,
    },
  ]);
  const handleChange = (key: string, val: any) => {
    setCheck((prev) => {
      const idx = prev.findIndex((data) => data.itemkey === key);
      if (idx < 0) {
        return prev;
      }
      prev[idx].value = val;
      return prev;
    });

    setPdcSettingsCtx((prev) => ({
      ...prev,
      systemSetting: {
        ...prev.systemSetting,
        enableTcpCommandServer: val,
      },
    }));
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

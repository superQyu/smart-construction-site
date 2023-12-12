import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput } from '@mui/material';
import FormItem from '@/components/CustomComponents/FormItem';
import { TCPConfig } from '@/types';

interface State extends TCPConfig {}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: {
    width: '100%',
    '& .item__content__select': {
      '& .item__select': { borderRadius: 0, '& .MuiSelect-select': { padding: '3px 14px' } },
    },
  },
  subTip: {
    justifyContent: 'space-between',
    mb: '5px',
    '.tip-title': {},
  },
  subTitle: {
    position: 'relative',
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    i: {
      mr: '5px',
      height: '10px',
      width: '3px',
      background: '#648aff',
    },
  },
  inputBox: { borderRadius: '0', input: { p: '3px 14px' }, minWidth: 105, width: '100%' },
};
export default function TCPserverConfig() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({
    port: 5555,
    downPort: 5556,
    networkAdapter: '1',
    code: '1',
    sendJobStatus: true,
  });
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
  };
  const [networkAdapter] = useState([
    { label: `Any:0.0.0.0`, value: `1` },
    { label: `0.0.0.1`, value: `2` },
  ]);
  const [code] = useState([{ label: 'Unicode (UTF-8)', value: '1' }]);
  return (
    <Box>
      <Box sx={{ flexWrap: 'wrap', whiteSpace: 'nowrap' }}>
        <Box className="flex" sx={{ ...defSX.subTip }}>
          <Typography className="tip-title" sx={{ ...defSX.subTitle }}>
            <i />
            {t('genericName.network', '网络')}
          </Typography>
          <Typography sx={{ ...defSX.subTitle, justifyContent: 'end', color: '#648aff', cursor: 'pointer' }}>
            {t('genericName.updateNetworkAdapter', '刷新网络适配器')}
          </Typography>
        </Box>
        <Box sx={{ pl: '35px' }}>
          <Box className="flex" sx={{ ...defSX.box }}>
            <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0' } }}>
              <FormItem
                {...{
                  label: t('genericName.chooseNetworkAdapter', '选择网络适配器'),
                  type: 'select',
                  itemkey: 'networkAdapter',
                  value: state.networkAdapter,
                  options: networkAdapter,
                }}
                onChange={handleChange}
              />
            </Box>
          </Box>
          <Box className="flex">
            <Box className="flex settings__item" sx={{ alignItems: 'center' }}>
              <Typography sx={{ ...defSX.subTitle }}>{t('genericName.port', '端口号')}</Typography>
              <OutlinedInput
                size="small"
                value={state.port}
                onChange={(e) => handleChange('port', e.target.value)}
                inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
                sx={{ ...defSX.inputBox, height: '22px' }}
              />
            </Box>
            <Box className="flex settings__item" sx={{ alignItems: 'center', ml: '10px' }}>
              <Typography sx={{ ...defSX.subTitle }}>{t('genericName.downPort', '下行端口号')}</Typography>
              <OutlinedInput
                size="small"
                value={state.downPort}
                onChange={(e) => handleChange('downPort', e.target.value)}
                inputProps={{ step: 1, min: 0, max: 99999, type: 'number' }}
                sx={{ ...defSX.inputBox, height: '22px' }}
              />
            </Box>
          </Box>
        </Box>
        <Box className="flex" sx={{ ...defSX.subTip }}>
          <Typography className="tip-title" sx={{ ...defSX.subTitle }}>
            <i />
            {t('genericName.information', '信息')}
          </Typography>
        </Box>
        <Box sx={{ pl: '35px' }}>
          <Box sx={{ ...defSX.boxInner, '& .item__box': { mt: '0', '& .item__label': { minWidth: 'initial' } } }}>
            <FormItem
              {...{
                label: t('genericName.code', '编码'),
                type: 'select',
                itemkey: 'code',
                value: state.code,
                options: code,
              }}
              onChange={handleChange}
            />
          </Box>
          <Box
            className="flex checkbox__item"
            sx={{
              alignItems: 'center',
              '& .item__box': {
                mt: '0',
                '& .item__content__checkbox': { pl: '10px', '.MuiFormControlLabel-label': { fontWeight: '700' } },
              },
            }}
          >
            <FormItem
              {...{
                label: t('genericName.sendJobStatus', '发送作业状态变更'),
                type: 'checkbox',
                itemkey: 'sendJobStatus',
                value: state.sendJobStatus,
              }}
              onChange={(key, val) => handleChange(key, val as boolean)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

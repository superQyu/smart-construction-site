import { useState, useEffect } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Checkbox, RadioGroup, FormControlLabel } from '@mui/material';
import SubCard from '@/components/ContentCard/SubCard';
import Grid from '@mui/material/Unstable_Grid2';

import { checkboxItem } from '@/components/CustomComponents/CusCheckboxGroup';
import FormItem from '@/components/CustomComponents/FormItem';
import AdjustVoltageBtnGroup from './AdjustVoltageBtnGroup';
import SetSelectedNozzle from './SetSelectedNozzle';
import VoltageTable from './VoltageTable';

import { useInitHeadInfo } from '@/hooks/printer';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import { PrintHeadInfoItf } from '@/types';

export interface State {
  accordingTo: string;
  sort: string;
  colorChannelFilterate: string[];
}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  areaTitle: { mb: '5px', fontWeight: 700, minWidth: '140px', display: 'flex', alignItems: 'center' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  checkBoxArea: { pl: '80px', '& .cus__checkbox': { '& span.MuiCheckbox-root': { p: '2px 9px' } } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function SettingsPane() {
  const { t } = useTranslation();
  const setPdcSettingCtx = usePdcSettingsContext()[1];
  useInitHeadInfo(
    (data: PrintHeadInfoItf[]) => {
      setVoltageInfoTable(data);

      const newOptions = data.map((item) => ({
        label: `${t('genericName.ColorChannel', '颜色通道')}${item.planeNum} (${item.title})`,
        value: item.planeNum.toString(),
      }));
      setCheck([...check.slice(0, 5), ...newOptions]);

      setState((prev) => {
        prev.colorChannelFilterate = newOptions.map((item) => item.value);
        return { ...prev };
      });
    },
    { withVoltage: true },
  );

  const [state, setState] = useState<State>({
    accordingTo: 'pccPosition',
    sort: 'ascendingOrder',
    colorChannelFilterate: [],
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedNozzle, setSelectedNozzle] = useState(0);

  const handleCalcVoltage = (val: number) => {
    setVoltageInfoTable((prev) => {
      prev
        .filter((item) => state.colorChannelFilterate.includes(item.planeNum.toString()))
        .map((voltageInfo) => {
          voltageInfo.data?.map((item) => {
            const idx = selectedRows.findIndex((id) => id === item.id);
            if (idx >= 0) {
              item.voltages = item.voltages?.map((v) => {
                return parseFloat((v + val).toFixed(2));
              });
            }
          });
        });
      return [...prev];
    });
  };

  const [check, setCheck] = useState<checkboxItem[]>([
    {
      label: t('VoltageRegulation.setting.nozzleId', '颜色通道中的喷头索引'),
      value: 'pccPosition',
    },
    {
      label: 'PCC:HDC',
      value: 'PCC: HDC',
    },
    {
      label: t('genericName.ascendingOrder', '升序'),
      value: 'ascendingOrder',
    },
    {
      label: t('genericName.descendingOrder', '降序'),
      value: 'descendingOrder',
    },
    {
      label: t('genericName.all', '所有'),
      value: 'all',
    },
  ]);

  const [voltageInfoTable, setVoltageInfoTable] = useState<PrintHeadInfoItf[]>([]);
  const handleTableVoltageChange = (outIdx: number, inIdx: number, voltageIdx: number, val: any) => {
    setVoltageInfoTable((prev) => {
      if (prev?.[outIdx]?.data?.[inIdx]?.voltages?.[voltageIdx]) {
        prev![outIdx]!.data![inIdx]!.voltages![voltageIdx] = parseFloat(val);
      }

      return [...prev];
    });
  };

  useEffect(() => {
    if (voltageInfoTable && voltageInfoTable.length > 0) {
      setPdcSettingCtx((prev) => {
        return {
          ...prev,
          voltageAdjustment: [...voltageInfoTable],
        };
      });
    }
  }, [voltageInfoTable]);

  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
  };

  const handleSelectedAll = () => {
    if (selectedRows.length > 0) {
      setSelectedRows([]);
      return;
    }
    const selected = voltageInfoTable
      .map((voltageItem) => voltageItem?.data?.map((item) => item.id))
      .flat()
      .filter((item) => item);
    setSelectedRows([...(selected as string[])]);
  };

  const checkSelected = (id: string) => {
    const idx = selectedRows.findIndex((i) => i === id);
    return idx >= 0;
  };

  const handleSelected = (id: string) => {
    const idx = selectedRows.findIndex((i) => i === id);
    if (idx >= 0) {
      selectedRows.splice(idx, 1);
    } else {
      selectedRows.push(id);
    }
    setSelectedRows([...selectedRows]);
  };

  const handleSetSelectedNozzle = (val: string) => {
    const v = parseFloat(val);
    setSelectedNozzle(v);
    setVoltageInfoTable((prev) => {
      prev
        .filter((item) => state.colorChannelFilterate.includes(item.planeNum.toString()))
        .map((voltageInfo) => {
          voltageInfo.data?.map((item) => {
            const idx = selectedRows.findIndex((id) => id === item.id);
            if (idx >= 0) {
              item.voltages = item.voltages?.map(() => {
                return v;
              });
            }
          });
        });
      return [...prev];
    });
  };

  const handlePlaneSelectedAll = () => {
    setState((prev) => {
      prev.colorChannelFilterate =
        state.colorChannelFilterate.length > 0 ? [] : check.slice(5).map((item) => item.value as string);
      return { ...prev };
    });
  };

  const handleSelectedChange = (val: string) => {
    setState((prev) => {
      const idx = prev.colorChannelFilterate.findIndex((item) => item === val);
      if (idx >= 0) {
        prev.colorChannelFilterate.splice(idx, 1);
      } else {
        prev.colorChannelFilterate.push(val);
      }
      return { ...prev, colorChannelFilterate: [...prev.colorChannelFilterate] };
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', height: '100%', padding: '0 5px' }}>
      <Grid container spacing={0.5} className="h-full overflow-y-auto">
        <Grid xs={12} sm={4} className="h-full flex flex-col overflow-auto">
          <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
            <AdjustVoltageBtnGroup onCalcVoltage={handleCalcVoltage} />
          </SubCard>
          <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
            <SetSelectedNozzle selectedNozzle={selectedNozzle} onSelectedNozzleChange={handleSetSelectedNozzle} />
          </SubCard>
          <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
            <Box>
              <Typography sx={{ ...defSX.areaTitle }}>
                {`${t('genericName.sort', '排序')}${t('genericName.accordingTo', '依据')}`}:
              </Typography>
              <Box
                className="w-full"
                sx={{
                  '& .item__box': {
                    '& .item__content__radio': {
                      pl: '10px',
                    },
                  },
                }}
              >
                <RadioGroup
                  value={state.accordingTo}
                  onChange={(event) => handleChange('accordingTo', event.target.value)}
                >
                  {check.slice(0, 2).map((c, idx) => (
                    <FormItem {...c} key={idx} type="radio" isGroupItem={true} itemkey="accordingTo" />
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </SubCard>
          <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
            <Box>
              <Typography sx={{ ...defSX.areaTitle }}>{t('genericName.sort', '排序')}:</Typography>
              <Box
                className="w-full"
                sx={{
                  '& .item__box': {
                    '& .item__content__radio': {
                      pl: '10px',
                    },
                  },
                }}
              >
                <RadioGroup value={state.sort} onChange={(event) => handleChange('sort', event.target.value)}>
                  {check.slice(2, 4).map((c, idx) => (
                    <FormItem {...c} key={idx} type="radio" isGroupItem={true} itemkey="sort" />
                  ))}
                </RadioGroup>
              </Box>
            </Box>
          </SubCard>
          <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
            <Box>
              <Typography sx={{ ...defSX.areaTitle }}>{`${t('genericName.ColorChannel', '颜色通道')}${t(
                'genericName.filterate',
                '过滤',
              )}:`}</Typography>
              <Box className="w-full flex flex-col">
                <FormControlLabel
                  label={check[4].label}
                  control={
                    <Checkbox
                      checked={state.colorChannelFilterate.length === check.slice(5).length}
                      indeterminate={
                        state.colorChannelFilterate.length > 0 &&
                        state.colorChannelFilterate.length < check.slice(5).length
                      }
                      onChange={handlePlaneSelectedAll}
                    />
                  }
                />
                {check.slice(5).map((data, idx) => (
                  <FormControlLabel
                    key={idx}
                    label={data.label}
                    control={
                      <Checkbox
                        onChange={() => handleSelectedChange(data.value as string)}
                        checked={state.colorChannelFilterate.includes(data.value as string)}
                      />
                    }
                  />
                ))}
              </Box>
            </Box>
          </SubCard>
        </Grid>
        <Grid xs={12} sm={8} className="h-full flex flex-col">
          <VoltageTable
            voltageInfoTable={voltageInfoTable}
            selectedRows={selectedRows}
            onSelectedAll={handleSelectedAll}
            filterState={state}
            onCheckSelected={checkSelected}
            onSelectedChange={handleSelected}
            onTableVoltageChange={handleTableVoltageChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

import { useEffect, useState, useRef, MouseEvent, ChangeEvent, useMemo } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, OutlinedInput, TablePagination } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import {
  useInitPccInfo,
  useInitHeadInfo,
  usePlaneNames,
  useIsEnableMixSubsystem,
  useIsEnableIndependentPrintLane,
  setSingleHeadInfoOnPccInfo,
} from '@/hooks/printer';

import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import SubCard from '@/components/ContentCard/SubCard';
import { PrintHeadInfoItf, PrintPCCInfoData } from '@/types';
import PccColorPlaneTable from './PccColorPlaneTable';
import PccTable from './PccTable';
interface State {
  [key: string]: string | number;
}
export interface Props extends HTMLProps<ReactDOM> {}

const defSX = {
  box: { '&:not(:last-of-type)': { mb: '16px' } },
  boxInner: { width: '40%' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '30px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  itemTitle: { fontWeight: 700, textAlign: 'left', marginBottom: '5px' },
  checkbox: { '.MuiFormControlLabel-label': { fontWeight: 500 }, svg: { fill: '#648aff' } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};
export default function PCCPDCSetting() {
  const { config } = useMeteorConfigContext();
  const { t } = useTranslation();
  const setPdcSettingsContext = usePdcSettingsContext()[1];
  const [state, setState] = useState<State>({
    PCCMotherboardCount: 0,
  });
  const [check, setCheck] = useState<formItemProps[]>([
    {
      label: `${t('PDCSettings.PCCPDCSetting.enableMixSubsystem ', '启用混合喷头系统')}`,
      type: 'checkbox',
      showTypography: false,
      itemkey: 'enableMixSubsystem',
      value: true,
    },
    {
      label: `${t('PDCSettings.PCCPDCSetting.enableIndependentPrintLane ', '独立打印通道')}`,
      type: 'checkbox',
      showTypography: false,
      itemkey: 'enableIndependentPrintLane',
      value: false,
    },
  ]);

  const [pccAggregateTable, setPccAggregateTable] = useState<PrintPCCInfoData[]>([]);
  const [planeNameOption, setPlaneNameOption] = useState<{ label: string; value: string }[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [headInfo] = useInitHeadInfo(() => {});
  const [pccInfo] = useInitPccInfo(() => {});

  const viewPort = useRef(null);

  useEffect(() => {
    if (headInfo && pccInfo) {
      setPccAggregateTable(
        (pccInfo as PrintPCCInfoData[]).map((item, idx) =>
          setSingleHeadInfoOnPccInfo(item, headInfo as PrintHeadInfoItf[], idx),
        ),
      );
    }
  }, [headInfo, pccInfo]);

  usePlaneNames((data: string[]) => {
    setPlaneNameOption([
      {
        label: 'Head Not Fitted',
        value: 'Head Not Fitted',
      },
      ...data.map((name) => ({
        label: name,
        value: name,
      })),
    ]);
  });

  useIsEnableMixSubsystem((val) => {
    setCheck((prev) => {
      prev[0].value = val;
      return [...prev];
    });
  });

  useIsEnableIndependentPrintLane((val) => {
    setCheck((prev) => {
      prev[1].value = val;
      return [...prev];
    });
  });

  useEffect(() => {
    if (config) {
      setState((prev) => ({
        ...prev,
        PCCMotherboardCount: parseInt(config.Application?.UserPccCount || '0'),
      }));
    }
  }, [config]);

  const handleChange = (key: string, val: any) => {
    if (key === 'enableMixSubsystem') {
      setCheck((prev) => {
        prev[0].value = val;
        return prev;
      });

      setPccAggregateTable((prev) => {
        return prev.map((item, idx) => ({
          ...item,
          disabledMaster: idx === 0,
          disabledHeadType: !val && idx !== 0,
          disabledPccType: !val && idx !== 0,
          disableRightToLeft: !val && idx !== 0,
          disableXdpi: !val && idx !== 0,
        }));
      });
    }

    if (key === 'enableIndependentPrintLane') {
      setCheck((prev) => {
        prev[1].value = val;
        return prev;
      });
    }

    setPdcSettingsContext((prev) => ({
      ...prev,
      pdcSettings: {
        pccAggregateTable: pccAggregateTable,
        enableMixSubsystem: check[0].value as boolean,
        ...prev?.pdcSettings,
        [key]: val,
      },
    }));
  };

  const handlePccAggregateTableChange = (key: string, val: any, idx: number) => {
    setPccAggregateTable((prev) => {
      prev[idx] = {
        ...prev[idx],
        [key]: val,
      };

      if (key === 'master') {
        prev[idx].disableAllExceptMaster = !val;
      }

      if (prev[idx].master) {
        prev[idx] = Object.assign({}, prev[0], prev[idx], { disabledMaster: false });
      }

      return [...prev];
    });
    setPdcSettingsContext((prev) => ({
      ...prev,
      pdcSettings: {
        ...prev?.pdcSettings,
        pccAggregateTable: pccAggregateTable,
        enableMixSubsystem: check[0].value as boolean,
      },
    }));
  };

  const handlePlaneNameChange = (outIdx: number, inIdx: number, value: string) => {
    setPccAggregateTable((prev) => {
      if (prev?.[outIdx]?.headInfo?.[inIdx] && value) {
        prev[outIdx]!.headInfo![inIdx].planeName = value;
        prev[outIdx]!.headInfo![inIdx].planeNum = planeNameOption.findIndex((item) => item.label === value);
      }
      return [...prev];
    });
    setPdcSettingsContext((prev) => ({
      ...prev,
      pdcSettings: {
        ...prev?.pdcSettings,
        pccAggregateTable: pccAggregateTable,
        enableMixSubsystem: check[0].value as boolean,
      },
    }));
  };

  const handlePccMotherboardCountChange = (val: any) => {
    if (val < 1 || val > 128) {
      return;
    }
    setState({ ...state, PCCMotherboardCount: val });

    let addLen = val - pccAggregateTable.length;
    if (addLen < 0) {
      setPdcSettingsContext((prev) => ({
        ...prev,
        pdcSettings: {
          ...prev?.pdcSettings,
          PCCMotherboardCount: val,
          pccAggregateTable: pccAggregateTable.slice(0, addLen),
          enableMixSubsystem: check[0].value as boolean,
        },
      }));
      setPccAggregateTable(pccAggregateTable.slice(0, addLen));
      return;
    }

    while (addLen > 0) {
      const newPccData = setSingleHeadInfoOnPccInfo(
        {
          headInfo: [],
          disableAllExceptMaster: true,
          master: false,
          name: `PCC${pccAggregateTable.length + 1}`,
          planesPerHDC: pccAggregateTable[0]?.planesPerHDC,
          headType: pccAggregateTable[0]?.headType,
        },
        [],
        pccAggregateTable.length + 1,
      );
      pccAggregateTable.push(newPccData);
      addLen--;
    }

    setPdcSettingsContext((prev) => ({
      ...prev,
      pdcSettings: {
        ...prev?.pdcSettings,
        PCCMotherboardCount: val,
        pccAggregateTable: [...pccAggregateTable],
        enableMixSubsystem: check[0].value as boolean,
      },
    }));
    setPccAggregateTable([...pccAggregateTable]);
  };

  const computedRows = useMemo(() => {
    return pccAggregateTable.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [pccAggregateTable, rowsPerPage, page]);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      className="overflow-y-auto flex flex-col"
      sx={{ bgcolor: 'background.paper', height: '100%', padding: '0 5px' }}
    >
      <SubCard
        contentClassName="flex flex-col"
        Head={() => (
          <Typography className="w-full color-white" sx={{ ...defSX.subCardTitle }}>
            {`PCC${t('genericName.settings', '设置')}`}
          </Typography>
        )}
      >
        <Box
          sx={{
            pl: '16px',
            '&>.flex': {
              '&>div:not(:nth-of-type(1))': {
                ml: '24px',
              },
            },
          }}
        >
          <Box
            className="flex"
            sx={{
              '&>div': { pl: '10px' },
              mb: '16px',
              whiteSpace: 'nowrap',
              '& .settings__item>div': {
                minWidth: '135px',
              },
            }}
          >
            <Box
              className="flex settings__item"
              sx={{
                '& .item__box': { mt: '0' },
                '& .item__content__text': {
                  width: 'initial',
                  minWidth: 'initial',
                },
              }}
            >
              <FormItem
                {...{
                  label: `PCC${t('PDCSettings.PCCPDCSetting.MotherboardCount', '主板计数')}`,
                  type: 'text',
                  itemkey: 'PCCMotherboardCount',
                  value: `${state.PCCMotherboardCount}`,
                }}
              />
            </Box>
            <Box className="flex settings__item">
              <Typography sx={{ ...defSX.subTitle }}>{t('genericName.Set to', '设置为')}</Typography>
              <Box>
                <OutlinedInput
                  size="small"
                  value={state.PCCMotherboardCount}
                  onChange={(e) => handlePccMotherboardCountChange(parseInt(e.target.value || '0'))}
                  inputProps={{
                    step: 1,
                    min: 1,
                    max: 128,
                    type: 'number',
                  }}
                  sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 105 }}
                />
              </Box>
            </Box>
          </Box>
          <Box className="flex" sx={{ whiteSpace: 'nowrap' }}>
            {check
              .filter((_, idx) => !idx || check[idx - 1].value)
              .map((item, index) => (
                <Box key={index} className="flex">
                  <Box
                    sx={{
                      '& .item__box': {
                        mt: '0',
                        '& .item__content__checkbox': {
                          pl: '10px',
                          '.MuiFormControlLabel-label': {
                            fontWeight: '700',
                          },
                        },
                      },
                    }}
                  >
                    <FormItem {...item} onChange={handleChange} />
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </SubCard>
      <SubCard contentClassName="flex flex-col" contentSx={{ p: '16px 30px' }}>
        <PccTable onPccTableChange={handlePccAggregateTableChange} pccAggregateTable={pccAggregateTable} />
      </SubCard>
      <SubCard
        sx={{ maxHeight: 'inherit' }}
        contentClassName="flex flex-col items-center"
        contentSx={{ p: '16px 30px' }}
        contentRef={viewPort}
      >
        <Grid container spacing={1} className="w-full">
          {computedRows.map(({ name, headInfo, pccNum, planesPerHDC }, index) => (
            <Grid key={index} sm={12} md={6} lg={4}>
              <PccColorPlaneTable
                key={index}
                pccIdx={(pccNum || 1) - 1}
                planesPerHDC={planesPerHDC || 1}
                headName={name || ''}
                planeNameOptions={planeNameOption}
                headInfo={headInfo || []}
                onPlaneNameChange={handlePlaneNameChange}
              />
            </Grid>
          ))}
        </Grid>

        <TablePagination
          component="div"
          count={pccAggregateTable.length}
          page={page}
          rowsPerPageOptions={[12, 24, 36, 45]}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SubCard>
    </Box>
  );
}

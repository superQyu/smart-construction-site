import { type HTMLProps, type ReactDOM, Fragment, type SyntheticEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Checkbox,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import SubCard from '@/components/ContentCard/SubCard';
import { PrintHeadInfoItf, PrintHeadInfoData } from '@/types';
import type { State } from './index';

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

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#eff3ff',
    color: '#313132',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    borderRight: '1px solid #cdcdcd',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: '#cdcdcd',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    borderRight: '1px solid #cdcdcd',
    whiteSpace: 'nowrap',
  },
}));

export interface Props extends HTMLProps<ReactDOM> {
  voltageInfoTable: PrintHeadInfoItf[];
  selectedRows: string[];
  onSelectedAll: (event: SyntheticEvent) => void;
  filterState: State;
  onCheckSelected: (v: string) => boolean;
  onSelectedChange: (v: string) => void;
  onTableVoltageChange: (outIdx: number, inIdx: number, voltageIdx: number, val: any) => void;
}

export default function VoltageTable({
  voltageInfoTable,
  selectedRows,
  onSelectedAll,
  filterState,
  onCheckSelected,
  onSelectedChange,
  onTableVoltageChange,
}: Props) {
  const { t } = useTranslation();

  const rowCount = useMemo(() => {
    if (!voltageInfoTable) {
      return 0;
    }
    return voltageInfoTable.reduce((prev, cur) => {
      return prev + (cur?.data?.length || 0);
    }, 0);
  }, [voltageInfoTable]);

  const calcVoltageInfoTable = useMemo(() => {
    voltageInfoTable.map((item) => {
      item.data?.sort((a: PrintHeadInfoData, b: PrintHeadInfoData) => {
        if (filterState.accordingTo === 'pccPosition' || a.pcc === b.pcc) {
          return (a.pccPosition - b.pccPosition) * (filterState.sort === 'ascendingOrder' ? 1 : -1);
        }
        return (a.pcc - b.pcc) * (filterState.sort === 'ascendingOrder' ? 1 : -1);
      });
    });

    return voltageInfoTable.filter((item) => filterState.colorChannelFilterate.includes(item.planeNum.toString()));
  }, [filterState, voltageInfoTable]);

  return (
    <SubCard contentClassName="flex flex-col" sx={{ '&>.MuiBox-root': { p: '10px 20px' } }}>
      <Typography sx={{ ...defSX.areaTitle }}>{t('genericName.nozzleVoltage', '喷头电压')}:</Typography>
      <Box className="flex flex-1" sx={{ justifyContent: 'center', p: '20px 0' }}>
        <TableContainer>
          <Table
            size="small"
            sx={{
              border: '1px solid #cdcdcd',
            }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell
                  padding="checkbox"
                  colSpan={2}
                  sx={{
                    backgroundColor: ' #eff3ff',
                    borderRight: '1px solid #cdcdcd',
                  }}
                >
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < rowCount}
                    checked={rowCount > 0 && selectedRows.length === rowCount}
                    onChange={onSelectedAll}
                    color="primary"
                    inputProps={{
                      'aria-label': 'select all desserts',
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell align="center">{t('genericName.voltage1', '电压1')}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.voltage2', '电压2')}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.voltage3', '电压3')}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.voltage4', '电压4')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
              }}
            >
              {calcVoltageInfoTable.map((printHeadInfo: PrintHeadInfoItf, idx: number) => (
                <Fragment key={idx}>
                  <StyledTableRow sx={{ height: '30px' }}>
                    <StyledTableCell align="center" sx={{ fontWeight: 700, backgroundColor: ' #eff3ff' }} colSpan={6}>
                      {`${t('genericName.colorChannel', '颜色通道')}${printHeadInfo.planeNum} (${printHeadInfo.title})`}
                    </StyledTableCell>
                  </StyledTableRow>
                  {printHeadInfo.data?.map((row, index) => (
                    <StyledTableRow key={index} sx={{ height: '30px' }}>
                      <StyledTableCell
                        padding="checkbox"
                        sx={{
                          backgroundColor: ' #eff3ff',
                          borderRight: '1px solid #cdcdcd',
                        }}
                      >
                        <Checkbox
                          checked={onCheckSelected(row?.id || '')}
                          onChange={() => onSelectedChange(row?.id || '')}
                          color="primary"
                          inputProps={{
                            'aria-label': 'select all desserts',
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          width: '80px',
                          backgroundColor: ' #eff3ff',
                          p: '0 8px',
                          borderRight: '1px solid #cdcdcd',
                        }}
                      >
                        <Box className="flex justify-between">
                          <Typography sx={{ fontWeight: 700, display: 'inline-block', mr: '1rem' }}>
                            {index + 1}
                          </Typography>
                          <Typography sx={{ color: '#909299', display: 'inline-block' }}>
                            {row.pcc}:{row.pccPosition}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: '100px', p: '0 16px' }}>
                        <OutlinedInput
                          size="small"
                          value={row.voltages?.[0]}
                          onChange={(e) => onTableVoltageChange(idx, index, 0, e.target.value)}
                          endAdornment={
                            <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                              %
                            </InputAdornment>
                          }
                          inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: '100px', p: '0 16px' }}>
                        <OutlinedInput
                          size="small"
                          value={row.voltages?.[1]}
                          onChange={(e) => onTableVoltageChange(idx, index, 1, e.target.value)}
                          endAdornment={
                            <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                              %
                            </InputAdornment>
                          }
                          inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: '100px', p: '0 16px' }}>
                        <OutlinedInput
                          size="small"
                          value={row.voltages?.[2]}
                          onChange={(e) => onTableVoltageChange(idx, index, 2, e.target.value)}
                          endAdornment={
                            <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                              %
                            </InputAdornment>
                          }
                          inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: '100px', p: '0 16px' }}>
                        <OutlinedInput
                          size="small"
                          value={row.voltages?.[3]}
                          onChange={(e) => onTableVoltageChange(idx, index, 3, e.target.value)}
                          endAdornment={
                            <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                              %
                            </InputAdornment>
                          }
                          inputProps={{
                            step: 0.1,
                            min: 0,
                            max: 99999,
                            type: 'number',
                          }}
                          sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </SubCard>
  );
}

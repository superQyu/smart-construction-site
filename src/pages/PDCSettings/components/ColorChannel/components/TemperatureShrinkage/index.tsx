import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Box, OutlinedInput, TableRow, TableHead, TableContainer, TableBody, Table } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { usePdcSettingsContext } from '@/context/PDCSettings';
import { useInitPlaneInfo } from '@/hooks/printer';
import type { PrintPlaneInfo } from '@/types';

export interface Props extends HTMLProps<ReactDOM> {
  planeCount: number;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#eff3ff',
    color: '#313132',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    borderRight: '1px solid #cdcdcd',
  },
  [`&.${tableCellClasses.body}`]: {
    borderColor: '#cdcdcd',
    padding: '1px',
    '& span.MuiCheckbox-root': {
      padding: '0 9px',
    },
  },
}));
const StyledTableRow = styled(TableRow)(() => ({
  '&  td, &  th': {
    borderRight: '1px solid #cdcdcd',
    whiteSpace: 'nowrap',
  },
}));
export default function TemperatureShrinkage({ planeCount }: Props) {
  const { t } = useTranslation();
  const setPdcSettingsCtx = usePdcSettingsContext()[1];

  useInitPlaneInfo(
    (data: PrintPlaneInfo[]) => {
      setTemperatureShrinkage(data);
    },
    planeCount,
    {
      temperatureContraction: true,
    },
  );

  const [temperatureShrinkage, setTemperatureShrinkage] = useState<PrintPlaneInfo[]>([]);

  const handleTableState = (index: number, key: string, val: any) => {
    setTemperatureShrinkage((prev) => {
      prev[index] = {
        ...prev[index],
        temperatureContraction: {
          ...prev[index]?.temperatureContraction,
          [key]: parseFloat(val || '0'),
        },
      };

      return [...prev];
    });

    setPdcSettingsCtx((prev) => {
      const planeInfoArr =
        prev.colorPlane?.planeInfoArr?.map((item, idx) => Object.assign({}, temperatureShrinkage?.[idx], item)) ||
        temperatureShrinkage;
      planeInfoArr[index] = {
        ...planeInfoArr[index],
        temperatureContraction: {
          ...planeInfoArr[index]?.temperatureContraction,
          [key]: parseFloat(val || '0'),
        },
      };
      return {
        ...prev,
        colorPlane: {
          ...prev.colorPlane,
          planeInfoArr: [...planeInfoArr],
        },
      };
    });
  };

  return (
    <TableContainer>
      <Box>
        <Table
          size="small"
          sx={{
            border: '1px solid #cdcdcd',
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">{t('genericName.thoroughfare', '通道')}</StyledTableCell>
              <StyledTableCell align="center">{`${t('genericName.edge', '边缘')}X(mm)!`}</StyledTableCell>
              <StyledTableCell align="center">{`${t('genericName.edge', '边缘')}Y(mm)!`}</StyledTableCell>
              <StyledTableCell align="center">{`${t('genericName.horn', '角')}X(mm)!`}</StyledTableCell>
              <StyledTableCell align="center">{`${t('genericName.horn', '角')}X(mm)!`}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
              '& .item__box': {
                mt: 0,
              },
            }}
          >
            {temperatureShrinkage.map((row, index) => (
              <StyledTableRow key={index} sx={{ height: '30px' }}>
                <StyledTableCell
                  align="center"
                  sx={{
                    width: '60px',
                    fontWeight: 700,
                    backgroundColor: ' #eff3ff',
                  }}
                >
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.temperatureContraction?.tileEdgeContractionXPx}
                    onChange={(e) => handleTableState(index, 'tileEdgeContractionXPx', e.target.value)}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' }, color: '#999' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.temperatureContraction?.tileEdgeContractionYPx}
                    onChange={(e) => handleTableState(index, 'tileEdgeContractionYPx', e.target.value)}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' }, color: '#999' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.temperatureContraction?.tileCornerContractionXPx}
                    onChange={(e) => handleTableState(index, 'tileCornerContractionXPx', e.target.value)}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' }, color: '#999' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.temperatureContraction?.tileCornerContractionYPx}
                    onChange={(e) => handleTableState(index, 'tileCornerContractionYPx', e.target.value)}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' }, color: '#999' }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
}

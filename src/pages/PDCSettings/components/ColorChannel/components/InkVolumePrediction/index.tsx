import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Box,
  OutlinedInput,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  InputAdornment,
} from '@mui/material';
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
export default function InkVolumePrediction({ planeCount }: Props) {
  const { t } = useTranslation();
  useInitPlaneInfo(
    (data: PrintPlaneInfo[]) => {
      setInkVolumePrediction(data);
    },
    planeCount,
    {
      dropSizes: true,
    },
  );
  const setPdcSettingsCtx = usePdcSettingsContext()[1];
  const [inkVolumePrediction, setInkVolumePrediction] = useState<PrintPlaneInfo[]>([]);

  const handleTableState = (index: number, key: string, val: any) => {
    setInkVolumePrediction((prev) => {
      prev[index] = {
        ...prev[index],
        dropSizes: {
          ...prev[index]?.dropSizes,
          [key]: parseFloat(val || '0'),
        },
      };

      return [...prev];
    });

    setPdcSettingsCtx((prev) => {
      const planeInfoArr =
        prev.colorPlane?.planeInfoArr?.map((item, idx) => Object.assign({}, inkVolumePrediction?.[idx], item)) ||
        inkVolumePrediction;
      planeInfoArr[index] = {
        ...planeInfoArr[index],
        dropSizes: {
          ...planeInfoArr[index]?.dropSizes,
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
              <StyledTableCell align="center">{`1${t('MaintenanceBar.inkDroplet.level', '级')}${t(
                'genericName.inkDroplet',
                '墨滴',
              )}`}</StyledTableCell>
              <StyledTableCell align="center">{`2${t('MaintenanceBar.inkDroplet.level', '级')}${t(
                'genericName.inkDroplet',
                '墨滴',
              )}`}</StyledTableCell>
              <StyledTableCell align="center">{`3${t('MaintenanceBar.inkDroplet.level', '级')}${t(
                'genericName.inkDroplet',
                '墨滴',
              )}`}</StyledTableCell>
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
            {inkVolumePrediction.map((row, index) => (
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
                    value={row.dropSizes?.gl1}
                    onChange={(e) => handleTableState(index, 'gl1', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ position: 'absolute', right: '5px' }}>
                        pL
                      </InputAdornment>
                    }
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px' }, color: '#999' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.dropSizes?.gl2}
                    onChange={(e) => handleTableState(index, 'gl2', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ position: 'absolute', right: '5px' }}>
                        pL
                      </InputAdornment>
                    }
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px' }, color: '#999' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.dropSizes?.gl3}
                    onChange={(e) => handleTableState(index, 'gl3', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ position: 'absolute', right: '5px' }}>
                        pL
                      </InputAdornment>
                    }
                    inputProps={{
                      step: 0.1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px' }, color: '#999' }}
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

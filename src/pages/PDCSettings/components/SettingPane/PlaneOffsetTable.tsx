import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  OutlinedInput,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  BoxProps,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useInitHeadInfo } from '@/hooks/printer';
import CusButton from '@/components/CustomComponents/CusButton';
import { PlaneOffsetItf, PrintHeadInfoItf } from '@/types';

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
  '& td, th': {
    borderRight: '1px solid #cdcdcd',
    whiteSpace: 'nowrap',
  },
}));

export interface Props extends BoxProps {
  tableData: PlaneOffsetItf[];
  onTableOffsetChange: (i: number, k: 'x' | 'y', v: any) => void;
  onReset: () => void;
}

export default function PlaneOffsetTable({ tableData, onTableOffsetChange, onReset, sx, ...restProps }: Props) {
  const { t } = useTranslation();
  const [usedPlaneInfoArr, setUsedPlaneInfoArr] = useState<PrintHeadInfoItf[]>([]);

  useInitHeadInfo((data) => {
    setUsedPlaneInfoArr(data);
  });

  const computedStep = (planeNum: number) => {
    return usedPlaneInfoArr.findIndex((item) => item.planeNum === planeNum) >= 0 ? 0.04 : 0.1;
  };

  return (
    <Box {...restProps} sx={{ p: '0 70px', ...sx }}>
      <Typography
        className="w-full relative"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          mb: '5px',
          alignItems: 'center',
        }}
      >
        {`${t('genericName.thoroughfare', '通道')}${t('genericName.offset', '偏移量')}`}

        <CusButton onClick={onReset} size="small" sx={{ position: 'absolute', right: '0px' }}>
          {t('genericName.reset', '重置')}
        </CusButton>
      </Typography>

      <TableContainer>
        <Table
          size="small"
          sx={{
            border: '1px solid #cdcdcd',
            width: '100%',
          }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="center">{`X${t('genericName.offset', '偏移量')} (${t(
                'genericName.millimeterMeter',
                '亳米',
              )})`}</StyledTableCell>
              <StyledTableCell align="center">{`Y${t('genericName.offset', '偏移量')} (${t(
                'genericName.millimeterMeter',
                '亳米',
              )})`}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
            }}
          >
            {tableData.map((row, index) => (
              <StyledTableRow key={index} sx={{ height: '30px' }}>
                <StyledTableCell align="center" sx={{ width: '120px', backgroundColor: ' #eff3ff' }}>
                  <Typography sx={{ fontWeight: 700 }}>{row.label}</Typography>
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '220px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.x}
                    onChange={(e) => onTableOffsetChange(index, 'x', e.target.value)}
                    inputProps={{
                      step: 0.01,
                      min: -99999,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '220px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.y}
                    onChange={(e) => onTableOffsetChange(index, 'y', e.target.value)}
                    inputProps={{
                      step: computedStep(row.planeNum),
                      min: -99999,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

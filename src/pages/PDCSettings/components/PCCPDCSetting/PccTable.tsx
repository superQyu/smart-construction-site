import { useMemo, useState, MouseEvent, ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';
import {
  Checkbox,
  OutlinedInput,
  TableRow,
  TableHead,
  Box,
  TableBody,
  Table,
  InputAdornment,
  TablePagination,
  type BoxProps,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import FormItem from '@/components/CustomComponents/FormItem';
import { PrintPCCInfoData } from '@/types';
import { SUPPORT_HEAD_TYPE_LIST } from '@/config';

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

export interface Props extends BoxProps {
  pccAggregateTable: PrintPCCInfoData[];
  onPccTableChange: (k: string, v: any, i: number) => void;
}

export default function PccTable({ pccAggregateTable, onPccTableChange, ...restProps }: Props) {
  const headTypeOptions = SUPPORT_HEAD_TYPE_LIST.map((headType) => ({
    label: headType,
    value: headType,
  }));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    <Box className="overflow-y-auto" {...restProps}>
      <Table
        size="small"
        sx={{
          border: '1px solid #cdcdcd',
        }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="center">Master</StyledTableCell>
            <StyledTableCell align="center">Head Type</StyledTableCell>
            <StyledTableCell align="center">PCC Type</StyledTableCell>
            <StyledTableCell align="center">Enc Mult</StyledTableCell>
            <StyledTableCell align="center">Enc Div</StyledTableCell>
            <StyledTableCell align="center">Enc Invert</StyledTableCell>
            <StyledTableCell align="center">X DPI</StyledTableCell>
            <StyledTableCell align="center">Pd Offset</StyledTableCell>
            <StyledTableCell align="center">Right to Left</StyledTableCell>
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
          {computedRows.map((row, index) => (
            <StyledTableRow key={index} sx={{ height: '30px' }}>
              <StyledTableCell
                align="center"
                sx={{
                  minWidth: '60px',
                  fontWeight: 700,
                  backgroundColor: ' #eff3ff',
                }}
              >
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Checkbox
                  color="primary"
                  checked={row.master}
                  onChange={(e) => onPccTableChange('master', e.target.checked, page * rowsPerPage + index)}
                  disabled={row.disabledMaster}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disabledHeadType && !row.disableAllExceptMaster && (
                  <FormItem
                    {...{
                      label: 'headType',
                      showTypography: false,
                      type: 'select',
                      itemkey: 'headType',
                      value: row.headType,
                      options: headTypeOptions,
                    }}
                    onChange={(k, v) => onPccTableChange(k, v, page * rowsPerPage + index)}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disabledPccType && !row.disableAllExceptMaster && (
                  <FormItem
                    {...{
                      label: 'PCCType',
                      showTypography: false,
                      type: 'select',
                      itemkey: 'pccType',
                      value: row.pccType,
                      options: [
                        { label: 'PCCE', value: 'PCCE' },
                        { label: 'PCC2E', value: 'PCC2E' },
                      ],
                    }}
                    onChange={(k, v) => onPccTableChange(k, v, page * rowsPerPage + index)}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disableAllExceptMaster && (
                  <OutlinedInput
                    size="small"
                    value={row.encoderMultiplier || ''}
                    onChange={(e) => onPccTableChange('encoderMultiplier', e.target.value, page * rowsPerPage + index)}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disableAllExceptMaster && (
                  <OutlinedInput
                    size="small"
                    value={row.encoderDivider || ''}
                    onChange={(e) => onPccTableChange('encoderDivider', e.target.value, page * rowsPerPage + index)}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disableAllExceptMaster && (
                  <Checkbox
                    color="primary"
                    checked={row.encoderInvert}
                    onChange={(e) => onPccTableChange('encoderInvert', e.target.checked, page * rowsPerPage + index)}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minWidth: '80px',
                  },
                }}
              >
                {!row.disableXdpi && !row.disableAllExceptMaster && (
                  <OutlinedInput
                    size="small"
                    value={row.xdpi || ''}
                    onChange={(e) => onPccTableChange('xdpi', e.target.value, page * rowsPerPage + index)}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', minWidth: '60px', input: { p: '5px 14px' } }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minWidth: '120px',
                  },
                  '& .MuiOutlinedInput-input': {
                    pr: '0',
                  },
                }}
              >
                {!row.disableAllExceptMaster && (
                  <OutlinedInput
                    size="small"
                    value={row.pdOffset || ''}
                    onChange={(e) => onPccTableChange('pdOffset', e.target.value, page * rowsPerPage + index)}
                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', minWidth: '60px', input: { p: '5px 14px' } }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {!row.disableRightToLeft && !row.disableAllExceptMaster && (
                  <Checkbox
                    color="primary"
                    checked={row.rightToLeft}
                    onChange={(e) => onPccTableChange('rightToLeft', e.target.checked, page * rowsPerPage + index)}
                  />
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={pccAggregateTable.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

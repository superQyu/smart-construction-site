import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Box, OutlinedInput, TableRow, TableHead, TableContainer, TableBody, Table } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export interface Props extends HTMLProps<ReactDOM> {}

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
export default function MaintenanceBar({}: Props) {
  const { t } = useTranslation();

  const [maintenanceBar, setMaintenanceBar] = useState([
    {
      id: 1,
      planeName: '通道1',
      internalUse: '0.0',
      offset: '0.0',
      width: '0.0',
    },
    {
      id: 2,
      planeName: '通道2',
      internalUse: '0.0',
      offset: '0.0',
      width: '0.0',
    },
    {
      id: 3,
      planeName: '通道3',
      internalUse: '0.0',
      offset: '0.0',
      width: '0.0',
    },
    {
      id: 4,
      planeName: '通道4',
      internalUse: '0.0',
      offset: '0.0',
      width: '0.0',
    },
  ]);

  const handleTableState = (index: number, key: string, val: any) => {
    const updatedRows = [...maintenanceBar];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setMaintenanceBar(updatedRows);
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
              <StyledTableCell align="center">{t('genericName.internalUse', '内部使用')}</StyledTableCell>
              <StyledTableCell align="center">{`${t('MaintenanceBar.plane.offset', '偏移')}(mm)`}</StyledTableCell>
              <StyledTableCell align="center">{`${t('genericName.width', '宽度')}(mm)`}</StyledTableCell>
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
            {maintenanceBar.map((row, index) => (
              <StyledTableRow key={index} sx={{ height: '30px' }}>
                <StyledTableCell
                  align="center"
                  sx={{
                    width: '60px',
                    fontWeight: 700,
                    backgroundColor: ' #eff3ff',
                  }}
                >
                  {row.planeName}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '90px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.internalUse || ''}
                    onChange={(e) => handleTableState(index, 'internalUse', e.target.value)}
                    inputProps={{
                      step: 0.1,
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
                    value={row.offset || ''}
                    onChange={(e) => handleTableState(index, 'offset', e.target.value)}
                    inputProps={{
                      step: 0.1,
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
                    value={row.width || ''}
                    onChange={(e) => handleTableState(index, 'width', e.target.value)}
                    inputProps={{
                      step: 0.1,
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

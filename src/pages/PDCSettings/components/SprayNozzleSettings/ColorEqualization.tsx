import { useState} from 'react';
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
  Button,
  InputAdornment,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SimpleModal from '@/components/SimpleModal';
export interface Props extends BoxProps {
  open: boolean;
  onClose: () => void;
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

export interface Props extends BoxProps {}

export default function ColorEqualization({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [tableData, settableData] = useState([
    {
      start: 1,
      end: 1329,
      equalVal: 0,
    },
  ]);

  const handleTableState = (index: number, key: string, val: any) => {
    const updatedRows = [...tableData];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    if (updatedRows[index].start >= updatedRows[index].end) return;
    settableData(updatedRows);
  };
  const addItem = (item: any, _: number) => {
    const updatedRows = [...tableData];

    updatedRows.push({
      start: item.start + item.end,
      end: item.start + item.end + 1329,
      equalVal: 0.02,
    });
    settableData(updatedRows);
  };
  const removeItem = (_: any, index: number) => {
    const updatedRows = [...tableData];
    updatedRows.splice(index, 1);
    settableData(updatedRows);
  };
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={`${t('genericName.colorEqualization', '色彩均衡')}${t('genericName.nozzleColor', '喷头')}1:1`}
      sx={{
        '& .MuiDialog-paper': {
          width: '620px',
        },
        '& h2': { backgroundColor: '#ecf4ff' },
      }}
      Foot={() => (
        <Box className="flex justify-end">
          <Button variant="outlined" onClick={onClose}>
            {t('genericName.close', '关闭')}
          </Button>
        </Box>
      )}
    >
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
              <StyledTableCell align="center">
                {t('genericName.nozzleStartingPosition', '喷嘴起始位置')}
              </StyledTableCell>
              <StyledTableCell align="center">{t('genericName.nozzleEndPosition', '喷嘴结束位置')}</StyledTableCell>
              <StyledTableCell align="center">{t('genericName.equalVal', '均衡值')}</StyledTableCell>
              <StyledTableCell align="center">{t('genericName.insert', '插入')}</StyledTableCell>
              <StyledTableCell align="center">{t('genericName.remove', '移除')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
            }}
          >
            {tableData.map((row: any, index: number) => (
              <StyledTableRow key={index} sx={{ height: '30px' }}>
                <StyledTableCell align="center" sx={{ width: '220px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.start}
                    onChange={(e) => handleTableState(index, 'start', e.target.value)}
                    inputProps={{
                      step: 1,
                      min: 1,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '220px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.end}
                    onChange={(e) => handleTableState(index, 'end', e.target.value)}
                    inputProps={{
                      step: 1,
                      min: 1,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '220px' }}>
                  <OutlinedInput
                    size="small"
                    value={row.equalVal}
                    onChange={(e) => handleTableState(index, 'equalVal', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                        %
                      </InputAdornment>
                    }
                    inputProps={{
                      step: 0.01,
                      min: 1,
                      max: 99999,
                      type: 'number',
                    }}
                    sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '40px' }}>
                  <Typography
                    sx={{ cursor: 'pointer', color: '#577df6', textDecoration: 'underline' }}
                    onClick={() => addItem(row, index)}
                  >
                    {t('genericName.insert', '插入')}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '40px' }}>
                  <Typography
                    sx={{ cursor: 'pointer', color: '#577df6', textDecoration: 'underline' }}
                    onClick={() => removeItem(row, index)}
                  >
                    {t('genericName.remove', '移除')}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SimpleModal>
  );
}

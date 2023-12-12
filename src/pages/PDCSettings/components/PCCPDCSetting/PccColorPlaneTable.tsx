import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Box, TableRow, TableHead, TableContainer, TableBody, Table, type TableContainerProps } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import FormItem from '@/components/CustomComponents/FormItem';
import { PrintHeadInfoData } from '@/types';

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

interface Props extends TableContainerProps {
  pccIdx: number;
  planesPerHDC: number;
  headName: string;
  planeNameOptions: { label: string; value: string }[];
  headInfo: PrintHeadInfoData[];
  onPlaneNameChange: (pccIdx: number, idx: number, planeName: string) => void;
}

export default function PccColorPlaneTable({
  pccIdx,
  sx,
  planeNameOptions,
  onPlaneNameChange,
  headInfo,
  headName,
  planesPerHDC,
  ...restProps
}: Props) {
  const { t } = useTranslation();
  return (
    <TableContainer {...restProps} sx={{ mb: '5px', ...sx }}>
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
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="center">{t('genericName.nozzleId', '喷头编号')}</StyledTableCell>
              <StyledTableCell align="center">{t('genericName.planeId', '通道编号')}</StyledTableCell>
              <StyledTableCell align="center">{t('genericName.planeName', '通道名称')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody
            key={pccIdx}
            sx={{
              mb: '10px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
              '& .MuiTableCell-body': { p: '5px 1px' },
              '& .item__box': {
                mt: 0,
              },
            }}
          >
            {headInfo?.map((item, i) => (
              <StyledTableRow key={`${pccIdx}-${i}`} sx={{ height: '0px' }}>
                {i === 0 && (
                  <StyledTableCell
                    align="center"
                    sx={{
                      width: '90px',
                      fontWeight: 700,
                      backgroundColor: ' #eff3ff',
                    }}
                    rowSpan={headInfo.length}
                  >
                    {headName}
                  </StyledTableCell>
                )}
                <StyledTableCell align="center" sx={{ width: '110px' }}>
                  {planesPerHDC === 2 ? `${item.pcc}:${item.pccPosition}:${item.channel}` : item.pccPosition}
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '110px' }}>
                  {item.planeNum}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <FormItem
                    {...{
                      showTypography: false,
                      label: '',
                      type: 'select',
                      itemkey: 'planeName',
                      value: item.planeName,
                      options: planeNameOptions,
                    }}
                    onChange={(_: string, val: any) => onPlaneNameChange(pccIdx, i, val)}
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

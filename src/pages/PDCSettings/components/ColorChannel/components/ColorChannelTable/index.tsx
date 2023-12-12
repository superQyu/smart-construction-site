import { useState } from 'react';
import type { HTMLProps, ReactDOM } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { OutlinedInput, TableRow, TableHead, TableContainer, TableBody, Table, Link, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { open as openFile } from '@tauri-apps/api/dialog';

import { usePdcSettingsContext } from '@/context/PDCSettings';
import { useInitPlaneInfo } from '@/hooks/printer';
import { PrintPlaneInfo } from '@/types';

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
export default function ColorChannelTable({ planeCount }: Props) {
  const { t } = useTranslation();

  const [colorChannelTable, setColorChannelTable] = useState<PrintPlaneInfo[]>([]);
  const setPdcSettingsContext = usePdcSettingsContext()[1];

  useInitPlaneInfo((data: PrintPlaneInfo[]) => {
    setColorChannelTable(data);
  }, planeCount);

  const handleTableState = (index: number, key: string, val: any) => {
    const updatedRows = [...colorChannelTable];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setColorChannelTable(updatedRows);
  };

  const handleClick = (index: number) => {
    openFile({
      multiple: false,
      directory: false,
      filters: [
        {
          name: t('common.meteorType', 'Meteor波形'),
          extensions: ['ComA'],
        },
      ],
    }).then((res) => {
      if (!res) return;

      setColorChannelTable((prev) => {
        prev[index].waveForm = res as string;
        return [...prev];
      });

      setPdcSettingsContext((prev) => {
        const planeInfoArr =
          prev.colorPlane?.planeInfoArr?.map((item, idx) => Object.assign({}, colorChannelTable?.[idx], item)) ||
          colorChannelTable;
        planeInfoArr[index].waveForm = res as string;
        return {
          ...prev,
          colorPlane: {
            ...prev.colorPlane,
            planeInfoArr: [...planeInfoArr],
          },
        };
      });
    });
  };
  return (
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
            <StyledTableCell align="center">{t('genericName.planeId', '通道编号')}</StyledTableCell>
            <StyledTableCell align="center">{t('genericName.planeName', '通道名称')}</StyledTableCell>
            <StyledTableCell align="center">{`${t('genericName.temperature', '温度')}（℃）`}</StyledTableCell>
            <StyledTableCell align="center">{t('genericName.waveformFile', '波形文件')}</StyledTableCell>
            <StyledTableCell></StyledTableCell>
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
          {colorChannelTable.map((row, index) => (
            <StyledTableRow key={index} sx={{ height: '30px' }}>
              <StyledTableCell
                align="center"
                sx={{
                  width: '60px',
                  fontWeight: 700,
                  backgroundColor: ' #eff3ff',
                }}
              >
                {row.order}
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{
                  width: '60px',
                  fontWeight: 700,
                  color: '#999',
                }}
              >
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ width: '60px' }}>
                <OutlinedInput
                  size="small"
                  value={row.temperature ?? ''}
                  onChange={(e) => handleTableState(index, 'temperature', e.target.value)}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 99999,
                    type: 'number',
                  }}
                  sx={{ borderRadius: '0', input: { p: '5px 14px' }, color: '#999' }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <Typography className="px2"> {row.waveForm} </Typography>
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{
                  width: '40px',
                }}
              >
                {row.pcc && row.pcc.length > 0 ? (
                  <Link
                    className="cursor-pointer"
                    underline="none"
                    onClick={() => {
                      handleClick(index);
                    }}
                    sx={{ fontWeight: '700', fontSize: '0.625rem', color: '#648aff' }}
                  >
                    {t('genericName.select', '选择')}
                  </Link>
                ) : (
                  <Link
                    className="cursor-not-allowed"
                    underline="none"
                    sx={{ fontWeight: '700', fontSize: '0.625rem', color: 'action.disabled' }}
                  >
                    {t('genericName.select', '选择')}
                  </Link>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

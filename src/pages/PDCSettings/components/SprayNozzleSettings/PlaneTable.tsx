import { useState, Fragment, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Link,
  Checkbox,
  OutlinedInput,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  InputAdornment,
  RadioGroup,
  BoxProps,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import FormItem, { type formItemProps } from '@/components/CustomComponents/FormItem';
import { PrintHeadInfoItf } from '@/types';

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
    padding: '1px 16px',
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
  colorPlaneOptions: any[];
  planeTable: PrintHeadInfoItf[];
  onTableState: (outIdx: number, index: number, key: string, val: any) => void;
  onHeadEnableStatus: (idx: number, val: boolean) => void;
}
export default function PlaneTable({ colorPlaneOptions, planeTable, onTableState, onHeadEnableStatus }: Props) {
  const { t } = useTranslation();

  const [displayPlaneOfTable, setDisplayPlaneOfTable] = useState('displayAllColorChannel');
  const displayPlaneOfTableRadioGroup: formItemProps[] = [
    {
      label: `${t('PDCSettings.sprayNozzleSettings.displayAllColorChannel ', '同时显示所有颜色通道')}`,
      type: 'radio',
      showTypography: false,
      itemkey: 'displayAllColorChannel',
      value: 'displayAllColorChannel',
    },
    {
      label: `${t('PDCSettings.sprayNozzleSettings.displaySingleColorChannel ', '只显示单一颜色通道')}`,
      type: 'radio',
      showTypography: false,
      itemkey: 'displaySingleColorChannel',
      value: 'displaySingleColorChannel',
    },
  ];

  const [tablePlaneFilter, setTablePlaneFilter] = useState<formItemProps>({
    label: t('genericName.colorChannel', '颜色通道'),
    type: 'select',
    itemkey: 'colorChannel',
    showTypography: false,
    value: 'all',
  });

  const computedTable = useMemo(() => {
    if (displayPlaneOfTable === 'displayAllColorChannel') {
      return planeTable;
    }
    return planeTable.filter((item) =>
      tablePlaneFilter.value === 'all' ? true : item.planeNum.toString() === tablePlaneFilter.value,
    );
  }, [planeTable, tablePlaneFilter, displayPlaneOfTable]);

  return (
    <Box sx={{ p: '0 70px' }}>
      <TableContainer>
        <Box className="flex">
          <RadioGroup row value={displayPlaneOfTable} onChange={(event) => setDisplayPlaneOfTable(event.target.value)}>
            {displayPlaneOfTableRadioGroup.map((item, idx) => (
              <Box key={idx} sx={{ '& .item__content__radio': { pl: '10px' } }}>
                <FormItem {...item} isGroupItem />
              </Box>
            ))}
          </RadioGroup>
          {displayPlaneOfTable === 'displaySingleColorChannel' && (
            <FormItem
              {...tablePlaneFilter}
              options={colorPlaneOptions}
              onChange={(_, val) => setTablePlaneFilter((prev) => ({ ...prev, value: val as string }))}
            ></FormItem>
          )}
        </Box>
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
                <StyledTableCell align="center">{`${t('genericName.nozzle', '喷头')}Y${t(
                  'genericName.position',
                  '位置',
                )} (${t('genericName.pixel', '像素')})`}</StyledTableCell>
                <StyledTableCell align="center">{`${t('genericName.nozzle', '喷头')}X${t(
                  'genericName.position',
                  '位置',
                )} (${t('genericName.millimeterMeter', '亳米')})`}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.nozzleOrientation', '喷头朝向')}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.ativatedNozzles', '已启用的喷头')}</StyledTableCell>
                <StyledTableCell align="center">{t('genericName.adjustingSprayHole', '喷孔深浅调节')}</StyledTableCell>
                <StyledTableCell align="center">
                  {t('genericName.splicePositionAdjustment', '拼接位调节')}
                </StyledTableCell>
                <StyledTableCell align="center">{t('genericName.colorBalance', '色彩均衡')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiOutlinedInput-root': { width: '100%', input: { textAlign: 'center' } },
              }}
            >
              {computedTable.map((planeInfo: PrintHeadInfoItf, idx) => {
                return (
                  <Fragment key={idx}>
                    <StyledTableRow sx={{ height: '30px' }}>
                      <StyledTableCell align="center" sx={{ fontWeight: 700, backgroundColor: ' #caddff' }} colSpan={5}>
                        {`${t('genericName.colorChannel', '颜色通道')}${planeInfo.planeNum} (${planeInfo.title}${
                          planeInfo.subTitle || ''
                        })`}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ fontWeight: 700, backgroundColor: ' #caddff' }}>
                        <Checkbox
                          color="primary"
                          indeterminate={
                            (planeInfo.data || []).filter((item) => item.enabled).length > 0 &&
                            (planeInfo.data || []).filter((item) => item.enabled).length < (planeInfo.data || []).length
                          }
                          checked={
                            (planeInfo.data || []).length > 0 &&
                            (planeInfo.data || []).filter((item) => item.enabled).length ===
                              (planeInfo.data || []).length
                          }
                          onChange={(e) => onHeadEnableStatus(idx, e.target.checked)}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ fontWeight: 700, backgroundColor: ' #caddff' }}
                        colSpan={3}
                      ></StyledTableCell>
                    </StyledTableRow>
                    {planeInfo.data?.map((row, index) => (
                      <StyledTableRow key={`${idx}-${index}`} sx={{ height: '30px' }}>
                        <StyledTableCell
                          align="center"
                          sx={{ width: '40px', fontWeight: 700, backgroundColor: ' #eff3ff' }}
                        >
                          {row.order}
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '120px' }}>
                          <Typography>
                            {planeInfo.planesPerHDC === 2
                              ? `${row.pcc}:${row.pccPosition}:${row.channel}`
                              : `${row.pcc}:${row.pccPosition}`}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '220px' }}>
                          <OutlinedInput
                            size="small"
                            value={row.yOffset}
                            onChange={(e) => onTableState(idx, index, 'yOffset', parseFloat(e.target.value || '0'))}
                            inputProps={{
                              step: 1,
                              min: 0,
                              max: 99999,
                              type: 'number',
                            }}
                            sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '220px' }}>
                          <OutlinedInput
                            size="small"
                            value={row.xOffset}
                            onChange={(e) => onTableState(idx, index, 'xOffset', parseFloat(e.target.value || '0'))}
                            inputProps={{
                              step: 0.01,
                              min: 0,
                              max: 99999,
                              type: 'number',
                            }}
                            sx={{ borderRadius: '0', input: { p: '5px 14px' } }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '60px' }}>
                          <Checkbox
                            color="primary"
                            checked={row.orientation}
                            onChange={(e) => onTableState(idx, index, 'orientation', e.target.checked)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '60px' }}>
                          <Checkbox
                            color="primary"
                            checked={row.enabled}
                            onChange={(e) => onTableState(idx, index, 'enabled', e.target.checked)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '160px' }}>
                          <OutlinedInput
                            size="small"
                            value={row.stitchBalance}
                            onChange={(e) =>
                              onTableState(idx, index, 'stitchBalance', parseFloat(e.target.value || '0'))
                            }
                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            inputProps={{
                              step: 0.01,
                              min: 0,
                              max: 99999,
                              type: 'number',
                            }}
                            sx={{ borderRadius: '0', minWidth: '60px', input: { p: '5px 14px' } }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: '160px' }}>
                          <OutlinedInput
                            size="small"
                            value={row.stitchAdjust}
                            onChange={(e) =>
                              onTableState(idx, index, 'stitchAdjust', parseFloat(e.target.value || '0'))
                            }
                            endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            inputProps={{
                              step: 0.01,
                              min: 0,
                              max: 99999,
                              type: 'number',
                            }}
                            sx={{ borderRadius: '0', minWidth: '60px', input: { p: '5px 14px' } }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Link
                            className="cursor-pointer"
                            underline="none"
                            onClick={() => {}}
                            sx={{ fontWeight: '700', fontSize: '0.625rem' }}
                          >
                            {t('genericName.settings', '#TODO设置')}
                          </Link>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </Box>
  );
}

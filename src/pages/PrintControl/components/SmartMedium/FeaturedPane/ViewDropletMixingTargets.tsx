import { useState } from 'react';
import type { HTMLProps } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
} from '@mui/material';

import { useSnackbar } from '@/context/SnackbarContext';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import FormItem, { formItemProps } from '@/components/CustomComponents/FormItem';
import CusLabelSimple from '@/components/CustomComponents/CusLabelSimple';
import SubCard from '@/components/ContentCard/SubCard';
import ImagePreview from '@/components/ImagePreview';
import Counter from '@/components/Counter';

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#fff' },
  subCard: {
    marginBottom: '8px',
    height: '100%',
    '&>.MuiPaper-root': { padding: '0 10px', justifyContent: 'center' },
    '.content': { padding: '0' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
  checkbox: { svg: { fill: '#648aff' } },
};

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#eaeaea',
    color: '#313132',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: 0,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {},
  '&:last-child td, &:last-child th': {
    border: 0,
    whiteSpace: 'nowrap',
  },
}));
export interface Props extends HTMLProps<HTMLElement> {
  params?: {};
}
interface State {
  [key: string]: string | number | boolean;
}

export default function ViewDropletMixingTargets({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState<State>({});
  const [setting] = useState<{ key?: string; label?: string }>(params);
  const [previewImageItem] = useState(null);

  const [settingList] = useState<formItemProps[]>([
    {
      label: t('genericName.colorants', '着色剂'),
      type: 'select',
      itemkey: 'colorants',
      value: 'C/M/Y/K',
      options: [{ label: 'C/M/Y/K', value: 'C/M/Y/K' }],
    },
    {
      label: t('genericName.droppingLevel', '滴液级别'),
      itemkey: 'scanner',
      value: 'EPSON',
      customComponent: (
        <Box className="flex" sx={{ margin: '0 30px', justifyContent: 'flex-start!important' }}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                onChange={(e) => handleChange('1 Drop', e.target.checked)}
                name="enableCompression"
              />
            }
            label="1 Drop"
            sx={{ ...defSX.checkbox, display: 'flex', flexDirection: 'row-reverse' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                onChange={(e) => handleChange('2 Drop', e.target.checked)}
                name="enableCompression"
              />
            }
            label="2 Drop"
            sx={{ ...defSX.checkbox, display: 'flex', flexDirection: 'row-reverse' }}
          />
        </Box>
      ),
    },
  ]);
  const [droppingLevel, setDroppingLevel] = useState([
    { id: 1, name: '1 Drop', start: 0, end: 0, chon: 0 },
    { id: 2, name: '2 Drop', start: 96, end: 100, chon: 0 },
  ]);
  const handleChange = (key: string, val: any) => {
    setState({ ...state, [key]: val });
    showSnackbar({ message: `[${key}] updated`, severity: 'success' });
  };

  const handleValueChange = (index: number, key: string, val: any) => {
    const updatedRows = [...droppingLevel];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setDroppingLevel(updatedRows);
    showSnackbar({ message: `第${index + 1}行[${key}]的值修改成功[${val}]`, severity: 'success' });
  };

  return (
    <Box className="h-full w-full">
      <CusLabelSimple label={setting.label} />
      <Box className="h-full w-full" sx={{ p: '17px 0 0' }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          sx={{
            flexWrap: 'nowrap',
          }}
          className="flex flex-col  max-h100vh lg:max-h-inherit h-full"
        >
          <Grid item xs={12} sm={12} md={7} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.settings', '设置')}</Typography>}
            >
              <Box
                sx={{
                  p: '0 20px',
                  mb: '25px',
                  '& .item__box>div.MuiFormControl-root': { width: 'initial' },
                  '& .item__label': { justifyContent: 'flex-end' },
                }}
              >
                {settingList.map((item, index) => (
                  <FormItem key={index} {...item} onChange={handleChange} />
                ))}
              </Box>
              <Box>
                <TableContainer>
                  <Table size="small" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center"></StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.start', '起点')}</StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.end ', '终点')}</StyledTableCell>
                        <StyledTableCell align="left">{t('genericName.chon ', '重叠')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {droppingLevel.map((row, index) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell align="center" sx={{ width: '80px' }}>
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: '140px' }}>
                            <Counter
                              initialValue={row.start}
                              step={1}
                              format={(value) => `${value}.00 %`}
                              onValueChange={(newValue: any) => handleValueChange(index, 'start', newValue)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: '140px' }}>
                            <Counter
                              initialValue={row.end}
                              step={1}
                              format={(value) => `${value}.00 %`}
                              onValueChange={(newValue: any) => handleValueChange(index, 'end', newValue)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="left">{row.chon}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={12} md={5} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>{t('genericName.mixingCurve', '混合曲线')}</Typography>
              )}
            >
              <Box className="sm:max-h100% max-h100% h-full" sx={{ p: '3px' }}>
                <ImagePreview>
                  {previewImageItem ? (
                    <img src={previewImageItem} alt="" className="max-h100% max-w100%"></img>
                  ) : (
                    <Typography sx={{ color: 'text.secondary' }}>
                      {t('digitalInteraction.noPreviewImage', '无可用预览')}
                    </Typography>
                  )}
                </ImagePreview>
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

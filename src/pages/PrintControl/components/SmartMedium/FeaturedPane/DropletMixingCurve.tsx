import React, { useState } from 'react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  TableRow,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  Checkbox,
} from '@mui/material';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useSnackbar } from '@/context/SnackbarContext';

import CusLabelSimple from '@/components/CustomComponents/CusLabelSimple';
import SubCard from '@/components/ContentCard/SubCard';
import AntdInput from '@/components/CustomComponents/CusInput';
import ImagePreview from '@/components/ImagePreview';

const defSX = {
  subTitle: { fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#fff' },
  subCard: {
    marginBottom: '8px',
    height: '100%',
    '&>.MuiPaper-root': { padding: '0 10px', justifyContent: 'center' },
    '.content': { padding: '0' },
    '.content-input': { padding: '0 19px', 'div.MuiBox-root': { padding: 0 } },
  },
};
interface StyledTabProps {
  label: string;
}
const AntTabs = styled(Tabs)({
  minHeight: '30px',
  paddingLeft: '13px',
  '& .MuiTabs-indicator': {},
  '& .MuiTabs-scroller': { height: '30px' },
});
const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  marginRight: theme.spacing(4),
  padding: '5px 0',
  minHeight: '30px',
  color: 'rgba(0, 0, 0, 0.87)',
  fontWeight: 700,
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));
const CusFormControlLabel = styled(FormControlLabel)(() => ({
  position: 'relative',
  margin: '0 -8px 0 0',
  width: '135px',
  '& .MuiSwitch-track': {
    opacity: '1!important',
    backgroundColor: '#d2d2d2!important',
  },
  '& .MuiFormControlLabel-label': {
    position: 'absolute',
    fontWeight: 700,
    left: '32px',
  },
  '& .Mui-checked': {
    transform: 'translateX(97px)!important',
  },
  '&.cus__switch_checked': {
    ' .MuiSwitch-track': {
      backgroundColor: '#4671f5!important',
    },
    '.MuiFormControlLabel-label': {
      color: '#fff',
    },
    '.MuiSwitch-thumb': {
      backgroundColor: '#fff',
    },
  },
}));
const CusSwitch = styled(Switch)(() => ({
  padding: 8,
  width: '100%',
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

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

export default function DropletMixingCurve({ params = {} }: Props) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [setting] = useState<{ key?: string; label?: string }>(params);

  const [value, setValue] = useState(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [previewImageItem] = useState(null);

  const [rows, setRows] = useState([
    { id: 1, name: '墨滴级别1', enable: true, minDensity: 0, maxDensity: 40, inkRestriction: true, inkLimitRate: 100 },
    { id: 2, name: '墨滴级别2', enable: true, minDensity: 30, maxDensity: 20, inkRestriction: true, inkLimitRate: 100 },
  ]);
  const [seniorEditor, setSeniorEditor] = useState([
    { id: 1, input: 90, scale: 80 },
    { id: 2, input: 100, scale: 90 },
  ]);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    if (e) setValue(newValue);
  };
  const handleInputChange = (index: number, key: string, val: any) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setRows(updatedRows);
    showSnackbar({ message: `第${index + 1}行[${key}]的值修改成功[${val}]`, severity: 'success' });
  };
  const handleSeniorChange = (index: number, key: string, val: any) => {
    const updatedRows = [...seniorEditor];
    updatedRows[index] = { ...updatedRows[index], [key]: val };
    setSeniorEditor(updatedRows);
    showSnackbar({ message: `第${index + 1}行[${key}]的值修改成功[${val}]`, severity: 'success' });
  };
  const handleDeleteRow = (index: number) => {
    const updatedRows = [...seniorEditor];
    updatedRows.splice(index, 1);
    setSeniorEditor(updatedRows);
    showSnackbar({ message: `第${index + 1}行删除成功`, severity: 'warning' });
  };
  return (
    <Box className="h-full w-full">
      <CusLabelSimple label={setting.label} />
      <Box className="flex" sx={{ justifyContent: 'space-between' }}>
        <AntTabs value={value} onChange={handleChange}>
          <AntTab label={t('common.black', '黑色')} />
          <AntTab label={t('common.cyan', '青色')} />
          <AntTab label={t('common.pinkish', '品红')} />
          <AntTab label={t('common.yellow', '黄色')} />
        </AntTabs>
        <CusFormControlLabel
          className={`cus__switch ${checked && 'cus__switch_checked'}`}
          control={<CusSwitch checked={checked} onChange={() => setChecked(!checked)} />}
          label="使用高级控件"
        />
      </Box>
      <Box sx={{ height: 'calc(100% - 46px)' }}>
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
          <Grid item xs={12} sm={12} md={5} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => <Typography sx={{ ...defSX.subTitle }}>{t('genericName.editor', '编辑器')}</Typography>}
            >
              <Box
                className="sm:max-h100% max-h100% h-full"
                sx={{
                  p: '3px',
                }}
              >
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
          <Grid item xs={12} sm={12} md={7} className="sm:max-h100% max-h100% h-full">
            <SubCard
              contentClassName="content overflow-y-auto"
              sx={{ ...defSX.subCard }}
              Head={() => (
                <Typography sx={{ ...defSX.subTitle }}>{t('genericName.inkDropletLevel', '墨滴级别')}</Typography>
              )}
            >
              <Box
                sx={{
                  p: '20px 3px',
                }}
              >
                <TableContainer>
                  <Table size="small" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">{t('genericName.name', '名称')}</StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.enable', '启用')}</StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.minDensity', '最小密度')}</StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.maxDensity', '最大密度')}</StyledTableCell>
                        <StyledTableCell align="center">{`${t('genericName.enable', '启用')}${t(
                          'genericName.inkRestriction',
                          '墨水限制',
                        )}`}</StyledTableCell>
                        <StyledTableCell align="center">{t('genericName.inkLimitRate', '墨水限制率')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& .MuiTableCell-body': { padding: '0 6px' } }}>
                      {rows.map((row, index) => (
                        <StyledTableRow key={row.name} sx={{}}>
                          <StyledTableCell align="center" component="th" scope="row">
                            <Box className="flex" sx={{ alignItems: 'center' }}>
                              <Typography
                                sx={{
                                  mr: '5px',
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: `rgba(0,0,0,${0.2 * (index + 1)})`,
                                }}
                              />
                              <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Checkbox
                              color="primary"
                              checked={row.enable}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleInputChange(index, 'enable', event.target.checked)
                              }
                              inputProps={{
                                'aria-labelledby': `enhanced-table-checkbox-${index}`,
                              }}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: '80px' }}>
                            <AntdInput
                              sx={{ input: { textAlign: 'center' } }}
                              size="small"
                              valueType="number"
                              value={row.minDensity}
                              onChange={(val) => handleInputChange(index, 'minDensity', val)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: '80px' }}>
                            <AntdInput
                              sx={{ input: { textAlign: 'center' } }}
                              size="small"
                              valueType="number"
                              value={row.maxDensity}
                              onChange={(val) => handleInputChange(index, 'maxDensity', val)}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Checkbox
                              color="primary"
                              checked={row.inkRestriction}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleInputChange(index, 'inkRestriction', event.target.checked)
                              }
                              inputProps={{
                                'aria-labelledby': `inkRestriction-table-checkbox-${index}`,
                              }}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ width: '40px' }}>
                            <AntdInput
                              sx={{ input: { textAlign: 'center' } }}
                              size="small"
                              valueType="number"
                              value={row.inkLimitRate}
                              onChange={(val) => handleInputChange(index, 'inkLimitRate', val)}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box>
                {checked && (
                  <SubCard
                    contentClassName="content overflow-y-auto"
                    sx={{ ...defSX.subCard, border: 'none' }}
                    Head={() => (
                      <Typography sx={{ ...defSX.subTitle }}>{t('genericName.seniorEditor', '高级编辑')}</Typography>
                    )}
                  >
                    <Box
                      sx={{
                        p: '20px 3px',
                      }}
                    >
                      <TableContainer>
                        <Table size="small" aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="center">{t('genericName.input', '输入')}</StyledTableCell>
                              <StyledTableCell align="center">{t('genericName.scale', '比例')}</StyledTableCell>
                              <StyledTableCell></StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {seniorEditor.map((row, index) => (
                              <StyledTableRow key={row.id} sx={{ height: '30px' }}>
                                <StyledTableCell align="center" sx={{ width: '60px' }}>
                                  <AntdInput
                                    sx={{ input: { textAlign: 'center' } }}
                                    size="small"
                                    valueType="number"
                                    value={row.input}
                                    onChange={(val) => handleSeniorChange(index, 'input', val)}
                                  />
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: '60px' }}>
                                  <AntdInput
                                    sx={{ input: { textAlign: 'center' } }}
                                    size="small"
                                    valueType="number"
                                    value={row.scale}
                                    onChange={(val) => handleSeniorChange(index, 'scale', val)}
                                  />
                                </StyledTableCell>
                                <StyledTableCell sx={{ p: '6px 0' }}>
                                  <DeleteIcon
                                    sx={{ verticalAlign: 'middle', cursor: 'pointer' }}
                                    onClick={() => handleDeleteRow(index)}
                                  ></DeleteIcon>
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </SubCard>
                )}
              </Box>
            </SubCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

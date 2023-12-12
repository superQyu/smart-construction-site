import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { type BoxProps, Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Unstable_Grid2';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { generateRandomId } from '@/utils';
import SimpleModal from '@/components/SimpleModal';
import TimeRangePicker from '@/components/TimeRangePicker';
import LogStatus from '@/components/LogStatus';

export interface Props extends BoxProps {
  open: boolean;
  onClose: () => void;
}
export default function LogDetailModal(props: Props) {
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: t('logDetailModal.table.date', '日期'),
      flex: 2,
      valueGetter: (params) => {
        return dayjs(params.row.startTime).format();
      },
    },
    {
      field: 'status',
      headerName: t('logDetailModal.table.status', '状态'),
      flex: 1,
      renderCell: (params) => {
        return <LogStatus status={params.row.status} />;
      },
    },
    {
      field: 'detail',
      headerName: t('logDetailModal.table.detail', '详情'),
      flex: 4,
    },
  ];

  const rows = [
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'error', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'debug', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'info', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'warning', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'info', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'serious', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'warning', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'warning', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'warning', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
    { date: Date.now(), status: 'warning', detail: 'sdfsdfdsfsdfsdfffffffffffffffffffffffffffsdf' },
  ];

  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={t('LogDetailModal.title', '日志详情')}
      Foot={() => (
        <Box className="flex justify-end">
          <Button variant="contained" sx={{ mr: '0.5rem' }} onClick={props.onClose}>
            {t('logDetailModal.confirm', '确认')}
          </Button>
          <Button variant="outlined" onClick={props.onClose}>
            {t('logDetailModal.cancel', '取消')}
          </Button>
        </Box>
      )}
    >
      <Box className="flex mb2 w-full flex-wrap"></Box>

      <Grid container spacing={2} sx={{ margin: 0, marginBottom: '1rem' }}>
        <Grid sm={6} xs={12} sx={{ paddingLeft: '0' }}>
          <TimeRangePicker />
        </Grid>
        <Grid sm={4} xs={12}>
          <TextField
            className="w-full"
            id="outlined-basic"
            label={t('logDetailModal.keyword', '关键字')}
            variant="outlined"
          />
        </Grid>
        <Grid sm={2} xs={12} className="flex items-center w-full" sx={{ paddingRight: '0' }}>
          <Button variant="contained" sx={{ marginRight: '0.5rem' }} startIcon={<SearchIcon />}>
            {t('logDetailModal.search', '搜索')}
          </Button>
          <Button variant="outlined" startIcon={<RestartAltIcon />}>
            {t('logDetailModal.reset', '重置')}
          </Button>
        </Grid>
      </Grid>

      <Box className="w-full p2 flex flex-wrap" sx={{ backgroundColor: '#eaf2ff' }}>
        <Button
          sx={{ marginRight: '0.5rem', marginBottom: '0.25rem' }}
          variant="contained"
          startIcon={<CleaningServicesIcon />}
          color="primary"
        >
          {t('logDetailModal.cleanLogWindow', '清空日志窗口')}
        </Button>
        <Button
          sx={{ marginRight: '0.5rem', marginBottom: '0.25rem' }}
          variant="contained"
          startIcon={<CleaningServicesIcon />}
          color="primary"
        >
          {t('logDetailModal.cleanLogFile', '清空日志文件')}
        </Button>
        <Button
          sx={{ marginRight: '0.5rem', marginBottom: '0.25rem' }}
          variant="contained"
          startIcon={<SendIcon />}
          color="primary"
        >
          {t('logDetailModal.sendPrintReport', '发送打印报告')}
        </Button>

        <FormControlLabel
          control={<Switch defaultChecked />}
          label={t('logDetailModal.printEngineStatus', '打印引擎状态')}
        />
        <FormControlLabel control={<Switch />} label={t('logDetailModal.ramFeed', 'RAM反馈')} />
      </Box>

      <DataGrid
        getRowId={() => generateRandomId()}
        getRowHeight={() => 'auto'}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '2px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '4px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '6px' },
          '.MuiDataGrid-columnHeaders': {
            backgroundColor: '#e9e9e9',
          },
          '.MuiDataGrid-virtualScroller': {
            height: '50vh',
          },
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15, 25, 40]}
      />
    </SimpleModal>
  );
}

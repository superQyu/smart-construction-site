import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Link,
  type BoxProps,
  type SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import PrintStatus from '@/components/PrintStatus';
import LogDetailModal from './LogDetailModal';
import TimeRangePicker from '@/components/TimeRangePicker';

export interface Props extends BoxProps {}

export default function LogSearchTable(props: Props) {
  const { t } = useTranslation();
  const [level, setLevel] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const handleLevelChange = (event: SelectChangeEvent) => {
    setLevel(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('logSearchTable.table.taskID', '任务ID'), flex: 1 },
    { field: 'outline', headerName: t('logSearchTable.table.taskOutline', '任务概要'), flex: 1 },
    {
      field: 'status',
      headerName: t('logSearchTable.table.taskStatus', '状态'),
      renderCell: (params) => {
        return <PrintStatus status={params.row.status} />;
      },
    },
    {
      field: 'startTime',
      headerName: t('logSearchTable.table.startTime', '开始时间'),
      type: 'number',
      flex: 1,
      valueGetter: (params) => {
        return dayjs(params.row.startTime).format();
      },
    },
    {
      field: 'endTime',
      headerName: t('logSearchTable.table.endTime', '结束时间'),
      sortable: true,
      type: 'number',
      flex: 1,
      valueGetter: (params) => {
        return dayjs(params.row.endTime).format();
      },
    },
    {
      field: 'operator',
      headerName: t('logSearchTable.table.operator', '操作者'),
      flex: 1,
    },
    {
      field: 'log',
      headerName: t('logSearchTable.table.log', '日志'),
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      renderCell: () => {
        return (
          <Link
            className="cursor-pointer"
            underline="none"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            {t('logSearchTable.table.viewLog', '查看日志')}
          </Link>
        );
      },
    },
  ];

  const rows = [
    { id: 1, outline: 'Snow', operator: 'Jon', startTime: Date.now(), endTime: Date.now(), log: '', status: 'success' },
    {
      id: 2,
      outline: 'Lannister',
      operator: 'Cersei',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'terminate',
    },
    {
      id: 3,
      outline: 'Lannister',
      operator: 'Jaime',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'error',
    },
    { id: 4, outline: 'Stark', operator: 'Arya', startTime: Date.now(), endTime: Date.now(), log: '', status: 'pause' },
    {
      id: 5,
      outline: 'Targaryen',
      operator: 'Daenerys',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'pause',
    },
    {
      id: 6,
      outline: 'Melisandre',
      operator: null,
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'error',
    },
    {
      id: 7,
      outline: 'Clifford',
      operator: 'Ferrara',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'success',
    },
    {
      id: 8,
      outline: 'Frances',
      operator: 'Rossini',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'terminate',
    },
    {
      id: 9,
      outline: 'Roxie',
      operator: 'Harvey',
      startTime: Date.now(),
      endTime: Date.now(),
      log: '',
      status: 'success',
    },
  ];

  return (
    <Box {...props} className={`flex flex-col ${props.className || ''}`}>
      <Grid container spacing={2} sx={{ margin: 0, marginBottom: '1rem' }}>
        <Grid sm={3} xs={12} sx={{ paddingLeft: '0' }}>
          <TimeRangePicker />
        </Grid>
        <Grid sm={3} xs={12}>
          <FormControl className="w-full">
            <InputLabel id="demo-simple-select-helper-label">{t('logSearchTable.level', '级别')}</InputLabel>
            <Select
              value={level}
              onChange={handleLevelChange}
              label={t('logSearchTable.level', '级别')}
              labelId="demo-simple-select-helper-label"
            >
              <MenuItem value={0}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid sm={3} xs={12}>
          <TextField
            className="w-full"
            id="outlined-basic"
            label={t('logSearchTable.operator', '操作人员')}
            variant="outlined"
          />
        </Grid>
        <Grid sm={3} xs={12} className="flex items-center w-full" sx={{ paddingRight: '0' }}>
          <Button variant="contained" sx={{ marginRight: '0.5rem' }} startIcon={<SearchIcon />}>
            {t('logSearchTable.search', '搜索')}
          </Button>
          <Button variant="outlined" startIcon={<RestartAltIcon />}>
            {t('logSearchTable.reset', '重置')}
          </Button>
        </Grid>
      </Grid>

      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
          '.MuiDataGrid-columnHeaders': {
            backgroundColor: '#e9e9e9',
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

      <LogDetailModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
}

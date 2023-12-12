import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type BoxProps, Box, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import apis from '@/apis';
import { NetworkAdapterInfo } from '@/apis/systemApi';
import { useMeteorConfigContext } from '@/context/MeteorConfigContext';
import { usePdcSettingsContext } from '@/context/PDCSettings';
import SimpleModal from '@/components/SimpleModal';

export interface Props extends BoxProps {
  open: boolean;
  onClose: () => void;
}

export default function NetworkAdaptorModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [networkAdapterTable, setOpenNetworkAdapterTable] = useState<NetworkAdapterInfo[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { config } = useMeteorConfigContext();
  const [pdcSettingCtx, setPdcSettingsCtx] = usePdcSettingsContext();
  const [defaultSelectedRows, setDefaultSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (config) {
      const localSelectedRows = [];
      for (const key of Object.keys(config?.Ethernet || {})) {
        if (/Adapter\d+/.test(key)) {
          localSelectedRows.push(config.Ethernet[key]);
        }
      }
      setDefaultSelectedRows(localSelectedRows);
      setSelectedRows(pdcSettingCtx.systemSetting?.networkAdapter || localSelectedRows);
    }
  }, [config]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('pdcSettings.networkAdaptor.table.name', '适配器名称'), minWidth: 200 },
    { field: 'description', headerName: t('pdcSettings.networkAdaptor.table.description', '描述'), minWidth: 200 },
    { field: 'type', headerName: t('pdcSettings.networkAdaptor.table.type', '类型'), minWidth: 100 },
    {
      field: 'status',
      headerName: t('pdcSettings.networkAdaptor.table.status', '状态'),
      minWidth: 100,
    },
    {
      field: 'unit',
      headerName: t('pdcSettings.networkAdaptor.table.unit', '兆位/秒'),
      valueGetter: (params: GridValueGetterParams) => `${params.row.unit || 0}`,
      minWidth: 100,
    },
    {
      field: 'iPv4',
      headerName: t('pdcSettings.networkAdaptor.table.ipv4Address', 'IPv4地址'),
      minWidth: 100,
    },
    {
      field: 'mask',
      headerName: t('pdcSettings.networkAdaptor.table.mask', '子网络'),
      minWidth: 100,
    },
  ];

  useEffect(() => {
    initNetworkAdapter();
  }, []);

  const handleSelectRows = (rows: any[]) => {
    setSelectedRows(rows as string[]);
  };

  const handleConfirm = () => {
    setPdcSettingsCtx((prev) => {
      return {
        ...prev,
        systemSetting: {
          ...prev.systemSetting,
          networkAdapter: selectedRows,
        },
      };
    });

    onClose();
  };

  const initNetworkAdapter = async () => {
    apis.systemApi.listNetworkAdapter().then((res) => {
      setOpenNetworkAdapterTable(res);
    });
  };

  const computedTable = useMemo(() => {
    const unknownAdapter = defaultSelectedRows.filter((item) => !networkAdapterTable.map((i) => i.name).includes(item));

    return [
      ...networkAdapterTable,
      ...unknownAdapter.map((name) => {
        return {
          name,
          description: '',
          type: 'Unknown',
          status: 'Not Found',
          unit: 0,
          iPv4: '',
          mask: '',
        };
      }),
    ];
  }, [defaultSelectedRows, networkAdapterTable]);
  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={t('pdcSettings.networkAdaptor.ModalTitle', '选择meteor网络适配器')}
      Foot={() => (
        <Box className="flex justify-end">
          <Button variant="contained" sx={{ mr: '0.5rem' }} onClick={handleConfirm}>
            {t('logDetailModal.confirm', '确认')}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {t('logDetailModal.cancel', '取消')}
          </Button>
        </Box>
      )}
    >
      <DataGrid
        onRowSelectionModelChange={handleSelectRows}
        rowSelectionModel={[...selectedRows]}
        density="compact"
        rows={computedTable}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        getRowId={(row) => row.name}
      />
    </SimpleModal>
  );
}

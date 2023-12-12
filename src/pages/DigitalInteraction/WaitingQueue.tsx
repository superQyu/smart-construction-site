import { type HTMLProps, useState, useContext, useEffect, type BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Box, Button, Checkbox } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { readBinaryFile } from '@tauri-apps/api/fs';

import { PrintItemContext, CurrentPrintItemContext, UploadPrintItemContext } from '@/context/digitalInteractionContext';
import CustomCard from '@/components/CustomCard';
import DraggablePrintItemList from '@/components/DraggablePrintItemList';
import type { PrintItemItf } from '@/types';
import apis from '@/apis';
import { useSnackbar } from '@/context/SnackbarContext';

export interface Props extends HTMLProps<HTMLElement> {
  printList: PrintItemItf[];
  // eslint-disable-next-line no-unused-vars
  onPrintListChange: (printList: PrintItemItf[] | ((pre: PrintItemItf[]) => PrintItemItf[])) => void;
}

export default function WaitingQueue({ printList, onPrintListChange, ...props }: Props) {
  const { t } = useTranslation();
  const results = useContext(PrintItemContext);
  const setPrintItem = useContext(CurrentPrintItemContext)[1];
  const setUploadPrintItemList = useContext(UploadPrintItemContext)[1];
  const { showSnackbar } = useSnackbar();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    onPrintListChange([...(results || []), ...printList]);

    results?.map(async (item) => {
      if (item.path) {
        apis.printerJob.uploadPrintJob(item.imageName, new Blob([await readBinaryFile(item.path)])).then(() => {});
      }
    });
  }, [results]);

  useEffect(() => {
    setChecked(printList.length > 0 && printList.every((item) => item.checked));
  }, [printList]);

  const handleListItemClick = (item: PrintItemItf) => {
    setPrintItem({ ...item, from: 'waiting' });
  };

  const handleCheckChange = (_: unknown, checked: boolean) => {
    setChecked(checked);
    if (printList.length > 0) {
      onPrintListChange(printList.map((item) => ({ ...item, checked })));
    }
  };

  const handleDelete = (event: BaseSyntheticEvent, item: PrintItemItf) => {
    event.preventDefault();
    event.stopPropagation();
    apis.printerJob.deletePrintJob(item.imageName).then(() => {
      onPrintListChange(printList.filter((data) => data.id !== item.id));
    });
  };

  const handleUpload = (_: BaseSyntheticEvent | undefined, item: PrintItemItf) => {
    apis.printerJob.prePrintJob(item.imageName).then(
      () => {
        onPrintListChange(printList.filter((data) => data.id !== item.id));
        setUploadPrintItemList([item]);
      },
      (err) => {
        showSnackbar({
          message: `${item.imageName}: ${err.message}`,
          severity: 'error',
        });
      },
    );
  };

  const handleUploadAll = () => {
    printList.filter((item) => item.checked).map((item) => handleUpload(undefined, item));
  };

  return (
    <CustomCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => (
        <Box className="flex justify-between w-full items-center">
          <Box className="flex">
            <HourglassBottomIcon sx={{ color: 'primary.main' }} className="mr2" />
            <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.waitingQueue', '等待队列')}</Typography>
          </Box>
          <Box>
            <Checkbox
              indeterminate={printList.some((item) => item.checked) && printList.some((item) => !item.checked)}
              checked={checked}
              onChange={handleCheckChange}
            ></Checkbox>
            <Button size="small" variant="contained" sx={{ height: '22px' }} onClick={handleUploadAll}>
              {t('waitingQueue.oneKeyUpload', '一键上传')}
            </Button>
          </Box>
        </Box>
      )}
    >
      <DraggablePrintItemList
        inputList={printList}
        onListChange={onPrintListChange}
        isEdit
        droppableId="waiting-queue-droppable"
        onListItemClick={handleListItemClick}
        onListItemDelete={handleDelete}
        onListItemUpload={handleUpload}
        isShowCheckbox={true}
      />
    </CustomCard>
  );
}

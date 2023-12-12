import { useContext, useEffect, type HTMLProps, type BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import PrintIcon from '@mui/icons-material/Print';
import { Typography } from '@mui/material';

import {
  CurrentPrintItemContext,
  UploadPrintItemContext,
  FinishPrintItemContext,
} from '@/context/digitalInteractionContext';
import CustomCard from '@/components/CustomCard';
import DraggablePrintItemList from '@/components/DraggablePrintItemList';
import type { PrintItemItf } from '@/types';

import apis from '@/apis';

export interface Props extends HTMLProps<HTMLElement> {
  printList: PrintItemItf[];
  // eslint-disable-next-line no-unused-vars
  onPrintListChange: (printList: PrintItemItf[] | ((pre: PrintItemItf[]) => PrintItemItf[])) => void;
}

export default function PrintQueue(props: Props) {
  const { t } = useTranslation();
  const setPrintItem = useContext(CurrentPrintItemContext)[1];
  const uploadPrintItemList = useContext(UploadPrintItemContext)[0];
  const setFinishedPrintItemList = useContext(FinishPrintItemContext)[1];

  useEffect(() => {
    if (uploadPrintItemList && uploadPrintItemList.length > 0) {
      props.onPrintListChange([...uploadPrintItemList, ...props.printList]);
    }
  }, [uploadPrintItemList]);

  const handleDelete = (event: BaseSyntheticEvent, item: PrintItemItf) => {
    event.preventDefault();
    event.stopPropagation();
    apis.printerJob.deletePrintJob(item.imageName).then(() => {
      props.onPrintListChange(props.printList.filter((data) => data.id !== item.id));
    });
  };

  const handleFinished = (item: PrintItemItf) => {
    props.onPrintListChange(props.printList.filter((data) => data.id !== item.id));
    setFinishedPrintItemList([item]);
  };

  const handleStart = (item: PrintItemItf) => {
    apis.printerJob
      .startPrintJob(item.imageName)
      .then(() => {
        props.onPrintListChange((prev: PrintItemItf[]) => {
          const idx = prev.findIndex((data) => data.id === item.id);
          if (idx <= -1) {
            return prev;
          }
          prev[idx] = {
            ...prev[idx],
            status: 'finished',
          };
          return [...prev];
        });
      })
      .catch(() => {
        props.onPrintListChange((prev: PrintItemItf[]) => {
          const idx = prev.findIndex((data) => data.id === item.id);
          if (idx <= -1) {
            return prev;
          }
          prev[idx] = {
            ...prev[idx],
            status: 'failed',
          };
          return [...prev];
        });
      });
  };

  return (
    <CustomCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => (
        <>
          <PrintIcon sx={{ color: 'primary.main' }} className="mr2" />
          <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.printQueue', '打印队列')}</Typography>
        </>
      )}
    >
      <DraggablePrintItemList
        droppableId="print-queue-droppable"
        inputList={props.printList}
        onListChange={props.onPrintListChange}
        onListItemClick={(item) => setPrintItem({ ...item, from: 'printing' })}
        onListItemDelete={handleDelete}
        onListItemFinished={handleFinished}
        onListItemStart={handleStart}
      />
    </CustomCard>
  );
}

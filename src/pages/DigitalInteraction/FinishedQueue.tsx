import { type HTMLProps, useContext, useEffect, type BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import apis from '@/apis';
import { FinishPrintItemContext, CurrentPrintItemContext } from '@/context/digitalInteractionContext';
import CustomCard from '@/components/CustomCard';
import DraggablePrintItemList from '@/components/DraggablePrintItemList';
import type { PrintItemItf } from '@/types';

export interface Props extends HTMLProps<HTMLElement> {
  printList: PrintItemItf[];
  // eslint-disable-next-line no-unused-vars
  onPrintListChange: (printList: PrintItemItf[] | ((pre: PrintItemItf[]) => PrintItemItf[])) => void;
}

export default function FinishedQueue({ printList, onPrintListChange, ...props }: Props) {
  const { t } = useTranslation();
  const finishedPrintItemList = useContext(FinishPrintItemContext)[0];
  const setPrintItem = useContext(CurrentPrintItemContext)[1];

  useEffect(() => {
    onPrintListChange([...printList, ...(finishedPrintItemList || [])]);
  }, [finishedPrintItemList]);

  const handleDelete = (_: BaseSyntheticEvent, item: PrintItemItf) => {
    apis.printerJob.deletePrintJob(item.imageName).then(() => {
      onPrintListChange(printList.filter((data) => data.id !== item.id));
    });
  };

  return (
    <CustomCard
      {...props}
      contentClassName="overflow-y-auto"
      Head={() => (
        <>
          <CheckCircleOutlineIcon sx={{ color: 'primary.main' }} className="mr2" />
          <Typography sx={{ fontWeight: 700 }}>{t('digitalInteraction.printFinished', '打印完成')}</Typography>
        </>
      )}
    >
      <DraggablePrintItemList
        droppableId="finished-queue-droppable"
        inputList={printList}
        onListChange={onPrintListChange}
        isFinished
        onListItemDelete={handleDelete}
        onListItemClick={(item) => setPrintItem({ ...item, from: 'finished' })}
      />
    </CustomCard>
  );
}

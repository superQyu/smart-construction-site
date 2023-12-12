import { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';

import {
  PrintItemContext,
  CurrentPrintItemContext,
  UploadPrintItemContext,
  FinishPrintItemContext,
} from '@/context/digitalInteractionContext';
import PrintQueue from './PrintQueue';
import AddImage from './AddImage';
// import PccStatus from './PccStatus';
import PrintHeadInfo from './PrintHeadInfo';
import WaitingQueue from './WaitingQueue';
import FinishedQueue from './FinishedQueue';
import PrintPreview from './PrintPreview';
// import LogInfo from './LogInfo';
import type { PrintItemItf } from '@/types';
import PrinterSystemStatus from './PrinterSystemStatus';
import ImageInfo from './ImageInfo';
import { reorder, reorderMixed, generateRandomId } from '@/utils';
import apis from '@/apis';

export default function DigitalInteraction() {
  const [printItemList, setPrintItemList] = useState<PrintItemItf[] | undefined>(undefined);
  const [printItem, setPrintItem] = useState<PrintItemItf>();
  const [uploadPrintItemList, setUploadPrintItemList] = useState<PrintItemItf[]>();
  const [FinishedPrintItemList, setFinishedPrintItemList] = useState<PrintItemItf[]>();

  const [printQueueList, setPrintQueueList] = useState<PrintItemItf[]>([]);
  const [waitQueueList, setWaitQueueList] = useState<PrintItemItf[]>([]);
  const [finishedQueueList, setFinishedQueueList] = useState<PrintItemItf[]>([]);
  const baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    apis.printerJob.queryPrintJob().then(async (resp) => {
      setWaitQueueList(
        resp.backlogJobs.map(
          (item: any) =>
            ({
              id: generateRandomId(),
              imageName: item.name,
              num: 1,
              imageSrc: `${baseURL}/files/Backlog/${item.name}`,
              path: `${baseURL}/files/Backlog/${item.name}`,
            }) as PrintItemItf,
        ),
      );

      setPrintQueueList(
        resp.waitingJobs.map(
          (item: any) =>
            ({
              id: generateRandomId(),
              imageName: item.name,
              num: 1,
              imageSrc: `${baseURL}/files/Waiting/${item.name}`,
              path: `${baseURL}/files/Waiting/${item.name}`,
            }) as PrintItemItf,
        ),
      );

      setFinishedQueueList(
        resp.finished.map(
          (item: any) =>
            ({
              id: generateRandomId(),
              imageName: item.name,
              num: 1,
              imageSrc: `${baseURL}/files/Finished/${item.name}`,
              path: `${baseURL}/files/Finished/${item.name}`,
            }) as PrintItemItf,
        ),
      );
    });
  }, []);

  const onAddImage = (data: PrintItemItf[]) => {
    setPrintItemList(data);
  };

  const handleDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId === result.source.droppableId) {
      if (result.destination.droppableId.includes('print')) {
        setPrintQueueList(reorder<PrintItemItf>(printQueueList, result.source.index, result.destination.index));
      }

      if (result.destination.droppableId.includes('wait')) {
        setWaitQueueList(reorder<PrintItemItf>(waitQueueList, result.source.index, result.destination.index));
      }

      if (result.destination.droppableId.includes('finished')) {
        setFinishedQueueList(reorder<PrintItemItf>(finishedQueueList, result.source.index, result.destination.index));
      }

      return;
    }

    // finished -> wait
    if (result.source.droppableId.includes('finished') && result.destination.droppableId.includes('wait')) {
      const [res1, res2] = reorderMixed(
        finishedQueueList,
        waitQueueList,
        result.source.index,
        result.destination.index,
      );
      setFinishedQueueList(res1);
      setWaitQueueList(res2);

      apis.printerJob
        .moveQueue({
          srcQueue: 'Finished',
          dstQueue: 'Backlog',
          file: finishedQueueList[result.source.index].imageName,
        })
        .then(() => {})
        .catch(() => {});
    }

    // finished -> print
    if (result.source.droppableId.includes('finished') && result.destination.droppableId.includes('print')) {
      apis.printerJob.prePrintJob(waitQueueList[result.source.index].imageName).then(() => {
        if (result.destination) {
          const [res1, res2] = reorderMixed(
            finishedQueueList,
            printQueueList,
            result.source.index,
            result.destination.index,
          );
          setFinishedQueueList(res1);
          setPrintQueueList(res2);
        }
      });
    }

    // wait -> print
    if (result.source.droppableId.includes('wait') && result.destination.droppableId.includes('print')) {
      apis.printerJob.prePrintJob(waitQueueList[result.source.index].imageName).then(() => {
        if (result.destination) {
          const [res1, res2] = reorderMixed(
            waitQueueList,
            printQueueList,
            result.source.index,
            result.destination?.index,
          );
          setWaitQueueList(res1);
          setPrintQueueList(res2);
        }
      });
    }
  };

  const handleDragStart = (): void => {};

  return (
    <PrintItemContext.Provider value={printItemList}>
      <CurrentPrintItemContext.Provider value={[printItem, setPrintItem]}>
        <UploadPrintItemContext.Provider value={[uploadPrintItemList, setUploadPrintItemList]}>
          <FinishPrintItemContext.Provider value={[FinishedPrintItemList, setFinishedPrintItemList]}>
            <Paper elevation={0} sx={{ backgroundColor: '#f8f9fd', height: '100%' }} className="p2 flex flex-col">
              <Grid container spacing={0.5} className="h-full flex-1 lg:max-h[calc(100vh-136px)]" sx={{ margin: 0 }}>
                <Grid xs={12} sm={12} md={3} className="flex flex-col max-h100vh lg:max-h-inherit">
                  <AddImage className="flex-basis-15% mb1 max-h15%" onAdd={onAddImage} />
                  <PrinterSystemStatus className="flex-basis-23% mb1 max-h23%" />
                  <PrintHeadInfo className="flex-basis-62% max-h62%" />
                </Grid>
                <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                  <Grid xs={12} sm={12} md={6} className="flex flex-col max-h100vh lg:max-h-inherit">
                    <PrintQueue
                      printList={printQueueList}
                      onPrintListChange={setPrintQueueList}
                      className="flex-basis-50% max-h50% mb1"
                    />
                    <Grid container className="flex-basis-50% max-h50%" columns={12} spacing={0.5}>
                      <Grid xs={12} sm={6} md={6} className="sm:max-h100% max-h50% h-full">
                        <WaitingQueue
                          printList={waitQueueList}
                          onPrintListChange={setWaitQueueList}
                          className="h-full w-full max-h100%"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={6} className="sm:max-h100% max-h50% h-full">
                        <FinishedQueue
                          printList={finishedQueueList}
                          onPrintListChange={setFinishedQueueList}
                          className="h-full w-full max-h100%"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </DragDropContext>
                <Grid xs={12} sm={12} md={3} className="flex flex-col max-h100vh lg:max-h-inherit">
                  <PrintPreview className="flex-basis-60% max-h60%" />
                  <ImageInfo sx={{ marginTop: '5px' }} className="flex-basis-40% max-h40%"></ImageInfo>
                  {/* <LogInfo sx={{ marginTop: '5px' }} className="flex-basis-60% max-h60%" /> */}
                </Grid>
              </Grid>
            </Paper>
          </FinishPrintItemContext.Provider>
        </UploadPrintItemContext.Provider>
      </CurrentPrintItemContext.Provider>
    </PrintItemContext.Provider>
  );
}

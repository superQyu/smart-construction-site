import { type HTMLProps, useState, type ReactNode, type BaseSyntheticEvent } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { List, ListItem } from '@mui/material';

import PrintItem from './PrintItem';
import StrictModeDroppable from './StrictModeDroppable';
import type { PrintItemItf } from '@/types';

export interface Props extends HTMLProps<HTMLElement> {
  inputList: PrintItemItf[];
  children?: ReactNode;
  isEdit?: boolean;
  isFinished?: boolean;
  droppableId?: string;
  isShowCheckbox?: boolean;
  // eslint-disable-next-line no-unused-vars
  onListChange: (list: PrintItemItf[] | ((pre: PrintItemItf[]) => PrintItemItf[])) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemClick?: (data: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemDelete?: (event: BaseSyntheticEvent, item: PrintItemItf, idx: number) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemUpload?: (event: BaseSyntheticEvent, item: PrintItemItf, idx: number) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemFinished?: (data: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemStart?: (data: PrintItemItf) => void;
  // eslint-disable-next-line no-unused-vars
  onListItemStop?: (data: PrintItemItf) => void;
}

export default function DraggableList(props: Props) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleSelected = (id: string) => {
    setSelectedId(id);
  };

  const handleClick = (item: PrintItemItf) => {
    handleSelected(item.id);
    // set current preview print item
    props.onListItemClick?.(item);
  };

  const handlePrintItemChange = (idx: number, item: PrintItemItf) => {
    props.onListChange((prev) => [...prev.slice(0, idx), item, ...prev.slice(idx + 1)]);
  };

  return (
    <StrictModeDroppable droppableId={props.droppableId || 'droppable'}>
      {(provided) => (
        <List
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            paddingX: '8px',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            li: {
              display: 'inline-block',
            },
          }}
        >
          {props.inputList
            // there may be a bug during user interaction, so need filter the undefined value
            .filter((item) => !!item && !!item.id)
            .map((item: PrintItemItf, idx: number) => (
              <Draggable draggableId={item.id} key={item.id} index={idx}>
                {(provided, snapshot) => (
                  <ListItem
                    sx={{
                      backgroundColor: snapshot.isDragging || selectedId === item.id ? '#dae9ff' : '',
                      ...provided.draggableProps.style,
                    }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    divider
                    onClick={() => handleClick(item)}
                  >
                    <PrintItem
                      isShowCheckBox={props.isShowCheckbox}
                      item={item}
                      isEdit={props.isEdit}
                      isFinished={props.isFinished}
                      className="flex-1"
                      onChanged={(data) => handlePrintItemChange(idx, data)}
                      onUpload={(event, item) => props.onListItemUpload?.(event, item, idx)}
                      onDelete={(event, item) => props.onListItemDelete?.(event, item, idx)}
                      onFinished={(data) => props.onListItemFinished?.(data)}
                      onStartJob={(data) => props.onListItemStart?.(data)}
                      onStopJob={(data) => props.onListItemStop?.(data)}
                    />
                  </ListItem>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </List>
      )}
    </StrictModeDroppable>
  );
}

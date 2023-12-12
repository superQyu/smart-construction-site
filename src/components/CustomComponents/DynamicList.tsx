import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useSnackbar } from '@/context/SnackbarContext';

import CusButton from '@/components/CustomComponents/CusButton';

export type ItemComponent = {
  value: string;
  index: number;
  editable?: boolean;
  onChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void;
};

export type DynamicInputListProps = {
  items: string[]; // 初始项数组
  onItemsChange?: (value: string, index: number, newItems: string[]) => void; // 当项数组发生变化时的回调函数
  onInputBlur?: (value: string, index: number) => void; // 输入框失去焦点的回调函数
  handleRemoveItem?: (index: number, newItems: string[]) => void; // 删除项操作回调函数
  ItemComponent: React.ComponentType<ItemComponent>; // 自定义项组件
  showFooter?: boolean | React.ReactNode | (() => React.ReactNode); // 是否需要底部按钮或自定义底部组件
  editable?: boolean; // 添加 editable 属性
};

const DynamicInputList: React.FC<DynamicInputListProps> = ({
  items,
  onItemsChange,
  onInputBlur,
  handleRemoveItem,
  ItemComponent,
  showFooter = true,
  editable = false,
}) => {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [state, setState] = useState(['']);

  // 添加项
  const addItem = () => {
    const newItems = [...state, ''];
    setState(newItems);
  };

  // 删除项
  const removeItem = (index: number) => {
    const newItems = [...state];
    newItems.splice(index, 1);
    setState(newItems);
    handleRemoveItem && handleRemoveItem(index, newItems);
  };

  // 更新项的值
  const updateItemValue = (value: string, index: number) => {
    const newItems = [...state];
    // 判断值是否已经存在
    if (value.trim() === '') {
      showSnackbar({ message: t('genericName.emptyValue', '值不能为空'), severity: 'warning' });
      newItems[index] = state[index]; // 恢复为上次输入的值
      setState(newItems);
      return;
    }
    // 判断值是否已经存在
    // if (newItems.includes(value)) {
    //   showSnackbar({ message: t('genericName.itemExists', '该项已存在'), severity: 'warning' });
    //   return;
    // }

    newItems[index] = value;
    setState(newItems);
    onItemsChange && onItemsChange(value, index, newItems);
  };

  useEffect(() => {
    setState(items);
  }, [items]);

  return (
    <>
      <Box className="content-inner overflow-y-auto" sx={{ width: '100%', padding: '5px', height: '160px' }}>
        {state.map((item, index) => (
          <Box key={index} display="flex" alignItems="flex-start" mb={0.5} sx={{ width: '100%' }}>
            <ItemComponent
              value={item}
              index={index}
              editable={editable}
              onChange={(newValue: string) => updateItemValue(newValue, index)}
              onBlur={(e) => onInputBlur && onInputBlur(e.target.value, index)}
            />
          </Box>
        ))}
      </Box>

      {showFooter !== false &&
        (typeof showFooter === 'function' ? (
          showFooter()
        ) : React.isValidElement(showFooter) ? (
          showFooter
        ) : (
          <Box className="flex" sx={{ padding: '5px 10px', justifyContent: 'space-between' }}>
            <CusButton onClick={addItem}>{t('genericName.add', '添加')}</CusButton>
            <CusButton
              disabled={state.length === 0}
              onClick={() => removeItem(state.length - 1)}
              sx={{ backgroundColor: '#dfe0e3', color: '#4b4b4d' }}
            >
              {t('genericName.delete', '删除')}
            </CusButton>
          </Box>
        ))}
    </>
  );
};

export default DynamicInputList;

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface CounterProps {
  initialValue: number;
  step: number;
  format?: (value: number) => string;
  onValueChange?: (value: number) => void;
  prelabel?: string;
  suflabel?: string;
  minValue?: number; // 新增minValue属性
  maxValue?: number; // 新增maxValue属性
  sx?: {};
}
// 自定义方法，处理浮点数相加
const addFloat = (num1: number, num2: number) => {
  const precision = Math.max(getPrecision(num1), getPrecision(num2));
  const multiplier = Math.pow(10, precision);
  return (Math.round(num1 * multiplier) + Math.round(num2 * multiplier)) / multiplier;
};

// 自定义方法，获取浮点数的精度
const getPrecision = (num: number) => {
  const str = String(num);
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
};
const Counter: React.FC<CounterProps> = ({
  initialValue,
  step = 1,
  format,
  onValueChange,
  prelabel,
  suflabel,
  minValue = 0,
  maxValue,
  sx,
}) => {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newValue = addFloat(count, step);
    if (maxValue !== undefined && newValue > maxValue) return; // 如果超过最大值，则不更新数值
    setCount(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = addFloat(count, -step);
    if (minValue !== undefined && newValue < minValue) return; // 如果小于最小值，则不更新数值
    setCount(newValue);
    if (onValueChange) onValueChange(newValue);
  };
  useEffect(() => {
    setCount(initialValue);
  }, [initialValue]);
  return (
    <Box
      className="flex items-center w-full"
      sx={{
        button: {
          width: '23px',
          height: '22px',
          minWidth: 'inherit',
          backgroundColor: '#648aff',
          border: '1px solid #c3c3c3',
          borderRadius: '0px',
          svg: { fill: '#fff' },
          '&:hover': {
            backgroundColor: 'rgba(100,138,255,0.85)',
          },
        },
        ...sx,
      }}
    >
      {prelabel && (
        <Typography
          sx={{
            fontWeight: 500,
            paddingRight: '10px',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            minWidth: '25px',
          }}
        >
          {prelabel}
        </Typography>
      )}

      <Button onClick={handleDecrement}>
        <RemoveCircleOutlineIcon />
      </Button>
      <Typography
        className="counter-text"
        sx={{
          width: '35%',
          fontWeight: 500,
          textAlign: 'center',
          padding: '4px 14px 4px 5px',
          lineHeight: '10px',
          borderTop: '1px solid #648aff',
          borderBottom: '1px solid #648aff',
          whiteSpace: 'nowrap',
        }}
      >
        {format ? format(count) : count}
      </Typography>

      <Button onClick={handleIncrement}>
        <AddCircleOutlineIcon />
      </Button>

      {suflabel && (
        <Typography
          sx={{
            fontWeight: 500,
            marginLeft: '5px',
          }}
        >
          {suflabel}
        </Typography>
      )}
    </Box>
  );
};

export default Counter;

import React, { ChangeEvent, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Checkbox,
  SelectChangeEvent,
  Radio,
  BoxProps,
} from '@mui/material';

export interface formItemProps extends Omit<BoxProps, 'onChange'> {
  label: string;
  type?: 'select' | 'input' | 'checkbox' | 'text' | 'radio'; // 支持其他表单控件类型，可自行扩展
  options?: { label: string; value: string | number }[];
  itemkey: string;
  value: string | boolean | undefined;
  onChange?: (key: string, newValue: string | boolean | undefined) => void;
  style?: { [key: string]: any };
  disabled?: boolean;
  suffix?: string;
  customComponent?: React.ReactNode; // 自定义组件
  showTypography?: boolean; // 是否显示Typography
  isGroupItem?: boolean;
}

const defSX = {
  box: {
    alignItems: 'center',
    mt: '18px',
    '&.item__suffix': { '&>.MuiFormControl-root': { flexDirection: 'inherit' }, '.suffix_box': { ml: '10px' } },
    '& .item__content__checkbox': {
      pl: '10px',
      ml: '-10px',
      width: 'initial'
    },
  },
  itemTitle: { alignItems: 'center', fontWeight: 700, minWidth: '80px', mr: '15px', whiteSpace: 'nowrap' },
  formControl: { m: 1, minWidth: 120, margin: 0, width: '100%', overflow: 'hidden' },
  input: { '& input': { padding: '7px 14px' }, '& label': { top: '-8px' } },
  checkbox: {
    '.MuiFormControlLabel-label': { fontWeight: 500 },
    svg: { fill: '#648aff' },
  },
  select: { '& .MuiSelect-select': { padding: '7px 14px' } },
};

const FormItem = ({
  label,
  type = 'input',
  disabled = false,
  itemkey,
  value,
  onChange,
  options = [],
  style = {},
  suffix = '',
  customComponent,
  showTypography = true,
  isGroupItem,
  ...restProps
}: formItemProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    let val;
    if (type === 'select') {
      val = e.target.value as string;
    } else if (type === 'checkbox' || type === 'radio') {
      val = (e.target as HTMLInputElement).checked;
    } else {
      val = e.target.value;
    }
    setCurrentValue(val);
    if (type !== 'radio') onChange && onChange(itemkey, val);
  };

  const handleRadioClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentValue(!(e.target as HTMLInputElement).checked);
    onChange && onChange(itemkey, currentValue);
  };

  return (
    <Box className={`flex item__box ${suffix && 'item__suffix'}`} sx={{ ...defSX.box, ...restProps.sx }}>
      {showTypography && type !== 'checkbox' && type !== 'radio' && (
        <Typography className="flex item__label" sx={{ ...defSX.itemTitle, ...(style['label'] || {}) }}>
          {label}
        </Typography>
      )}
      <FormControl
        className={`item__content__${type}`}
        sx={{ ...defSX.formControl, ...(style['formItem'] || {}), borderRadius: 0 }}
      >
        {type === 'select' ? (
          <Select
            className="item__select"
            disabled={disabled}
            value={typeof currentValue === 'boolean' ? currentValue.toString() : currentValue}
            onChange={handleChange}
            sx={{ ...defSX.select, ...(style['select'] || {}) }}
          >
            {options.map(({ label, value }, index) => (
              <MenuItem key={index} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        ) : type === 'text' ? (
          <Typography className="item__text">{currentValue}</Typography>
        ) : type === 'checkbox' ? (
          <FormControlLabel
            className="item__checkbox"
            disabled={disabled}
            control={<Checkbox checked={!!currentValue} onChange={handleChange} />}
            label={label}
            sx={{ ...defSX.checkbox, display: 'flex' }}
          />
        ) : type === 'radio' ? (
          <FormControlLabel
            className="item__radio"
            disabled={disabled}
            value={isGroupItem ? currentValue : undefined}
            control={
              <Radio
                {...(isGroupItem ? {} : { checked: !!currentValue, onChange: handleChange, onClick: handleRadioClick })}
              />
            }
            label={label}
            sx={{ ...defSX.checkbox, display: 'flex' }}
          />
        ) : customComponent ? ( // 显示自定义组件
          customComponent
        ) : (
          <TextField
            className="item__input"
            name={itemkey}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            sx={{ ...defSX.input, ...(style['input'] || {}) }}
          />
        )}
        {suffix && suffix != '' ? (
          <Typography className="suffix_box flex" sx={{ alignItems: 'center' }}>
            {suffix}
          </Typography>
        ) : (
          ''
        )}
      </FormControl>
    </Box>
  );
};

export default FormItem;

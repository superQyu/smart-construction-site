import React from 'react';
import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';

export type checkboxItem = {
  label: string;
  value: string | boolean | undefined;
  style?: { [key: string]: any };
  disabled?: boolean;
};

export type checkboxItemProps = {
  options?: checkboxItem[];
  onChange?: (newValue: string | boolean | undefined) => void;
};
const ControlledCheckboxesGroup = ({ onChange, options = [] }: checkboxItemProps) => {
  const defaultVal = options[0]?.value;
  const [value, setValue] = React.useState(defaultVal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (value !== newValue) {
      setValue(newValue);
      onChange && onChange(newValue);
    }
  };

  return (
    <FormGroup>
      {options.map((item, index) => (
        <FormControlLabel
          className="cus__checkbox"
          key={index}
          control={
            <Checkbox
              checked={value === item.value}
              onChange={handleChange}
              value={item.value}
              style={item.style}
              disabled={item.disabled}
            />
          }
          label={item.label}
        />
      ))}
    </FormGroup>
  );
};

export default ControlledCheckboxesGroup;

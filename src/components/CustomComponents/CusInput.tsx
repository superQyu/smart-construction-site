import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, InputBase, Button } from '@mui/material';

const AntdInput = styled(InputBase)`
  && {
    background-color: #fff;
    // border-radius: 2px;
    border: 1px solid #648aff;
    padding: 0 11px;
    font-size: 14px;
    width: 100%;
    transition: border-color 0.3s;

    &.small-wrapper {
      height: 20px;

      input {
        padding: 0;
        font-size: 0.625rem;
      }
    }

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-radius: 2px;
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
`;
const CusButton = styled(Button)`
  && {
    background-color: #648aff;
    border-radius: 0;
    border: none;
    color: #fff;
    cursor: pointer;
    min-width: 20px;

    &.small-button {
      width: 20px;
      height: 20px;
    }

    &:hover {
      border-color: #648aff;
    }
  }
`;

interface AntdInputComponentProps {
  sx?: object;
  value: string | number;
  valueType?: 'number';
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  placeholder?: string;
  onChange?: (newValue: string | number) => void;
  onButtonClick?: () => void; // 新增点击事件处理函数
  buttonText?: string | React.ReactNode; // 修改inputtext为buttonText
  readOnly?: boolean;
}

const AntdInputComponent: React.FC<AntdInputComponentProps> = ({
  value,
  size = 'middle',
  valueType = 'string',
  onChange,
  onButtonClick,
  buttonText,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    switch (valueType) {
      case 'number':
        newValue = newValue.replace(/[^\d.]/g, '');
        break;

      default:
        break;
    }
    onChange && onChange(newValue);
  };
  return (
    <Box className="input-wrapper flex">
      <AntdInput className={`${size}-wrapper`} {...props} value={value} onChange={handleChange} />
      {buttonText && (
        <CusButton
          className={`${size}-button`}
          onClick={onButtonClick}
          disabled={props.disabled}
          sx={{
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          {buttonText}
        </CusButton>
      )}
    </Box>
  );
};

export default AntdInputComponent;

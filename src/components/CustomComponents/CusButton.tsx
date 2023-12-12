import { styled } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';

const CusButton = styled(Button)`
  background-color: #c8d5ff;
  color: #577df6;
  border-radius: 26px;
  padding: 2px 16px;
  white-space: nowrap;

  &:hover {
    background-color: rgba(200, 213, 255, 0.85);
  }
`;

interface Props extends ButtonProps {
  cType?: 'primary' | 'secondary';
}

const CusButtonComponent = ({ cType, sx, ...props }: Props) => {
  const bgStyle =
    cType === 'secondary'
      ? {
          backgroundColor: '#dfe0e3',
          color: '#4b4b4d',
          ...sx,
        }
      : {
          backgroundColor: '#c8d5ff',
          color: '#577df6',
          ...sx,
        };

  return <CusButton sx={bgStyle} {...props} />;
};

export default CusButtonComponent;

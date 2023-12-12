import { styled } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';

const CusButton = styled(Button)`
  background-color: #648aff;
  color: #ffffff;
  border-radius: 26px;
  padding: 2px 50px;
  white-space: nowrap;

  &:hover {
    background-color: rgba(100, 138, 255, 0.85);
  }
`;

interface Props extends ButtonProps {}

const CusButtonComponent = ({ sx, ...props }: Props) => {
  return <CusButton sx={sx} {...props} />;
};

export default CusButtonComponent;

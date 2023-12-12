import { styled } from '@mui/material/styles';
import Typography, { type TypographyProps } from '@mui/material/Typography';

const CusLableSimple = styled(Typography)`
  font-weight: 700;
  border-left: 3px solid #648aff;
  padding-left: 10px;
`;

interface Props extends TypographyProps {
  label?: string;
  key?: string;
}

const CusLableSimpleComponent = ({ sx, label }: Props) => {
  return <CusLableSimple sx={sx}>{label}</CusLableSimple>;
};

export default CusLableSimpleComponent;

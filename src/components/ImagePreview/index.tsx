import { Box, type BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const BoxWithBG = styled(Box)({
  backgroundPosition: '0px 0px, 0px 15px, 15px -15px, -15px 0px',
  backgroundSize: '10px 10px',
  backgroundImage:
    'linear-gradient(45deg, rgb(230, 230, 230) 25%, transparent 25%), linear-gradient(-45deg, rgb(230, 230, 230) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgb(230, 230, 230) 75%), linear-gradient(-45deg, transparent 75%, rgb(230, 230, 230) 75%)',
});

export interface Props extends BoxProps {}

export default function ImagePreview({ children }: Props) {
  return (
    <BoxWithBG className="flex items-center justify-center overflow-y-auto" sx={{ width: '100%', height: '100%' }}>
      {children}
    </BoxWithBG>
  );
}

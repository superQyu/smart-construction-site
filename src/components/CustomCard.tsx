import { type FC, type ReactNode, type HTMLProps, type Ref } from 'react';
import { Paper, type SxProps, type Theme, Box } from '@mui/material';

interface Props extends HTMLProps<any> {
  className?: string;
  Head?: FC;
  Content?: FC;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx?: SxProps<Theme>;
  square?: boolean;
  contentClassName?: string;
  contentRef?: Ref<any>;
}

export default function CustomCard({ className, Head, children, sx, square, contentClassName, ...props }: Props) {
  return (
    <Paper
      variant="outlined"
      className={`${className || ''} flex flex-col`}
      sx={{ borderColor: '#dae9ff', ...sx }}
      square={square}
    >
      {Head && (
        <Paper
          variant="outlined"
          className="min-h-8 flex items-center px2"
          sx={{
            border: 'initial',
            backgroundColor: '#dae9ff',
            borderBottomLeftRadius: 'unset',
            borderBottomRightRadius: 'unset',
          }}
          square
        >
          {<Head />}
        </Paper>
      )}

      <Box className={`${contentClassName || ''} w-full flex-1`} ref={props?.contentRef}>
        {children}
      </Box>
    </Paper>
  );
}

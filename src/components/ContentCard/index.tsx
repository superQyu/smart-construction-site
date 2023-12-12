import type { FC, ReactNode, HTMLProps, Ref } from 'react';
import { Paper, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

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

export default function CustomCard({ Head, children, sx, square, contentClassName, ...props }: Props) {
  return (
    <Paper
      variant="outlined"
      className="flex-basis-100% max-h100% mb1 overflow-hidden"
      sx={{ height: '100%', borderColor: '#dae9ff', ...sx }}
      square={square}
    >
      {Head && (
        <Paper
          variant="outlined"
          className="h-8 flex items-center px2"
          sx={{
            border: 'initial',
            backgroundColor: '#dae9ff',
            borderBottomLeftRadius: 'unset',
            borderBottomRightRadius: 'unset',
            display: 'flex',
            justifyContent: 'center',
            height: '37px',
          }}
          square
        >
          {<Head />}
        </Paper>
      )}

      <Box
        className={`${contentClassName || ''} ${Head ? 'h-[calc(100%-2rem)] w-full' : 'h-full w-full'}`}
        ref={props?.contentRef}
      >
        {children}
      </Box>
    </Paper>
  );
}

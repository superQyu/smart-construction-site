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
  contentClassName?: string;
  contentRef?: Ref<any>;
  contentSx?: SxProps<Theme>;
}

export default function SubCard({ Head, children, sx, contentClassName, contentSx, ...props }: Props) {
  return (
    <Paper
      variant="outlined"
      className="flex-basis-100% max-h100% mb1"
      sx={{ borderRadius: '0px', borderColor: '#d6e0fd', ...sx }}
    >
      {Head && (
        <Paper
          variant="outlined"
          className="h-8 flex items-center "
          sx={{
            borderRadius: '0px',
            border: 'initial',
            backgroundColor: '#648aff',
            display: 'flex',
            justifyContent: 'flex-start',
            height: '24px',
            padding: '0 5px 0 19px',
          }}
        >
          {<Head />}
        </Paper>
      )}

      <Box
        className={`${contentClassName || ''} ${Head ? 'h-[calc(100%-2rem)] w-full' : 'h-full w-full'}`}
        ref={props?.contentRef}
        sx={{ padding: '9px 5px 0 19px', ...contentSx }}
      >
        {children}
      </Box>
    </Paper>
  );
}

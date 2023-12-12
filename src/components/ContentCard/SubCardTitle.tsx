import type { HTMLProps } from 'react';
import { Typography } from '@mui/material';

export interface Props extends HTMLProps<HTMLElement> {
  sx?: object;
  label: string;
}

export default function Subtitle({ label, sx }: Props) {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        textAlign: 'center',
        mb: '22px',
        height: '24px',
        lineHeight: '24px',
        backgroundColor: '#d1ddef',
        ...sx,
      }}
    >
      {label}
    </Typography>
  );
}

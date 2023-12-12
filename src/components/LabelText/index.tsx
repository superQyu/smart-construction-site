import React from 'react';
import { Typography } from '@mui/material';

interface LabeledTextProps {
  label: string;
  text: string | number;
}

const LabeledText: React.FC<LabeledTextProps> = ({ label, text }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="subtitle1" style={{ marginRight: '8px' }}>
        {label}
      </Typography>
      <Typography variant="body1">{text}</Typography>
    </div>
  );
};

export default LabeledText;

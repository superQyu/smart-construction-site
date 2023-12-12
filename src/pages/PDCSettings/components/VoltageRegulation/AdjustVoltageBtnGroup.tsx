import { useTranslation } from 'react-i18next';
import { Box, Typography, BoxProps } from '@mui/material';

const defSX = {
  areaTitle: { mb: '5px', fontWeight: 700, minWidth: '140px', display: 'flex', alignItems: 'center' },
};

interface Props extends BoxProps {
  onCalcVoltage: (val: number) => void;
}

export default function AdjustVoltageBtnGroup({ onCalcVoltage }: Props) {
  const { t } = useTranslation();
  const voltagesBatchButtons = [
    {
      label: '+0.1',
      value: '0.1',
      onClick: () => {
        onCalcVoltage(0.1);
      },
    },
    {
      label: '-0.1',
      value: '-0.1',
      onClick: () => {
        onCalcVoltage(-0.1);
      },
    },
    {
      label: '+1',
      value: '1',
      onClick: () => {
        onCalcVoltage(1);
      },
    },
    {
      label: '-1',
      value: '-1',
      onClick: () => {
        onCalcVoltage(-1);
      },
    },
  ];

  return (
    <Box>
      <Typography sx={{ ...defSX.areaTitle }}>
        {t('genericName.adjustSelectedNozzleVoltage', '调整所选喷头电压')}:
      </Typography>
      <Box className="w-full">
        {voltagesBatchButtons.map((row, index) => (
          <Typography
            key={index}
            onClick={row.onClick}
            sx={{
              height: '30px',
              lineHeight: '30px',
              textAlign: 'center',
              bgcolor: '#e4efff',
              mb: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: '2px',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            {row.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

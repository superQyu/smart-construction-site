import { useTranslation } from 'react-i18next';
import { Box, Typography, BoxProps, OutlinedInput, InputAdornment } from '@mui/material';

const defSX = {
  areaTitle: { mb: '5px', fontWeight: 700, minWidth: '140px', display: 'flex', alignItems: 'center' },
  subCardTitle: { pl: '20px' },
  subTitle: {
    pr: '15px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  checkBoxArea: { pl: '80px', '& .cus__checkbox': { '& span.MuiCheckbox-root': { p: '2px 9px' } } },
  buttonBox: { 'button:not(:last-child)': { mr: '18px' } },
};

interface Props extends BoxProps {
  selectedNozzle: number;
  onSelectedNozzleChange: (val: string) => void;
}
export default function SetSelectedNozzle({ selectedNozzle, onSelectedNozzleChange }: Props) {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography sx={{ ...defSX.areaTitle }}>{t('genericName.setSelectedNozzle', '设置已选中喷头')}:</Typography>
      <Box className="w-full">
        <Box className="flex flex-wrap settings__item">
          <Typography sx={{ ...defSX.subTitle }}>{t('genericName.setTo', '设置为')}</Typography>
          <Box>
            <OutlinedInput
              size="small"
              value={selectedNozzle}
              onChange={(e) => onSelectedNozzleChange(e.target.value)}
              endAdornment={
                <InputAdornment position="end" sx={{ position: 'absolute', right: '10px' }}>
                  %
                </InputAdornment>
              }
              inputProps={{
                step: 0.1,
                min: 0,
                max: 99999,
                type: 'number',
              }}
              sx={{ borderRadius: '0', input: { p: '5px 14px' }, minWidth: 105 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

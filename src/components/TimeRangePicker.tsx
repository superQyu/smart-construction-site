import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs, { type Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Divider, FormControl, type FormControlProps, Box, FormHelperText } from '@mui/material';

interface Props extends FormControlProps {
  // eslint-disable-next-line no-unused-vars
  onStartTimeChange?: (startTime: Dayjs | null) => void;
  // eslint-disable-next-line no-unused-vars
  onEndTimeChange?: (endTime: Dayjs | null) => void;
  // eslint-disable-next-line no-unused-vars
  onHandleError?: (val: boolean) => void;
}

export default function TimeRangePicker({ onStartTimeChange, onEndTimeChange, onHandleError, ...restProps }: Props) {
  const oneDayMillSecs = 24 * 60 * 60 * 1000;
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(Date.now() - oneDayMillSecs));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(Date.now()));

  const handleStartTimeChange = (newValue: Dayjs | null) => {
    setStartTime(newValue);
    onStartTimeChange?.(newValue);
  };

  const handleEndTimeChange = (newValue: Dayjs | null) => {
    setEndTime(newValue);
    onEndTimeChange?.(newValue);
  };

  const error = startTime ? startTime.diff(endTime) > 0 : true;

  useEffect(() => {
    onHandleError?.(error);
  }, [error]);

  return (
    <FormControl variant="standard" className={`${restProps.className || ''} w-full`} error={error} {...restProps}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <DateTimePicker
          className="w-full min-w-200px"
          label={t('timeRangePicker.startTime', '开始时间')}
          value={startTime}
          onChange={handleStartTimeChange}
        />
        <Divider className="w-10px" sx={{ mx: '5px' }} />
        <DateTimePicker
          className="w-full min-w-200px"
          label={t('timeRangePicker.endTime', '结束时间')}
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </Box>
      {error && <FormHelperText>{t('timeRangePicker.error', '开始时间必须小于结束时间')}</FormHelperText>}
    </FormControl>
  );
}

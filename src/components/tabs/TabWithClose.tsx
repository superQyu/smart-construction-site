import { useState, SyntheticEvent } from 'react';
import { type TabProps, Box, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props extends TabProps {
  // eslint-disable-next-line no-unused-vars
  onClose: (event?: SyntheticEvent) => void;
  hideClose?: boolean;
}

export default function TabWithClose({ onClose, hideClose, ...props }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <Tab
      {...props}
      label={
        <Box className="flex items-center" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          {props.label}
          {isHovering && !hideClose && <CloseIcon onClick={onClose} className="right-0" />}
        </Box>
      }
    ></Tab>
  );
}

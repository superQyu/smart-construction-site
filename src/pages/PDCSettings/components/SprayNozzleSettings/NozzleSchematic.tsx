import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

import ImagePreview from '@/components/ImagePreview';
import ColorEqualization from './ColorEqualization';

export default function nozzleSchematicDiagram() {
  const { t } = useTranslation();

  const [openColorEqual, setOpenColorEqual] = useState(false);
  const [imageSrc, _] = useState(null);
  const setClorAdapter = () => setOpenColorEqual(true);

  return (
    <Box className="w-full h-full" sx={{ cursor: 'pointer' }}>
      <Box className="w-full h-full" onClick={setClorAdapter}>
        <ImagePreview>
          {imageSrc ? (
            <img src={imageSrc} alt="" className="max-h100% max-w100%"></img>
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              {t('digitalInteraction.noPreviewImage', '无可用预览')}
            </Typography>
          )}
        </ImagePreview>
      </Box>

      {openColorEqual && <ColorEqualization open={openColorEqual} onClose={() => setOpenColorEqual(false)} />}
    </Box>
  );
}

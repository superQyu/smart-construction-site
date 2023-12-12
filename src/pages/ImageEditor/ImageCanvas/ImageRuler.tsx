import { useRef, useEffect } from 'react';

import { type BoxProps, Box } from '@mui/material';
import Guides from '@scena/react-guides';

interface Props extends BoxProps {
  // eslint-disable-next-line no-unused-vars
  onRulerChange?: (data: { rulerX: number; rulerY: number }) => void;
  defaultRulerValue?: { rulerX: number; rulerY: number };
}
export default function ImageRuler({ defaultRulerValue, onRulerChange, children, ...props }: Props) {
  const horizontalRef = useRef<Guides>(null);
  const verticalRef = useRef<Guides>(null);

  useEffect(() => {
    return initGuides();
  }, []);

  function initGuides() {
    horizontalRef.current?.resize();
    verticalRef.current?.resize();

    const handleResize = () => {
      horizontalRef.current?.resize();
      verticalRef.current?.resize();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  const handleWheel = (e: any) => {
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    const scrollX = horizontalRef.current!.getRulerScrollPos() + deltaX;
    const scrollY = verticalRef.current!.getRulerScrollPos() + deltaY;
    // horizontalRef.current!.scrollGuides(scrollY);
    // verticalRef.current!.scrollGuides(scrollX);
    horizontalRef.current!.scroll(scrollX);
    verticalRef.current!.scroll(scrollY);

    if (onRulerChange) {
      onRulerChange({ rulerX: scrollX, rulerY: scrollY });
    }
  };

  return (
    <Box className="w-full h-full" onWheel={handleWheel} {...props}>
      <Box className="absolute top-0 w-full h6 z1">
        <Guides
          backgroundColor="transparent"
          textColor="#babec0"
          ref={horizontalRef}
          textOffset={[0, 5]}
          type="horizontal"
          textAlign="left"
          markColor="#babec0"
          lineColor="#babec0"
          displayDragPos={true}
          displayGuidePos={false}
          defaultScrollPos={defaultRulerValue?.rulerX || 0}
          rulerStyle={{ left: '1.5rem', width: 'calc(100% - 1.5rem)', height: '100%' }}
        />
      </Box>
      <Box className="absolute left-0 top-0 w6 h-full z1 ">
        <Guides
          backgroundColor="transparent"
          textColor="#babec0"
          textAlign="right"
          textOffset={[3, 0]}
          markColor="#babec0"
          lineColor="#babec0"
          rulerStyle={{ top: '1.5rem', height: 'calc(100% - 1.5rem)', width: '100%' }}
          ref={verticalRef}
          defaultScrollPos={defaultRulerValue?.rulerY || 0}
          type="vertical"
          displayDragPos={true}
          displayGuidePos={false}
        />
      </Box>
      {children}
    </Box>
  );
}

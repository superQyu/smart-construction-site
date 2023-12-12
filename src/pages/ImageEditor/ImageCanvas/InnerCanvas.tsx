import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Box, type BoxProps } from '@mui/material';

import { useImageEditorContext } from '@/context/ImageEditorContext';

interface Props extends BoxProps {
  canvasId: string;
  // eslint-disable-next-line no-unused-vars
  onExportData?: (data: any) => void;
  defaultCanvasData?: any;
}

export default function InnerCanvas({ canvasId, defaultCanvasData, onExportData, ...props }: Props) {
  const boxRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageEditorContext, setImageEditorContext] = useImageEditorContext();
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    return initFabricCanvas();
  }, []);

  useEffect(() => {
    if (!imageEditorContext || !fabricCanvas) {
      return;
    }

    imageEditorContext?.files?.map((item) => {
      const pugImg = new Image();
      pugImg.onload = () => {
        const pug = new fabric.Image(pugImg, {
          selectable: true,
          lockMovementX: false,
          lockMovementY: false,
        });
        pug.scaleToWidth(200, false);

        fabricCanvas?.add(pug);
        fabricCanvas?.centerObject(pug);
      };
      // for fabric canvas saving image correctly
      pugImg.crossOrigin = 'anonymous';
      pugImg.src = item.imageSrc;
    });
  }, [imageEditorContext?.files]);

  function initFabricCanvas() {
    const canvas = new fabric.Canvas(canvasRef.current);

    canvas.on('mouse:wheel', function (opt) {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    });

    canvas.on('mouse:down', function (this: any, opt) {
      const evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', function (this: any, opt) {
      if (this.isDragging) {
        const e = opt.e;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    // eslint-disable-next-line no-unused-vars
    canvas.on('mouse:up', function (this: any) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

    const handleSelected = (event: fabric.IEvent) => {
      if (event.selected && event.selected.length > 0) {
        setImageEditorContext((prevState) => ({
          ...prevState,
          selectedObj: event.selected?.[0],
        }));

        return;
      }

      if (event.deselected && event.deselected?.length > 0) {
        setImageEditorContext((prevState) => ({
          ...prevState,
          selectedObj: null,
        }));
      }
    };
    canvas.on('selection:created', handleSelected);
    canvas.on('selection:updated', handleSelected);
    canvas.on('selection:cleared', handleSelected);

    const handleResize = () => {
      canvas.setWidth(boxRef.current!.clientWidth - 24);
      canvas.setHeight(boxRef.current!.clientHeight - 24);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'backspace') {
        if (!canvas.getActiveObject()) {
          canvas.clear();
        } else {
          canvas.getActiveObjects().map((item: fabric.Object) => canvas.remove(item));
        }

        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    });

    canvas.setWidth(boxRef.current!.clientWidth - 24);
    canvas.setHeight(boxRef.current!.clientHeight - 24);
    setFabricCanvas(canvas);
    setImageEditorContext((prevState) => ({
      ...prevState,
      currentCanvas: canvas,
    }));

    if (defaultCanvasData) {
      canvas.loadFromJSON(defaultCanvasData, canvas.renderAll.bind(canvas));
    }

    return () => {
      onExportData?.(canvas.toJSON());
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }

  return (
    <Box {...props} ref={boxRef} className="w-full h-full pt6 pl-6 max-h90vh">
      <canvas ref={canvasRef} id={canvasId}></canvas>
    </Box>
  );
}

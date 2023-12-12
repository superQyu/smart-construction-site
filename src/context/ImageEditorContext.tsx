import { createContext, ReactNode, useState, useContext, type Dispatch, type SetStateAction } from 'react';
import { fabric } from 'fabric';

interface ImageEditorContextItf {
  files?: {
    path: string;
    imageSrc: string;
  }[];

  selectedObj?: fabric.Object | null;
  currentCanvas?: fabric.Canvas;
}

const ImageEditorContext = createContext<
  [ImageEditorContextItf | undefined, Dispatch<SetStateAction<ImageEditorContextItf | undefined>>]
>([undefined, () => {}]);

export const useImageEditorContext = () => {
  const context = useContext(ImageEditorContext);
  if (!context) {
    throw new Error('useImageEditorContext must be used within a ImageEditorProvider');
  }
  return context;
};

export function ImageEditorContextProvider({ children }: { children: ReactNode }) {
  const context = useState<ImageEditorContextItf>();

  return <ImageEditorContext.Provider value={context}>{children}</ImageEditorContext.Provider>;
}

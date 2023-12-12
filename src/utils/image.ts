import 'tiff.js';
import type Tiff from 'tiff.js';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri';


export const tifImageSrcParser = async (path: string) => {
    const imageSrc = await readBinaryFile(path)
        .then((result) => {
            const image: Tiff = new (window as any).Tiff({ buffer: result });
            return image.toDataURL();
        })
        .catch(() => convertFileSrc(path));

    return imageSrc;
};

export const tifImageSrcParserWithBuf = async (buf: any) => {
    const image: Tiff = new (window as any).Tiff({ buffer: buf });
    return image.toDataURL();
}


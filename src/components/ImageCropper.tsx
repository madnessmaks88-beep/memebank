import React, { useRef, useState, useCallback } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  src: string;
  onCropComplete: (croppedBlob: Blob) => void;
  aspectRatio?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCropComplete,
  aspectRatio = 9 / 16,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  // Вызываем генерацию Blob только когда пользователь закончил двигать/менять размер
  const handleCropComplete = useCallback(async (crop: PixelCrop) => {
    if (imgRef.current && crop.width && crop.height) {
      const blob = await getCroppedImg(imgRef.current, crop);
      onCropComplete(blob);
    }
  }, [onCropComplete]);

  return (
    <div style={{ position: 'relative', maxWidth: '100%' }}>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={handleCropComplete}
        aspect={aspectRatio}
        keepSelection
        style={{ maxWidth: '100%' }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop me"
          onLoad={onImageLoad}
          style={{ maxWidth: '100%', display: 'block' }}
          crossOrigin="anonymous"
        />
      </ReactCrop>
    </div>
  );
};

// ✅ Исправленная функция обрезки (без лишних переменных и с правильным drawImage)
async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // ✅ Правильная сигнатура: 9 аргументов, без 'false' в конце
  ctx.drawImage(
    image,
    cropX, cropY, crop.width * scaleX, crop.height * scaleY,
    0, 0, crop.width, crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(new Blob());
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}
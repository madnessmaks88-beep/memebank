/**
 * Сжимает изображение на стороне клиента перед загрузкой.
 * @param file - Исходный файл или Blob
 * @param maxWidth - Максимальная ширина (1080px идеально для мобилок)
 * @param quality - Качество JPEG (0.7 = 70%)
 */
export const compressImage = (
  file: Blob,
  maxWidth = 1080,
  quality = 0.75
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Вычисляем новые пропорции
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      ctx.drawImage(img, 0, 0, width, height);

      // Конвертируем в JPEG (он весит меньше PNG в 5-10 раз)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load error'));
  });
};
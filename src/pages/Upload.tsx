import React, { useState, useRef, useCallback } from 'react';
import { Group, Input, Button, Spinner, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton } from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import { supabase } from '../lib/supabase';
import { useVKAuth } from '../hooks/useVKAuth';
import { ImageCropper } from '../components/ImageCropper';

const compressImage = (
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

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      ctx.drawImage(img, 0, 0, width, height);

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

export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const { user } = useVKAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Выбор файла и открытие кроппера
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // 2. Обновление вырезанной области
  const handleCropComplete = useCallback((blob: Blob) => {
    setCroppedBlob(blob);
  }, []);

  // 3. Подтверждение обрезки
  const handleConfirmCrop = () => {
    setShowCropper(false);
  };

  // 4. Отмена загрузки
  const handleCancelCrop = () => {
    setShowCropper(false);
    setFile(null);
    setPreview(null);
    setCroppedBlob(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // 5. Загрузка БЕЗ обрезки (используем оригинальный файл)
  const handleUseFullImage = () => {
    if (file) {
      setCroppedBlob(file);
      setShowCropper(false);
    }
  };

  // 6. Публикация мема + начисление монет
  const handleSubmit = async () => {
    if (!croppedBlob || !title) {
      alert('Пожалуйста, выберите фото и введите название');
      return;
    }

    setUploading(true);
    try {
      // 🚀 1. СЖАТИЕ: Превращаем тяжелый файл в легкий Blob
      // Это ускорит загрузку на телефоне в 10 раз!
      console.log('[Upload] Сжатие изображения...');
      const compressedBlob = await compressImage(croppedBlob);
      console.log(`[Upload] Сжато: ${croppedBlob.size} -> ${compressedBlob.size} bytes`);

      const uploadFile = new File([compressedBlob], `meme_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

      // 2. Загрузка в Storage (теперь летит быстро)
      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(fileName, uploadFile, { cacheControl: '3600', upsert: false });
      
      if (uploadError) throw uploadError;

      // 3. Получаем публичную ссылку
      const { data: { publicUrl } } = supabase.storage.from('memes').getPublicUrl(fileName);

      // 4. Сохраняем в БД
      const { error: dbError } = await supabase.from('memes').insert([
        {
          title,
          image_url: publicUrl,
          author: user ? `${user.first_name} ${user.last_name}` : 'Аноним',
          author_avatar: user?.photo_100 || user?.photo_200,
          coins_earned: 10,
        }
      ]);
      if (dbError) throw dbError;

      // 5. Начисляем монеты
      if (user) {
        await supabase.rpc('add_coins', {
          target_user_id: user.id,
          amount: 10,
          txn_type: 'upload'
        });
      }

      // 6. Очистка
      setFile(null);
      setPreview(null);
      setCroppedBlob(null);
      setTitle('');
      alert('✅ Мем опубликован! +10 монет.');
      window.location.reload();
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      alert(`❌ Ошибка: ${error.message || 'Не удалось загрузить'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Group>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, color: '#fff' }}>📤 Загрузить мем</h3>
            <p style={{ margin: '4px 0 0', color: '#9A9AB0', fontSize: 13 }}>
              Поделись мемом и получи +10 монет!
            </p>
          </div>

          {/* Зона выбора фото */}
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border: '2px dashed #00E5FF',
              borderRadius: 16,
              padding: 40,
              textAlign: 'center',
              cursor: 'pointer',
              background: '#1A1A24',
              transition: 'all 0.2s',
            }}
          >
            {preview && !showCropper ? (
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: '100%', borderRadius: 12, maxHeight: '300px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ color: '#9A9AB0' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                <div>Нажми для выбора фото</div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>JPG, PNG до 10MB</div>
              </div>
            )}
          </div>

          <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

          <Input
            placeholder="Название мема (обязательно)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ background: '#1A1A24', borderRadius: 8 }}
          />

          <Button
            mode="primary"
            size="l"
            disabled={!croppedBlob || !title || uploading}
            onClick={handleSubmit}
            style={{ marginTop: '8px' }}
          >
            {uploading ? (
              <>
                <Spinner size="m" />
                <span style={{ marginLeft: 8 }}>Загрузка...</span>
              </>
            ) : (
              'Опубликовать (+10 монет)'
            )}
          </Button>

          {user && (
            <div style={{ padding: '12px', background: '#1A1A24', borderRadius: 12, textAlign: 'center', fontSize: 13, color: '#9A9AB0' }}>
              👤 {user.first_name} {user.last_name}
            </div>
          )}
        </div>
      </Group>

      {/* Модальное окно кроппера */}
      <ModalRoot activeModal={showCropper ? 'cropper' : undefined}>
        <ModalPage
          id="cropper"
          header={
            <ModalPageHeader
              before={
                <PanelHeaderButton onClick={handleCancelCrop}>
                  <Icon24Cancel />
                </PanelHeaderButton>
              }
              after={
                <>
                  <PanelHeaderButton onClick={handleUseFullImage}>
                    <span style={{ color: '#9A9AB0', fontSize: 13, fontWeight: 500 }}>Без обрезки</span>
                  </PanelHeaderButton>
                  <PanelHeaderButton onClick={handleConfirmCrop}>
                    <span style={{ color: '#00E5FF', fontWeight: 600 }}>Готово</span>
                  </PanelHeaderButton>
                </>
              }
            >
              Выберите область
            </ModalPageHeader>
          }
          onClose={handleCancelCrop}
        >
          <div style={{ padding: '16px', background: '#000' }}>
            {preview && (
              <ImageCropper
                src={preview}
                onCropComplete={handleCropComplete}
                aspectRatio={9 / 16}
              />
            )}
            <div style={{ textAlign: 'center', marginTop: 16, color: '#9A9AB0', fontSize: 13 }}>
               📐 Выделите область или нажмите «Без обрезки»
            </div>
          </div>
        </ModalPage>
      </ModalRoot>
    </>
  );
};
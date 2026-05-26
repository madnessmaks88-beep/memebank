import React, { useState, useCallback } from 'react';
import { Group, Button, Input, Spinner, Alert } from '@vkontakte/vkui';
import { useVKAuth } from '../hooks/useVKAuth';
import { supabase } from '../lib/supabase';

export const Upload: React.FC = () => {
  const { user } = useVKAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!file || !title) {
      setError('Пожалуйста, выберите фото и введите название');
      return;
    }

    if (!user) {
      setError('Требуется авторизация');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      
      // ⚠️ БЕЗ СЖАТИЯ - загружаем как есть
      const { error: uploadError } = await supabase.storage
        .from('memes')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('memes').getPublicUrl(fileName);

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

      if (user) {
        await supabase.rpc('add_coins', {
          target_user_id: user.id,
          amount: 10,
          txn_type: 'upload'
        });
      }

      setFile(null);
      setPreview(null);
      setTitle('');
      alert('✅ Мем опубликован! +10 монет');
      window.location.reload();
      
    } catch (err: any) {
      console.error('Ошибка загрузки:', err);
      setError(err.message || 'Не удалось загрузить мем');
    } finally {
      setUploading(false);
    }
  }, [file, title, user]);

  return (
    <Group>
      <div style={{ padding: 20, color: '#fff' }}>
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>📤 Загрузить мем</h2>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ 
            marginBottom: 16, 
            display: 'block',
            width: '100%',
            padding: 12,
            background: '#18181b',
            borderRadius: 8,
            border: '1px solid #27272a',
            color: '#fff'
          }}
        />
        
        {preview && (
          <div style={{ 
            marginBottom: 16, 
            borderRadius: 12, 
            overflow: 'hidden',
            border: '1px solid #27272a'
          }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </div>
        )}
        
        <Input
          placeholder="Название мема"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
          {error && (
              <Alert
                title="Ошибка"
                actions={[{ title: "OK", mode: "cancel" }]}
                onClose={() => setError(null)}
                onClosed={() => setError(null)}
              >
                {error}
              </Alert>
            )}
        
        <Button 
          mode="primary" 
          onClick={handleSubmit}
          disabled={uploading || !file || !title}
          style={{ width: '100%', marginTop: 16 }}
        >
          {uploading ? <Spinner size="s" /> : 'Загрузить (+10 монет)'}
        </Button>
      </div>
    </Group>
  );
};
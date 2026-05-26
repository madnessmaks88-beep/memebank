import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Group, PullToRefresh, Spinner, Button, Avatar } from '@vkontakte/vkui';
import { Icon28Favorite, Icon28FavoriteOutline, Icon28BookmarkOutline, Icon28CopyOutline, Icon28SendOutline } from '@vkontakte/icons';
import { useVKBridge } from '../hooks/useVKBridge';
import { useVKAuth } from '../hooks/useVKAuth';
import { supabase } from '../lib/supabase';

interface MemeStats {
  id: string;
  title: string;
  image_url: string;
  author: string;
  author_avatar?: string;
  coins_earned: number;
  likes_count: number;
  saves_count: number;
}

interface MemeCardProps {
  meme: MemeStats;
  reaction: { liked: boolean; saved: boolean };
  onReaction: (id: string, type: 'like' | 'save') => void;
  onCopy: (text: string) => void;
  onShare: (url: string) => void;
}

const MemeCard = memo(({ meme, reaction, onReaction, onCopy, onShare }: MemeCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ marginBottom: 20, background: '#18181b', borderRadius: 20, overflow: 'hidden', border: '1px solid #27272a' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar size={36} src={meme.author_avatar || `https://placehold.co/36/00E5FF/000?text=${meme.author.charAt(0).toUpperCase()}`} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f4f4f5', fontWeight: 600, fontSize: 15 }}>{meme.title}</div>
          <div style={{ color: '#71717a', fontSize: 12 }}>@{meme.author}</div>
        </div>
        <div style={{ background: '#27272a', padding: '4px 8px', borderRadius: 8, color: '#FFB800', fontSize: 12 }}>💰 +{meme.coins_earned}</div>
      </div>

      <div style={{ width: '100%', aspectRatio: '9/16', background: '#0f0f11' }}>
        {imageError ? (
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#71717a', fontSize: 14 }}>
            📷 Ошибка загрузки
          </div>
        ) : (
          <img
            src={meme.image_url}
            alt={meme.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              display: 'block',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
        )}
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            mode="tertiary"
            size="l"
            before={reaction.liked ? <Icon28Favorite /> : <Icon28FavoriteOutline />}
            onClick={() => onReaction(meme.id, 'like')}
            style={{ flex: 1, background: reaction.liked ? 'rgba(255,61,113,0.15)' : '#27272a', color: reaction.liked ? '#FF3D71' : '#e4e4e7' }}
          >
            {meme.likes_count}
          </Button>
          <Button
            mode="tertiary"
            size="l"
            before={<Icon28BookmarkOutline />}
            onClick={() => onReaction(meme.id, 'save')}
            style={{ flex: 1, background: reaction.saved ? 'rgba(0,229,255,0.15)' : '#27272a', color: reaction.saved ? '#00E5FF' : '#e4e4e7' }}
          >
            {meme.saves_count}
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button mode="secondary" size="m" before={<Icon28CopyOutline />} onClick={() => onCopy(`${meme.title} | @${meme.author}`)} style={{ flex: 1 }}>
            Копировать
          </Button>
          <Button mode="secondary" size="m" before={<Icon28SendOutline />} onClick={() => onShare(meme.image_url)} style={{ flex: 1 }}>
            Поделиться
          </Button>
        </div>
      </div>
    </div>
  );
});
MemeCard.displayName = 'MemeCard';

const ITEMS_PER_PAGE = 15;

export const Feed: React.FC = () => {
  const [memes, setMemes] = useState<MemeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Record<string, { liked: boolean; saved: boolean }>>({});

  const { copyToClipboard, openLink } = useVKBridge();
  const { user } = useVKAuth();
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchMemes(false);
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, memes.length]);

  const fetchMemes = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    const from = reset ? 0 : memes.length;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      const { data, error: fetchError } = await supabase
        .from('memes_with_stats')
        .select()
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      if (data) {
        const typed = data as MemeStats[];
        setMemes(prev => reset ? typed : [...prev, ...typed]);
        setHasMore(typed.length === ITEMS_PER_PAGE);
        setError(null);
      }
    } catch (err: any) {
      console.error('[Feed] Ошибка загрузки:', err);
      setError(err.message || 'Не удалось загрузить ленту');
      if (reset) setMemes([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [memes.length]);

  const fetchUserReactions = useCallback(async () => {
    if (!user || memes.length === 0) return;
    try {
      const { data } = await supabase
        .from('reactions')
        .select('meme_id, reaction_type')
        .eq('user_id', user.id)
        .in('meme_id', memes.map(m => m.id));

      if (data) {
        const map: Record<string, { liked: boolean; saved: boolean }> = {};
        memes.forEach(m => map[m.id] = { liked: false, saved: false });
        data.forEach(r => {
          if (map[r.meme_id]) map[r.meme_id][r.reaction_type === 'like' ? 'liked' : 'saved'] = true;
        });
        setUserReactions(map);
      }
    } catch (err) {
      console.error('[Feed] Ошибка загрузки реакций:', err);
    }
  }, [user, memes]);

  useEffect(() => { fetchMemes(true); }, []);
  useEffect(() => { fetchUserReactions(); }, [user, memes.length]);

  const handleReaction = async (memeId: string, type: 'like' | 'save') => {
    if (!user) return alert('Войдите, чтобы оценивать мемы!');
    
    const current = userReactions[memeId] || { liked: false, saved: false };
    const stateKey = type === 'like' ? 'liked' : 'saved';
    const isAdding = !current[stateKey];
    const countKey = type === 'like' ? 'likes_count' : 'saves_count';

    setUserReactions(prev => ({ ...prev, [memeId]: { ...prev[memeId], [stateKey]: isAdding } }));
    setMemes(prev => prev.map(m => 
      m.id === memeId ? { ...m, [countKey]: isAdding ? m[countKey] + 1 : Math.max(0, m[countKey] - 1) } : m
    ));

    try {
      if (isAdding) {
        await supabase.from('reactions').insert({ user_id: user.id, meme_id: memeId, reaction_type: type });
      } else {
        await supabase.from('reactions').delete().eq('user_id', user.id).eq('meme_id', memeId).eq('reaction_type', type);
      }
    } catch {
      fetchUserReactions();
    }
  };

  const handleRefresh = async () => {
    await fetchMemes(true);
  };

  const handleRetry = () => fetchMemes(true);

  if (error && memes.length === 0) {
    return (
      <Group style={{ padding: 0, background: '#0B0B0F' }}>
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
          <div style={{ color: '#f4f4f5', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Не удалось загрузить ленту</div>
          <div style={{ color: '#71717a', fontSize: 14, marginBottom: 24 }}>{error}</div>
          <Button mode="primary" size="l" onClick={handleRetry}> Попробовать снова</Button>
        </div>
      </Group>
    );
  }

  if (loading && memes.length === 0) {
    return (
      <Group style={{ padding: 0, background: '#0B0B0F' }}>
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Spinner size="l" />
          <div style={{ marginTop: 20, color: '#71717a', fontSize: 14 }}>Загрузка ленты...</div>
        </div>
      </Group>
    );
  }

  return (
    <Group style={{ padding: 0, background: '#0B0B0F' }}>
      <PullToRefresh onRefresh={handleRefresh}>
        {memes.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#71717a' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div>Лента пуста</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Будь первым, кто загрузит мем!</div>
          </div>
        ) : (
          memes.map(meme => (
            <MemeCard
              key={meme.id}
              meme={meme}
              reaction={userReactions[meme.id] || { liked: false, saved: false }}
              onReaction={handleReaction}
              onCopy={copyToClipboard}
              onShare={openLink}
            />
          ))
        )}

        <div ref={loadMoreRef} style={{ height: 1 }} />

        {loadingMore && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spinner size="m" />
          </div>
        )}

        {!hasMore && memes.length > 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#52525b', fontSize: 14 }}>
             ✨ Конец ленты
          </div>
        )}
      </PullToRefresh>
    </Group>
  );
};
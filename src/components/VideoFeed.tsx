import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { VideoPlayer } from './VideoPlayer';
import { CommentsSection } from './CommentsSection';
import { ShareModal } from './ShareModal';

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  creators: {
    user_id: string;
    verification_badge: boolean;
    users: {
      id: string;
      username: string;
      display_name: string;
      avatar_url: string | null;
      follower_count: number;
    };
  };
  _liked?: boolean;
  _saved?: boolean;
}

export const VideoFeed: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const pageSize = 5;

  useEffect(() => {
    fetchVideos(0);
  }, []);

  const fetchVideos = async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const from = pageNum * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('videos')
      .select(
        `
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        likes_count,
        comments_count,
        shares_count,
        views_count,
        creators(
          user_id,
          verification_badge,
          users(id, username, display_name, avatar_url, follower_count)
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      const videosWithLikes = await Promise.all(
        data.map(async (video: any) => {
          let liked = false;
          let saved = false;

          if (user && userProfile) {
            const { data: likeData } = await supabase
              .from('video_likes')
              .select('id')
              .eq('video_id', video.id)
              .eq('user_id', userProfile.id)
              .single();

            liked = !!likeData;
          }

          return { ...video, _liked: liked, _saved: saved };
        })
      );

      setVideos((prev) => [...prev, ...videosWithLikes]);
      setPage(pageNum + 1);

      if (from + pageSize >= (count || 0)) {
        setHasMore(false);
      }
    }

    setLoading(false);
  };

  const handleScroll = useCallback(() => {
    if (!feedRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = feedRef.current;

    // Load more when 80% scrolled
    if (scrollHeight - scrollTop - clientHeight < clientHeight * 0.2) {
      fetchVideos(page);
    }

    // Update active video based on scroll position
    const children = feedRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const rect = child.getBoundingClientRect();

      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        setActiveVideoIndex(i);
        break;
      }
    }
  }, [page, loading]);

  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleLike = async (videoId: string, currentLiked: boolean) => {
    if (!user || !userProfile) return;

    if (currentLiked) {
      await supabase.from('video_likes').delete().match({
        video_id: videoId,
        user_id: userProfile.id,
      });
    } else {
      await supabase.from('video_likes').insert({
        video_id: videoId,
        user_id: userProfile.id,
      });
    }

    // Update local state
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              _liked: !currentLiked,
              likes_count: currentLiked ? v.likes_count - 1 : v.likes_count + 1,
            }
          : v
      )
    );
  };

  const toggleSave = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? { ...v, _saved: !v._saved }
          : v
      )
    );
  };

  const currentVideo = videos[activeVideoIndex];

  return (
    <>
      <div
        ref={feedRef}
        className="flex flex-col h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {videos.map((video, index) => (
          <div key={video.id} className="w-full h-screen flex-shrink-0 snap-start relative group">
            {/* Video Player */}
            <VideoPlayer
              videoUrl={video.video_url}
              isActive={index === activeVideoIndex}
            />

            {/* Creator Info Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/40 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white">{video.creators.users.display_name}</span>
                    {video.creators.verification_badge && (
                      <span className="text-secondary text-sm">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-white/80">@{video.creators.users.username}</span>
                </div>
                <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                  Follow
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="absolute bottom-20 left-0 right-0 px-4 pb-4">
              <p className="text-white font-semibold text-sm">{video.title}</p>
              {video.description && (
                <p className="text-white/80 text-xs mt-1 line-clamp-2">{video.description}</p>
              )}
            </div>

            {/* Right Side Action Panel */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
              {/* Like Button */}
              <button
                onClick={() => toggleLike(video.id, video._liked || false)}
                className="flex flex-col items-center gap-1 group/action"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover/action:bg-white/20 transition-all group-hover/action:scale-110">
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      video._liked
                        ? 'fill-primary text-primary'
                        : 'text-white group-hover/action:text-primary'
                    }`}
                  />
                </div>
                <span className="text-white text-xs font-semibold">{video.likes_count}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => setCommentsOpen(true)}
                className="flex flex-col items-center gap-1 group/action"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover/action:bg-white/20 transition-all group-hover/action:scale-110">
                  <MessageCircle className="w-6 h-6 text-white group-hover/action:text-secondary transition-colors" />
                </div>
                <span className="text-white text-xs font-semibold">{video.comments_count}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => setShareOpen(true)}
                className="flex flex-col items-center gap-1 group/action"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover/action:bg-white/20 transition-all group-hover/action:scale-110">
                  <Share className="w-6 h-6 text-white group-hover/action:text-secondary transition-colors" />
                </div>
                <span className="text-white text-xs font-semibold">{video.shares_count}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={() => toggleSave(video.id)}
                className="flex flex-col items-center gap-1 group/action"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover/action:bg-white/20 transition-all group-hover/action:scale-110">
                  <Bookmark
                    className={`w-6 h-6 transition-all ${
                      video._saved
                        ? 'fill-primary text-primary'
                        : 'text-white group-hover/action:text-primary'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Scroll Indicator */}
            {index < videos.length - 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
                <ChevronDown className="w-5 h-5 text-white/40" />
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {loading && (
          <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Loading more videos...</p>
            </div>
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && videos.length > 0 && (
          <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">You've reached the end</p>
              <p className="text-sm text-muted-foreground">Check back soon for more videos!</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CommentsSection videoId={currentVideo?.id || ''} isOpen={commentsOpen} />
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        videoId={currentVideo?.id || ''}
        creatorName={currentVideo?.creators.users.display_name || ''}
      />
    </>
  );
};

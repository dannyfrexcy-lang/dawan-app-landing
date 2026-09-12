import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Heart, Share2, Edit, LogOut, ArrowLeft } from 'lucide-react';

interface UserStats {
  videosCount: number;
  likesCount: number;
  followersCount: number;
  followingCount: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    videosCount: 0,
    likesCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userProfile?.display_name || '',
    bio: userProfile?.bio || '',
  });

  useEffect(() => {
    if (userProfile) {
      fetchUserStats();
      fetchUserVideos();
    }
  }, [userProfile]);

  const fetchUserStats = async () => {
    if (!userProfile) return;

    // Get videos count
    const { count: videosCount } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('creators.user_id', userProfile.id);

    // Get total likes
    const { data: likesData } = await supabase
      .from('video_likes')
      .select('video_id')
      .in('video_id', userVideos.map((v) => v.id));

    setStats({
      videosCount: videosCount || 0,
      likesCount: likesData?.length || 0,
      followersCount: userProfile.follower_count || 0,
      followingCount: userProfile.following_count || 0,
    });
  };

  const fetchUserVideos = async () => {
    if (!userProfile) return;

    const { data: creatorData } = await supabase
      .from('creators')
      .select('id')
      .eq('user_id', userProfile.id)
      .single();

    if (creatorData) {
      const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .eq('creator_id', creatorData.id)
        .order('created_at', { ascending: false });

      setUserVideos(videos || []);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;

    const { error } = await supabase
      .from('users')
      .update({
        display_name: editData.displayName,
        bio: editData.bio,
      })
      .eq('id', userProfile.id);

    if (!error) {
      setIsEditing(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.displayName}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                      className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-foreground"
                    />
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Add a bio..."
                      className="w-full bg-input border border-border rounded-lg px-3 py-1.5 text-foreground text-sm resize-none"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">{userProfile.display_name}</h2>
                    <p className="text-muted-foreground">@{userProfile.username}</p>
                    {userProfile.bio && (
                      <p className="text-foreground/80 text-sm mt-1">{userProfile.bio}</p>
                    )}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.videosCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Videos</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-secondary">{stats.followersCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Followers</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.followingCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Following</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-secondary">{stats.likesCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Likes</p>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div>
          <h3 className="text-lg font-bold mb-4">Your Videos</h3>
          {userVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No videos yet</p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Explore & Create
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors group cursor-pointer"
                >
                  <div className="aspect-video bg-input relative overflow-hidden">
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm line-clamp-1">{video.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {video.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {video.shares_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

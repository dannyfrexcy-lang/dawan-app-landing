import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  _liked?: boolean;
}

interface CommentsSectionProps {
  videoId: string;
  isOpen: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId, isOpen }) => {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && videoId) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        id,
        content,
        likes_count,
        created_at,
        user_id,
        parent_comment_id,
        users:user_id(id, username, display_name, avatar_url)
      `
      )
      .eq('video_id', videoId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment: any) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(
              `
              id,
              content,
              likes_count,
              created_at,
              user_id,
              users:user_id(id, username, display_name, avatar_url)
            `
            )
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            user: comment.users,
            replies: replies || [],
          };
        })
      );

      setComments(commentsWithReplies);
    }
    setLoading(false);
  };

  const addComment = async () => {
    if (!newComment.trim() || !user || !userProfile) return;

    const { error } = await supabase.from('comments').insert({
      video_id: videoId,
      user_id: userProfile.id,
      parent_comment_id: replyingTo,
      content: newComment,
    });

    if (!error) {
      setNewComment('');
      setReplyingTo(null);
      fetchComments();
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user || !userProfile) return;

    const { error } = await supabase.from('comment_likes').insert({
      comment_id: commentId,
      user_id: userProfile.id,
    });

    if (!error) {
      fetchComments();
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply }) => (
    <div className={`${isReply ? 'ml-8' : ''} mb-4`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">
              {comment.user.display_name}
            </span>
            <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
          </div>
          <p className="text-sm text-foreground mt-1 break-words">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => likeComment(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>{comment.likes_count}</span>
            </button>
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => toggleReplies(comment.id)}
            className="flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors ml-11"
          >
            {expandedReplies.has(comment.id) ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            <span>{comment.replies.length} replies</span>
          </button>

          {expandedReplies.has(comment.id) && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md bg-card rounded-t-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Comments</h2>
          <button className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-2">
          {replyingTo && (
            <div className="text-xs text-muted-foreground px-2">
              Replying to comment
              <button
                onClick={() => setReplyingTo(null)}
                className="text-primary hover:underline ml-1"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
              className="flex-1 bg-input text-foreground placeholder-muted-foreground rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim() || !user}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

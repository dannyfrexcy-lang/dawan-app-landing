import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          follower_count: number;
          following_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          auth_id: string;
          username: string;
          display_name: string;
          avatar_url?: string;
          bio?: string;
        };
        Update: {
          display_name?: string;
          avatar_url?: string;
          bio?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          duration: number | null;
          likes_count: number;
          comments_count: number;
          shares_count: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          creator_id: string;
          title: string;
          description?: string;
          video_url: string;
          thumbnail_url?: string;
          duration?: number;
        };
        Update: {
          title?: string;
          description?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          video_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          video_id: string;
          user_id: string;
          parent_comment_id?: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
    };
  };
};

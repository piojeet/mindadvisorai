"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useProfile } from "./useProfile";
import { useToast } from "./use-toast";

/* =========================
   TYPES
========================= */

export interface CommunityPost {
  id: string;
  content: string;
  topic: string;
  upvotes: number;
  created_at: string;
  anonymous_name: string;
  has_voted: boolean;
  is_own_post: boolean;
  comment_count: number;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  anonymous_name: string;
  is_own_comment: boolean;
}

/* =========================
   CONSTANTS
========================= */

const ANONYMOUS_NAMES = [
  "Anonymous Thinker",
  "Quiet Strategist",
  "Silent Observer",
  "Deep Analyst",
  "Mindful Scholar",
  "Curious Explorer",
  "Wise Wanderer",
  "Hidden Philosopher",
  "Shadow Mentor",
  "Peaceful Dreamer",
  "Bold Visionary",
  "Calm Warrior",
  "Swift Learner",
  "Patient Builder",
  "Brave Seeker",
];

const POST_COST = 2;
const COMMENT_COST = 1;

/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase client for community-related tables (untyped because they aren't in generated types)
const sb: any = supabase;

/* =========================
   HELPERS
========================= */

const generateAnonymousName = (userId: string, itemId: string) => {
  const combined = userId + itemId;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return ANONYMOUS_NAMES[Math.abs(hash) % ANONYMOUS_NAMES.length];
};

/* =========================
   HOOK
========================= */

export const useCommunity = () => {
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const { toast } = useToast();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     FETCH POSTS
  ========================= */

  const fetchPosts = useCallback(async () => {
    if (!user) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const postsResult = await sb
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });
      const postsData = postsResult.data as unknown[] | null | undefined;
      const postsError = postsResult.error as Error | null | undefined;

      if (postsError) throw postsError;

      const votesResult = await sb
        .from("community_votes")
        .select("post_id")
        .eq("user_id", user.id);
      const votesData = votesResult.data as { post_id: string }[] | null | undefined;
      const votesError = votesResult.error as Error | null | undefined;

      if (votesError) throw votesError;

      const commentsResult = await sb
        .from("community_comments")
        .select("post_id");
      const commentsData = commentsResult.data as { post_id: string }[] | null | undefined;
      const commentsError = commentsResult.error as Error | null | undefined;

      if (commentsError) throw commentsError;

      const userVotes = new Set(votesData?.map((v: { post_id: string }) => v.post_id));
      const countMap: Record<string, number> = {};

      commentsData?.forEach((c: { post_id: string }) => {
        countMap[c.post_id] = (countMap[c.post_id] || 0) + 1;
      });

      setPosts(
        (postsData as {
          id: string;
          content: string;
          topic: string;
          upvotes?: number;
          created_at: string;
          user_id: string;
        }[] | null | undefined ?? []).map(post => ({
          id: post.id,
          content: post.content,
          topic: post.topic,
          upvotes: post.upvotes ?? 0,
          created_at: post.created_at,
          anonymous_name: generateAnonymousName(post.user_id, post.id),
          has_voted: userVotes.has(post.id),
          is_own_post: post.user_id === user.id,
          comment_count: countMap[post.id] || 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* =========================
     CREATE POST
  ========================= */

  const createPost = async (content: string, topic: string) => {
    if (!user || !profile) return false;

    if (profile.credits < POST_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${POST_COST} credits to post.`,
        variant: "destructive",
      });
      return false;
    }

    if (content.length < 10) {
      toast({
        title: "Too short",
        description: "Post must be at least 10 characters.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await sb.from("community_posts").insert({
        user_id: user.id,
        content,
        topic,
      });

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ credits: profile.credits - POST_COST })
        .eq("id", user.id);

      await refreshProfile();
      await fetchPosts();

      toast({
        title: "Post Created",
        description: "Your anonymous thought is live!",
      });

      return true;
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     TOGGLE VOTE
  ========================= */

  const toggleVote = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.has_voted) {
        await sb
          .from("community_votes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        await sb.rpc("decrement_upvotes", { post_id: postId });
      } else {
        await sb
          .from("community_votes")
          .insert({ post_id: postId, user_id: user.id });

        await sb.rpc("increment_upvotes", { post_id: postId });
      }

      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                has_voted: !p.has_voted,
                upvotes: p.has_voted ? p.upvotes - 1 : p.upvotes + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Vote error:", err);
      toast({
        title: "Error",
        description: "Failed to update vote",
        variant: "destructive",
      });
    }
  };

  /* =========================
     COMMENTS
  ========================= */

  const fetchComments = async (postId: string): Promise<CommunityComment[]> => {
    if (!user) return [];

    const commentsResult = await sb
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    const data = commentsResult.data as {
      id: string;
      post_id: string;
      content: string;
      created_at: string;
      user_id: string;
    }[] | null | undefined;
    const error = commentsResult.error as Error | null | undefined;

    if (error) {
      console.error(error);
      return [];
    }

    return (data ?? []).map(
      (c: {
        id: string;
        post_id: string;
        content: string;
        created_at: string;
        user_id: string;
      }) => ({
        id: c.id,
        post_id: c.post_id,
        content: c.content,
        created_at: c.created_at,
        anonymous_name: generateAnonymousName(c.user_id, c.id),
        is_own_comment: c.user_id === user.id,
      })
    );
  };

  const createComment = async (postId: string, content: string) => {
    if (!user || !profile) return false;

    if (profile.credits < COMMENT_COST) {
      toast({
        title: "Insufficient Credits",
        description: "You need 1 credit to comment.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const { error } = await sb.from("community_comments").insert({
        post_id: postId,
        user_id: user.id,
        content,
      });

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ credits: profile.credits - COMMENT_COST })
        .eq("id", user.id);

      await refreshProfile();
      await fetchPosts();

      toast({
        title: "Comment Added",
        description: "Your comment is live!",
      });

      return true;
    } catch (err) {
      console.error("Comment error:", err);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     DELETE POST
  ========================= */

  const deletePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await sb
        .from("community_posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));

      toast({
        title: "Deleted",
        description: "Post removed successfully",
      });

      return true;
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
      return false;
    }
  };

  /* =========================
     RETURN
  ========================= */

  return {
    posts,
    isLoading,
    isSubmitting,
    createPost,
    toggleVote,
    fetchComments,
    createComment,
    deletePost,
    refreshPosts: fetchPosts,
    postCost: POST_COST,
    commentCost: COMMENT_COST,
  };
};

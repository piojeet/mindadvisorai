-- Add subscription fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_started_at timestamp with time zone;

-- Community Posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  topic TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Comments table
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Votes table (for tracking who voted on what)
CREATE TABLE public.community_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable RLS on all community tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- Community Posts RLS Policies
-- Anyone authenticated can view posts (anonymity is handled in the API by not exposing user_id)
CREATE POLICY "Users can view all posts" 
ON public.community_posts 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create posts" 
ON public.community_posts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.community_posts 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Community Comments RLS Policies
CREATE POLICY "Users can view all comments" 
ON public.community_comments 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create comments" 
ON public.community_comments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.community_comments 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Community Votes RLS Policies
CREATE POLICY "Users can view all votes" 
ON public.community_votes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can create votes" 
ON public.community_votes 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.community_votes 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Function to increment upvotes
CREATE OR REPLACE FUNCTION public.increment_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = post_id;
END;
$$;

-- Function to decrement upvotes
CREATE OR REPLACE FUNCTION public.decrement_upvotes(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = post_id;
END;
$$;
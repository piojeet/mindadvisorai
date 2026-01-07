"use client"
import { ArrowUp, ChevronDown, ChevronUp, Coins, MessageSquare, Send, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";

import { formatDistanceToNow } from "date-fns";
import { useProfile } from "@/hooks/useProfile";
import { CommunityComment, useCommunity } from "@/hooks/useCommunity";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const TOPICS = [
  { value: "Career", label: "Career" },
  { value: "Money", label: "Money" },
  { value: "Focus", label: "Focus" },
  { value: "Life", label: "Life" },
  { value: "Mental Clarity", label: "Mental Clarity" },
];

const TOPIC_COLORS: Record<string, string> = {
  Career: "bg-blue-500/10 text-blue-500",
  Money: "bg-green-500/10 text-green-500",
  Focus: "bg-purple-500/10 text-purple-500",
  Life: "bg-orange-500/10 text-orange-500",
  "Mental Clarity": "bg-teal-500/10 text-teal-500",
};

const PostCard = ({ 
  post, 
  onVote, 
  onDelete, 
  fetchComments, 
  createComment,
  commentCost,
}: {
  post: ReturnType<typeof useCommunity>["posts"][0];
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
  fetchComments: (id: string) => Promise<CommunityComment[]>;
  createComment: (postId: string, content: string) => Promise<boolean>;
  commentCost: number;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleToggleComments = async () => {
    if (!showComments) {
      setIsLoadingComments(true);
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
      setIsLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmittingComment(true);
    const success = await createComment(post.id, newComment.trim());
    if (success) {
      setNewComment("");
      // Refresh comments
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
    }
    setIsSubmittingComment(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{post.anonymous_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={TOPIC_COLORS[post.topic] || "bg-muted"}>
            {post.topic}
          </Badge>
        </div>

        {/* Content */}
        <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${post.has_voted ? "text-primary" : ""}`}
            onClick={() => onVote(post.id)}
          >
            <ArrowUp className={`w-4 h-4 ${post.has_voted ? "fill-current" : ""}`} />
            <span>{post.upvotes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleToggleComments}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count}</span>
            {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>

          {post.is_own_post && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive ml-auto"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {isLoadingComments ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="pl-4 border-l-2 border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.anonymous_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write an anonymous comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] text-sm resize-none"
                    maxLength={500}
                  />
                  <Button
                    size="icon"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Costs {commentCost} credit to comment
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function CommunityHome() {

  const { profile } = useProfile();
  const { 
    posts, 
    isLoading, 
    isSubmitting, 
    createPost, 
    toggleVote, 
    fetchComments, 
    createComment, 
    deletePost,
    postCost,
    commentCost,
  } = useCommunity();
  
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !selectedTopic) return;
    
    const success = await createPost(newPostContent.trim(), selectedTopic);
    if (success) {
      setNewPostContent("");
      setSelectedTopic("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-2">Community</h1>
      <p className="text-muted-foreground mb-6">Connect with like-minded thinkers anonymously</p>
      
      {/* Create Post Section */}
      <Card className="mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Post anonymously</span>
          </div>
          
          <Textarea
            placeholder="Share a thought anonymously..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px] mb-4 resize-none"
            maxLength={1000}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Coins className="w-4 h-4" />
                <span>{postCost} credits</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground">
                {profile?.credits || 0} credits available
              </span>
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || !selectedTopic || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2">No Posts Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share an anonymous thought with the community!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onVote={toggleVote}
              onDelete={deletePost}
              fetchComments={fetchComments}
              createComment={createComment}
              commentCost={commentCost}
            />
          ))}
        </div>
      )}
    </div>
  )
}

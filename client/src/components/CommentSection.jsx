import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Reply } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createComment,
  fetchCommentByBlog,
  updateComment,
  deleteComment,
} from "./api/comment";

const fetchComments = async (blogId) => {
  try {
    const response = await fetchCommentByBlog(blogId);
    return response.data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const postComment = async (blogId, content, parentId = null) => {
  try {
    const response = await createComment(blogId, content, parentId);
    return response.data.comment;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

const updateCommentById = async (commentId, content) => {
  try {
    const response = await updateComment(commentId, content);
    return response.data.comment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

const deleteCommentById = async (commentId) => {
  try {
    const response = await deleteComment(commentId);
    return response.data.comment;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

const groupCommentsByParent = (comments) => {
  const grouped = {};
  comments.forEach((comment) => {
    if (comment.parentComment) {
      if (!grouped[comment.parentComment]) {
        grouped[comment.parentComment] = [];
      }
      grouped[comment.parentComment].push(comment);
    }
  });
  return grouped;
};

const CommentInput = ({
  onSubmit,
  placeholder = "Write a comment...",
  loading,
}) => {
  const [content, setContent] = useState("");
  const { token } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || !token) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 border-t"
    >
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        disabled={!token || loading}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!content.trim() || !token || loading}
      >
        {loading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

const CommentItem = ({
  comment,
  replies = [],
  onReply,
  onUpdate,
  onDelete,
  isReply = false,
  parentInfo = null,
  groupedComments,
}) => {
  const { user } = useAuthStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const containerClass = isReply ? "ml-11" : "";
  const isMyComment = user && comment.author?._id === user.id;

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await onUpdate(comment._id, editContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment._id);
    }
  };

  return (
    <div>
      <div className={`${containerClass} space-y-2`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.profileImage} />
            <AvatarFallback>{comment.author?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">
                  {comment.author?.name}&nbsp;
                  <span className="text-xs text-muted-foreground">
                    ({comment?.author?.userName})
                  </span>
                </p>
                {isReply && parentInfo && (
                  <span className="text-xs text-muted-foreground">
                    replying to {parentInfo.author?.userName}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(comment.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {isEditing ? (
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mb-2"
                />
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="h-6 px-2 text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
              {isMyComment && !isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setEditContent(comment.content);
                    }}
                    className="h-6 px-2 text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-6 px-2 text-xs text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
            {isEditing && (
              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
        {showReplyInput && (
          <div className="ml-11">
            <CommentInput
              onSubmit={(content) => {
                onReply(content, comment._id);
                setShowReplyInput(false);
              }}
              placeholder="Write a reply..."
            />
          </div>
        )}
      </div>

      {replies && replies.length > 0 && (
        <div className="space-y-4 mt-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={groupedComments[reply._id] || []}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isReply={true}
              parentInfo={comment}
              groupedComments={groupedComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsDialog = ({ blogId, isOpen, onClose, incrementComment }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, blogId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await fetchComments(blogId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content, parentId = null) => {
    if (!token) return;
    setCommenting(true);
    try {
      await postComment(blogId, content, parentId);
      await loadComments();
      incrementComment();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommenting(false);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    if (!token) return;
    try {
      await updateCommentById(commentId, newContent);
      await loadComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    try {
      await deleteCommentById(commentId);
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const groupedComments = groupCommentsByParent(comments);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {loading ? (
              <div className="flex justify-center">
                <span className="animate-spin">⏳</span>
              </div>
            ) : comments.filter((c) => !c.parentComment).length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments
                .filter((comment) => !comment.parentComment)
                .map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    replies={groupedComments[comment._id] || []}
                    onReply={handleAddComment}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                    isReply={false}
                    groupedComments={groupedComments}
                  />
                ))
            )}
          </div>
        </ScrollArea>

        <CommentInput
          onSubmit={(content) => handleAddComment(content)}
          loading={commenting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;

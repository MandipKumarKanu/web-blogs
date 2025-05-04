import React, { useState, useEffect, useRef } from "react";
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
import {
  MessageCircle,
  Send,
  Reply,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  MoreHorizontal,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createComment,
  fetchCommentByBlog,
  updateComment,
  deleteComment,
} from "./api/comment";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DateHelper } from "./helper/dateHelper";

const fetchComments = async (blogId, sort = "newest") => {
  try {
    const response = await fetchCommentByBlog(blogId, sort);
    return response.data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const postComment = async (
  blogId,
  content,
  parentId = null,
  mentionedUsers = []
) => {
  try {
    const response = await createComment(
      blogId,
      content,
      parentId,
      mentionedUsers
    );
    return response.data.comment;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

const updateCommentById = async (commentId, content, mentionedUsers = []) => {
  try {
    const response = await updateComment(commentId, content, mentionedUsers);
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

const flattenCommentHierarchy = (comments) => {
  const parentMap = new Map();
  const rootComments = [];
  const replyMap = new Map();

  comments.forEach((comment) => {
    if (!comment.parentComment) {
      rootComments.push(comment);
      replyMap.set(comment._id, []);
    } else {
      if (!parentMap.has(comment._id)) {
        parentMap.set(comment._id, comment.parentComment);
      }
    }
  });

  const findRootParent = (commentId) => {
    let currentId = commentId;
    while (parentMap.has(currentId)) {
      currentId = parentMap.get(currentId);
      if (!parentMap.has(currentId)) {
        return currentId;
      }
    }
    return currentId;
  };

  comments.forEach((comment) => {
    if (comment.parentComment) {
      const rootParentId = findRootParent(comment.parentComment);
      if (replyMap.has(rootParentId)) {
        replyMap.get(rootParentId).push(comment);
      }
    }
  });

  replyMap.forEach((replies, parentId) => {
    replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });

  return { rootComments, replyMap };
};

const CommentInput = ({
  onSubmit,
  placeholder = "Write a comment...",
  loading,
  initialContent = "",
  isEdit = false,
  onCancel = null,
}) => {
  const [content, setContent] = useState(initialContent);
  const { token, user } = useAuthStore();
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEdit && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = content.trim();
    if (!trimmed || /^@\S+$/.test(trimmed) || !token) return;
    onSubmit(content);
    console.log("Submitting comment:", content);
    if (!isEdit) setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-2 p-4 border-t bg-background transition-all duration-300",
        isFocused && "border-primary/30 bg-accent/5"
      )}
    >
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "resize-none transition-all duration-300",
            isFocused ? "min-h-24" : "min-h-10"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={!token || loading}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted-foreground">
          {user ? (
            <span>
              Commenting as <span className="font-medium">{user.name}</span>
            </span>
          ) : (
            <span className="text-warning">
              You need to be logged in to comment
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-8"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={
              !content.trim() ||
              /^@\S+$/.test(content.trim()) ||
              !token ||
              loading
            }
            className="h-8 px-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3 animate-spin" />
                {isEdit ? "Updating..." : "Posting..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-3 w-3" />
                {isEdit ? "Update" : "Post"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

const ReplyItem = ({
  reply,
  onUpdate,
  onDelete,
  parentInfo,
  blogAuthorId,
  onReply,
}) => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);

  const isMyComment = user && reply.author?._id === user.id;
  const isDeleted = reply.isDeleted;

  const timeSinceCreation = formatDistanceToNow(
    DateHelper.toNPT(reply.createdAt),
    { addSuffix: true }
  );
  const formattedDate = format(
    DateHelper.toNPT(reply.createdAt),
    "MMM d, yyyy 'at' h:mm a"
  );

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await onUpdate(reply._id, editContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(reply._id);
      toast.success("Your comment has been removed");
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="group flex items-start gap-3 pl-10 mb-4 animate-fadeIn">
      <Link
        to={
          user && reply.author?._id === user.id
            ? "/profile"
            : `/profile/${reply.author?._id}`
        }
        className="block text-foreground hover:underline hover:text-primary transition-all duration-300"
      >
        <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300">
          <AvatarImage
            src={reply.author?.profileImage}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {reply.author?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1">
        <div className="bg-muted/50 hover:bg-muted/70 p-3 rounded-lg transition-all duration-300 group-hover:shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={
                user && reply.author?._id === user.id
                  ? "/profile"
                  : `/profile/${reply.author?._id}`
              }
              className="block text-foreground hover:underline transition-all duration-300"
            >
              <p className="font-semibold text-sm flex items-center gap-2">
                {reply.author?.name}
                <span className="text-xs text-muted-foreground">
                  @{reply?.author?.userName}
                </span>
                {blogAuthorId && reply.author?._id === blogAuthorId && (
                  <Badge
                    variant="outline"
                    className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                  >
                    Author
                  </Badge>
                )}
              </p>
            </Link>

            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Reply className="h-3 w-3" />
              {parentInfo && parentInfo.author && (
                <>@{parentInfo.author?.userName}</>
              )}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground ml-auto cursor-help">
                  {timeSinceCreation}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{formattedDate}</p>
              </TooltipContent>
            </Tooltip>

            {isMyComment && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full ml-1 hover:bg-accent"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditing(true);
                      setEditContent(reply.content);
                    }}
                    className="flex items-center gap-2 text-blue-500 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <CommentInput
              onSubmit={(content) => {
                handleSaveEdit(content);
                setEditContent(content);
              }}
              initialContent={editContent}
              isEdit={true}
              onCancel={() => setIsEditing(false)}
              placeholder="Edit your comment..."
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-3 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(reply.author?.userName, parentInfo._id)}
                className="h-6 px-2 text-xs flex items-center gap-1.5"
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  replies = [],
  onReply,
  onUpdate,
  onDelete,
  blogAuthorId,
  level = 0,
}) => {
  const { user } = useAuthStore();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replyToUsername, setReplyToUsername] = useState("");
  const commentRef = useRef(null);

  const isMyComment = user && comment.author?._id === user.id;
  const isDeleted = comment.isDeleted;
  const hasReplies = replies && replies.length > 0;

  const timeSinceCreation = formatDistanceToNow(
    DateHelper.toNPT(comment.createdAt),
    { addSuffix: true }
  );
  const formattedDate = format(
    DateHelper.toNPT(comment.createdAt),
    "MMM d, yyyy 'at' h:mm a"
  );

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await onUpdate(comment._id, editContent);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment._id);
      toast.success("Your comment has been removed");
    }
  };

  const handleReplyToReply = (username, parentId) => {
    setReplyToUsername(username);
    setShowReplyInput(true);
  };

  if (isDeleted && (!replies || replies.length === 0)) {
    return null;
  }

  return (
    <div ref={commentRef} className="mb-6" style={{ marginLeft: level * 24 }}>
      <div className="space-y-2 animate-fadeIn">
        {isDeleted ? (
          <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-muted/30 text-muted-foreground italic">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">This comment has been deleted</p>
          </div>
        ) : (
          <div className="group flex items-start gap-3">
            <Link
              to={
                user && comment.author?._id === user.id
                  ? "/profile"
                  : `/profile/${comment.author?._id}`
              }
              className="block text-foreground hover:underline hover:text-primary transition-all duration-300"
            >
              <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all duration-300">
                <AvatarImage
                  src={comment.author?.profileImage}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.author?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1">
              <div className="bg-muted/50 hover:bg-muted/70 p-3 rounded-lg transition-all duration-300 group-hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={
                      user && comment.author?._id === user.id
                        ? "/profile"
                        : `/profile/${comment.author?._id}`
                    }
                    className="block text-foreground hover:underline transition-all duration-300"
                  >
                    <p className="font-semibold text-sm flex items-center gap-2">
                      {comment.author?.name}
                      <span className="text-xs text-muted-foreground">
                        @{comment?.author?.userName}
                      </span>
                      {blogAuthorId && comment.author?._id === blogAuthorId && (
                        <Badge
                          variant="outline"
                          className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
                        >
                          Author
                        </Badge>
                      )}
                    </p>
                  </Link>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground ml-auto cursor-help">
                        {timeSinceCreation}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{formattedDate}</p>
                    </TooltipContent>
                  </Tooltip>

                  {isMyComment && !isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full ml-1 hover:bg-accent"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                          <span className="sr-only">Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setIsEditing(true);
                            setEditContent(comment.content);
                          }}
                          className="flex items-center gap-2 text-blue-500 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="flex items-center gap-2 text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {isEditing ? (
                  <CommentInput
                    onSubmit={(content) => {
                      handleSaveEdit(content);
                      setEditContent(content);
                    }}
                    initialContent={editContent}
                    isEdit={true}
                    onCancel={() => setIsEditing(false)}
                    placeholder="Edit your comment..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}

                {!isEditing && (
                  <div className="flex items-center gap-3 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyToUsername("");
                        setShowReplyInput(!showReplyInput);
                      }}
                      className="h-6 px-2 text-xs flex items-center gap-1.5"
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>

                    {hasReplies && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplies(!showReplies)}
                        className="h-6 px-2 text-xs flex items-center gap-1.5"
                      >
                        {showReplies ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        {replies.length}{" "}
                        {replies.length === 1 ? "Reply" : "Replies"}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {showReplyInput && !isEditing && (
                <div className="mt-3 pl-2 border-l-2 border-accent">
                  <CommentInput
                    onSubmit={(content) => {
                      onReply(content, comment._id);
                      setShowReplyInput(false);
                    }}
                    initialContent={`@${comment.author?.userName} `}
                    placeholder="Write your reply…"
                    onCancel={() => setShowReplyInput(false)}
                  />
                </div>
              )}

              {showReplies && hasReplies && (
                <div className="mt-4 space-y-6 border-l border-accent/40">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply._id}
                      comment={reply}
                      replies={[]}
                      onReply={onReply}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      blogAuthorId={blogAuthorId}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsDialog = ({
  blogId,
  isOpen,
  onClose,
  incrementComment,
  blogAuthorId,
}) => {
  const [commentsData, setCommentsData] = useState({
    allComments: [],
    filteredComments: [],
    rootComments: [],
    replyMap: new Map(),
  });
  const [loading, setLoading] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const { token, user } = useAuthStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, blogId]);

  useEffect(() => {
    if (commentsData.allComments.length > 0) {
      processComments(commentsData.allComments);
    }
  }, [sort, filter]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await fetchComments(blogId, "newest");
      setCommentsData((prevState) => ({
        ...prevState,
        allComments: fetchedComments,
      }));
      processComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processComments = (comments) => {
    let filteredComments = [...comments];
    if (filter === "mine" && user) {
      filteredComments = comments.filter((c) => c.author?._id === user.id);
    } else if (filter === "author") {
      filteredComments = comments.filter((c) => c.author?._id === blogAuthorId);
    }

    if (sort === "newest") {
      filteredComments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "oldest") {
      filteredComments.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    const { rootComments, replyMap } =
      flattenCommentHierarchy(filteredComments);

    setCommentsData((prevState) => ({
      ...prevState,
      filteredComments,
      rootComments,
      replyMap,
    }));
  };

  const handleAddComment = async (content, parentId = null) => {
    if (!token) {
      toast.error("You need to log in to post comments");
      return;
    }

    setActiveReplyId(null);
    setCommenting(true);
    try {
      await postComment(blogId, content, parentId);
      await loadComments();
      incrementComment();
      toast.success("Your comment has been added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setCommenting(false);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    if (!token) return;
    try {
      await updateCommentById(commentId, newContent);
      await loadComments();
      toast.success("Your changes have been saved");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    try {
      await deleteCommentById(commentId);
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const commentCount = commentsData.filteredComments.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5" />
              Comments ({commentCount})
            </DialogTitle>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
            <Tabs
              value={sort}
              onValueChange={setSort}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="oldest">Oldest</TabsTrigger>
              </TabsList>
            </Tabs>

            {user && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "mine" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => setFilter("mine")}
                >
                  My Comments
                </Button>
                <Button
                  variant={filter === "author" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => setFilter("author")}
                >
                  Author's
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-4" ref={scrollRef}>
          <div className="space-y-6 py-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading comments...
                  </p>
                </div>
              </div>
            ) : commentsData.rootComments.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-3">
                <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
                {filter !== "all" ? (
                  <p>
                    No{" "}
                    {filter === "mine"
                      ? "comments from you"
                      : "comments from the author"}{" "}
                    yet.
                  </p>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            ) : (
              commentsData.rootComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  replies={commentsData.replyMap.get(comment._id) || []}
                  onReply={handleAddComment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  isReply={false}
                  blogAuthorId={blogAuthorId}
                  activeReplyId={activeReplyId}
                  setActiveReplyId={setActiveReplyId}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t">
          <CommentInput
            onSubmit={(content) => handleAddComment(content)}
            loading={commenting}
            placeholder="Write a comment..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;

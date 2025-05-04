import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import parse from "html-react-parser";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  MoreVertical,
  Edit,
  Heart,
  MessageCircleDashed,
  Share2,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "./api/blog";

const UserBlogs = ({ blogs, loadingBlogs, onDeleteBlog, pId }) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(
    (blog) => {
      navigate(`/edit/${blog._id}`, { state: { blog } });
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (blogId) => {
      if (window.confirm("Are you sure you want to delete this blog post?")) {
        await deleteBlog(blogId);
      }
    },
    [onDeleteBlog]
  );

  if (loadingBlogs) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You haven't published any blogs yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1">
      {blogs &&
        blogs.map((post) => (
          <Card
            key={post._id}
            className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </div>

              <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {format(new Date(post.publishedAt), "PPP")}
                  </div>
                  <Link to={`/blog/${post._id}`}>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight line-clamp-1 hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="text-muted-foreground mb-6 line-clamp-2">
                    {parse(post.content)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                      <MessageCircleDashed className="h-4 w-4 text-blue-500" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                      <Share2 className="h-4 w-4 text-blue-500" />
                      <span>{post.shares || 0}</span>
                    </div>
                  </div>

                  {!pId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post._id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default UserBlogs;

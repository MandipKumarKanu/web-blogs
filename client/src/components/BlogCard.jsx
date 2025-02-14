import React from "react";
import { Button } from "./ui/button";
import {
  CalendarDays,
  Heart,
  MessageCircleDashed,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const BlogCard = ({ post, selectedCategory }) => {
  return (
    <Card className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {selectedCategory === "All" && (
            <div className="absolute top-4 left-4">
              <div className="bg-primary/60 rounded-full text-xs text-white px-4 py-1">
                {post?.categories?.[0] || "Other"}
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <Link to={`/blog/${post._id}`}>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight line-clamp-1 hover:text-primary transition-colors duration-300">
                {post.title}
              </h3>
            </Link>
            <p className="text-muted-foreground mb-6 line-clamp-2 group-hover:text-muted-foreground/80">
              {parse(post.content)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>{post?.likes?.length > 0 ? post.likes.length : 0}</span>
              </div>

              <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                <MessageCircleDashed className="h-4 w-4 text-blue-500" />
                <span>
                  {post?.comment?.length > 0 ? post.comment.length : 0}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                <span>
                  {post?.shares?.length > 0 ? post?.shares?.length : 0}
                </span>
              </div>
            </div>

            <Link to={`blog/${post._id}`}>
              <Button
                variant="ghost"
                className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
              >
                Read Article
                <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 " />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BlogCard;

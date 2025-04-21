import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, User2, Heart, Share2, ArrowUpRight } from "lucide-react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const VerticalCard = ({ post }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={post.image}
          loading="lazy"
          alt={post.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4">
          <div className="bg-primary/60 rounded-full text-xs text-white px-4 py-1">
            {post?.category?.[0]?.name}
          </div>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col justify-between">
        <div>
          <Link to={`/blog/${post?._id}`}>
            <h3 className="text-xl font-bold mb-4 leading-tight line-clamp-2 hover:text-primary transition-colors duration-300">
              {post.title}
            </h3>
          </Link>
          <div className="text-muted-foreground mb-6 line-clamp-3">
            {parse(post.content)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-primary" />
            {post.author?.name || "Unknown Author"}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>{post?.likes?.length > 0 ? post.likes.length : 0}</span>
            </div>

            <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
              <Share2 className="h-4 w-4 text-blue-500" />
              <span>{post?.shares?.length > 0 ? post?.shares?.length : 0}</span>
            </div>
          </div>

          <Link to={`/blog/${post?._id}`}>
            <Button
              variant="ghost"
              className="group rounded-full px-6 py-3 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              Read Article
              <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerticalCard;

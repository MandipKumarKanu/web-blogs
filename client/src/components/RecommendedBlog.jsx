import React, { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Share2 } from "lucide-react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getRecommended } from "./api/blog";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const BlogCard = ({ blog }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-lg flex-shrink-0 w-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardHeader className="space-y-2 p-4">
        <Link to={`/blog/${blog?._id}`}>
          <h2 className="text-xl font-semibold text-foreground mb-4 leading-tight line-clamp-2 h-[3rem] overflow-hidden hover:text-primary transition-colors duration-300">
            {blog.title}
          </h2>
        </Link>
        <div className="text-sm text-muted-foreground">
          {blog?.categories?.[0]}
        </div>
      </CardHeader>

      <div className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2 cursor-pointer">
            <FaRegHeart className="h-4 w-4 text-gray-500" />
            <span>{blog.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2 cursor-pointer">
            <Share2 className="h-4 w-4 text-blue-500" />
            <span>{blog?.shares || 0}</span>
          </div>
        </div>
        <Link to={`/blog/${blog?._id}`}>
          <Button
            variant="ghost"
            className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
          >
            Read Article
            <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 " />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const RecommendedBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getRecommended();
        setBlogs(response.data.blog);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              className="animate-pulse hover:shadow-lg flex-shrink-0 w-full"
            >
              <Skeleton className="h-48" />
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-6 w-full rounded" />
              </CardHeader>
              <CardFooter className="justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        Error loading blogs: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-semibold text-foreground mb-8 text-center">
        Similar News
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedBlog;

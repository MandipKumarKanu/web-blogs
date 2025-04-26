import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { featuredData } from "./featuredData";
import { useBlogStore } from "@/store/useBlogStore";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { Skeleton } from "./ui/skeleton";

const FeaturedCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-lg">
      <div className="relative w-full h-56 md:h-72 bg-muted">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
};

const Featured = () => {
  const { popularMonthBlog, popLoading, popError, getPopularMonthBlog } =
    useBlogStore();

  useEffect(() => {
    if (!popularMonthBlog || popularMonthBlog.length === 0)
      getPopularMonthBlog();
  }, []);

  if (popLoading) {
    return (
      <section className="container mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight ">
            Featured Blogs
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Explore the most popular and impactful articles on the web this
            month.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeaturedCardSkeleton />
          <FeaturedCardSkeleton />
          <FeaturedCardSkeleton />
        </div>
      </section>
    );
  }

  if (popError) {
    return <div>Error loading popular blogs.</div>;
  }

  return (
    <section className="container mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight ">
          Featured Blogs
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Explore the most popular and impactful articles on the web this month.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {popularMonthBlog &&
          popularMonthBlog.slice(0, 3).map((blog) => (
            <Card
              key={blog.id}
              className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden rounded-lg"
            >
              <Link
                to={`/blog/${blog._id}`}
                className="relative w-full h-56 md:h-72 overflow-hidden block"
                tabIndex={-1}
              >
                <div className="absolute inset-0">
                  <img
                    src={blog.image}
                    loading="lazy"
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </Link>
              <CardContent className="p-6">
                <Link to={`/blog/${blog._id}`}>
                  <h3 className="text-2xl font-bold mb-4 leading-tight line-clamp-2 overflow-hidden hover:text-primary transition-colors duration-300">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {parse(blog.content)}
                </p>
                <Link to={`/blog/${blog._id}`}>
                  <Button
                    variant="ghost"
                    className="group w-full sm:w-auto rounded-lg px-6 py-3 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
                  >
                    Read Article
                    <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default Featured;

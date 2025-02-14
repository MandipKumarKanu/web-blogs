import React, { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PopularCard from "@/components/PopularCard";

const PopularBlog = () => {
  const { getAllPopular, loading, blogs, error } = useBlogStore();

  useEffect(() => {
    fetchPopular();
  }, []);

  const fetchPopular = async () => {
    await getAllPopular();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-[400px] rounded-[2rem] bg-muted/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive bg-destructive/10 p-6 rounded-xl inline-block">
          {error}
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-muted-foreground bg-muted/10 p-6 rounded-xl inline-block">
          No popular blogs found.
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Trending <span className="text-primary">Insights</span>
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 group rounded-full px-6 py-5 border-2"
          >
            <span className="tracking-wide">Explore All</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {blogs.map((blog, index) => (
            <PopularCard post={blog} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBlog;

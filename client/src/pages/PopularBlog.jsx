import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBlogStore } from "@/store/useBlogStore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PopularCard from "@/components/PopularCard";

const PopularBlog = () => {
  const { getAllPopular, currentPage, loading, error, totalPages } =
    useBlogStore();
  const [popularBlogs, setPopularBlogs] = useState([]);
  const hasFetched = useRef(false);

  const fetchPopular = async (page = 1) => {
    try {
      const result = await getAllPopular(page, 15);
      if (result && Array.isArray(result)) {
        setPopularBlogs((prev) => [...prev, ...result]);
      }
    } catch (err) {
      console.error("Failed to fetch popular blogs:", err);
    }
  };

  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchPopular(nextPage);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchPopular(1);
      hasFetched.current = true;
    }
  }, []);

  if (loading && popularBlogs.length === 0) {
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

  if (!popularBlogs || popularBlogs.length === 0) {
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

        <InfiniteScroll
          dataLength={popularBlogs.length}
          next={fetchMoreData}
          hasMore={currentPage < totalPages}
          loader={
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-8">
            {popularBlogs.map((blog, index) => (
              <PopularCard post={blog} key={`${blog._id}-${index}`} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default PopularBlog;

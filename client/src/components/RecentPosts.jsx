import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import RecentCard from "@/components/RecentCard";
import { useBlogStore } from "@/store/useBlogStore";
import { PopularCardSkeleton } from "./PopularCardSkeleton";

const RecentPosts = () => {
  const { blogs, getAllBlogs, loading, error, totalPages } = useBlogStore();

  useEffect(() => {
    getAllBlogs(1, 10);
  }, []);

  const displayedBlogs = useMemo(() => blogs?.slice(0, 6) || [], [blogs]);

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 md:mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Recent Posts: Stay Informed
          </h2>
          <Button
            variant="outline"
            size="lg"
            className="max-w-44 rounded-full px-8 py-6 text-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            View All Articles
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 mt-4">
            {[...Array(5)].map((_, i) => (
              <PopularCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-8">
            Failed to load posts. Please try again later.
          </div>
        ) : (
          <div className="space-y-8">
            {displayedBlogs.length > 0 ? (
              displayedBlogs.map((post) => <RecentCard key={post._id} post={post} />)
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No recent posts found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;

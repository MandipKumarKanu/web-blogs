import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RecentCard from "@/components/RecentCard";
import { useBlogStore } from "@/store/useBlogStore";

const RecentPosts = () => {
  const { blogs, getAllBlogs, loading, error, totalPages } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getAllBlogs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 md:mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
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

        <div className="space-y-8">
          {blogs && blogs.slice(0, 4).map((post, key) => (
            <RecentCard key={key} post={post}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;

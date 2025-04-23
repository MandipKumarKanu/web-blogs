import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getByCategory } from "@/components/api/blog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 10;

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("name") || "Category";

  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogs = async (pageNum = 1) => {
    try {
      const response = await getByCategory(category, pageNum, PAGE_SIZE);
      const blogs = response.data.blogs;

      if (!blogs || blogs.length === 0) {
        setHasMore(false);
        return;
      }

      setFilteredData((prev) => [...prev, ...blogs]);

      if (blogs.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredData([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchBlogs(1);
  }, [category]);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    fetchBlogs(nextPage);
    setPage(nextPage);
  };

  if (loading && filteredData.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Insights in <span className="text-primary">{categoryName}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the latest articles and insights about{" "}
              {categoryName.toLowerCase()}
            </p>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <InfiniteScroll
            dataLength={filteredData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <div className="grid grid-cols-1 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6">
              {filteredData.map((blog) => (
                <div
                  key={blog.id}
                  className="transform hover:-translate-y-1 transition-transform duration-200"
                >
                  <BlogCard post={blog} />
                </div>
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-foreground mb-2">
              No Articles Found
            </h3>
            <p className="text-muted-foreground">
              There are currently no articles available in the{" "}
              {category.toLowerCase()} category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;

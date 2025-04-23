import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PopularCard from "@/components/PopularCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogStore } from "@/store/useBlogStore";
import { ArrowRight } from "lucide-react";
import { PopularCardSkeleton } from "@/components/PopularCardSkeleton";

const PAGE_SIZE = 15;

const NewBlog = () => {
  const { getAllBlogs, loading, error, totalPages } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    if (!hasMore) return;

    try {
      const nextPage = currentPage + 1;
      const newBlogs = await getAllBlogs(nextPage, PAGE_SIZE);

      if (!newBlogs || newBlogs.length === 0 || nextPage >= totalPages) {
        setHasMore(false);
        return;
      }

      setBlogs((prev) => [...prev, ...newBlogs]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error fetching more blogs:", err);
    }
  };

  useEffect(() => {
    const loadInitialBlogs = async () => {
      try {
        const initialBlogs = await getAllBlogs(1, PAGE_SIZE);
        setBlogs(initialBlogs);
        if (1 >= totalPages || !initialBlogs || initialBlogs.length === 0) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching initial blogs:", err);
      }
    };
    loadInitialBlogs();
  }, [getAllBlogs, totalPages]);

  if (loading && !blogs) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <PopularCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
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

  if (!blogs && !loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-muted-foreground bg-muted/10 p-6 rounded-xl inline-block">
          No recent blogs found.
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Recent <span className="text-primary">Insights</span>
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
          dataLength={blogs.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-1 gap-8 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <PopularCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-8">
            {blogs.map((blog, index) => (
              <PopularCard post={blog} key={`${blog._id}-${index}`} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
};

export default NewBlog;

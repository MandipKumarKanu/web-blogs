import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PopularCard from "@/components/PopularCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogStore } from "@/store/useBlogStore";
import { ArrowRight } from "lucide-react";

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

  if (loading && blogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
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
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

import { useCallback, useEffect, useRef, useState } from "react";
import PopularCard from "@/components/PopularCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogStore } from "@/store/useBlogStore";
import { ArrowRight } from "lucide-react";

const NewBlog = () => {
  const { getAllBlogs, loading, error, totalPages } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const lastScrollY = useRef(0);
  const scrollThreshold = 300; // Scroll height threshold to trigger fetch

  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Function to load more data if not already loading and pages remain
  const loadMore = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, currentPage, totalPages]);

  // Scroll event listener for more reliable triggering
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrolledDistance = currentScrollY - lastScrollY.current;
    if (scrolledDistance > scrollThreshold) {
      lastScrollY.current = currentScrollY;
      loadMore();
    }
  }, [loadMore]);

  // Set up both Intersection Observer and scroll event listener
  useEffect(() => {
    // Intersection Observer observes the loading indicator element
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );
    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (observerRef.current && loadingRef.current) {
        observerRef.current.unobserve(loadingRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, handleScroll]);

  // Fetch blogs when currentPage changes
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch initial 25 blogs on first page
        const pageSize = currentPage === 1 ? 25 : 15;
        const newBlogs = await getAllBlogs(currentPage, pageSize);

        if (currentPage === 1) {
          setBlogs(newBlogs); // Set the initial blogs
        } else {
          // Remove the first 10 blogs and append the new ones
          setBlogs((prevBlogs) => {
            const updatedBlogs = [...prevBlogs.slice(10), ...newBlogs];
            return updatedBlogs;
          });
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [currentPage, getAllBlogs]);

  // Render skeleton while loading initial data
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

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive bg-destructive/10 p-6 rounded-xl inline-block">
          {error}
        </div>
      </div>
    );
  }

  // Render empty state if no blogs available
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

        <div className="grid grid-cols-1 gap-8">
          {blogs.map((blog, index) => (
            <PopularCard post={blog} key={`${blog._id}-${index}`} />
          ))}
        </div>

        {/* Loading indicator also used as the observer target */}
        <div ref={loadingRef} className="mt-8">
          {loading && (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBlog;

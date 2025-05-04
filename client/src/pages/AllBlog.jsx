import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBlogStore } from "@/store/useBlogStore";
import PostCard from "@/components/PostCard";

const AllBlog = () => {
  const { blogs, getAllBlogs, loading, error } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const fetchMoreBlogs = async () => {
    try {
      await getAllBlogs(currentPage, pageSize);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Error fetching more blogs:", err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchMoreBlogs();
  }, []);

  if (loading) {
    return <>Loading....</>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>

      {error && <p className="text-red-500">{error}</p>}

      {blogs && (
        <InfiniteScroll
          dataLength={blogs.length}
          next={fetchMoreBlogs}
          hasMore={hasMore}
          loader={<p className="text-center">Loading...</p>}
          endMessage={
            <p className="text-center font-semibold mt-4">
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-6">
            {blogs.map((blog) => (
              <PostCard blog={blog} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default AllBlog;

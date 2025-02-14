import React, { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import PostCard from "@/components/PostCard";

const AllBlog = () => {
  const { blogs, getAllBlogs, loading, error, totalPages } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getAllBlogs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleNextPage = () => {
    getAllBlogs(currentPage + 1, pageSize);
  };

  const handlePrevPage = () => {
    getAllBlogs(currentPage - 1, pageSize);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {blogs &&
          blogs.map((blog) => (
            <PostCard
              id={blog._id}
              author={blog.author}
              category={blog.category}
              comments={blog.comments}
              date={blog.publishedAt}
              image={blog.image}
              likes={blog.likes}
              shares={blog.shares}
              title={blog.title}
              key={blog._id}
              content={blog.content}
            />
          ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllBlog;

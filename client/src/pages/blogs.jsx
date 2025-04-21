import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { customAxios } from "@/components/config/axios";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBlogs = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await customAxios.get(
        `/blogs/admin?page=${currentPage}&limit=10`
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to fetch blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      fetchBlogs(page);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await customAxios.get(
        `/blogs/searchByQuery?q=${encodeURIComponent(query)}`
      );
      setBlogs(response.data);
      setTotalPages(1);
    } catch (error) {
      console.error("Error searching blogs:", error);
      setError("Failed to search blogs. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    fetchBlogs(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await customAxios.delete(`/blogs/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your blog content
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Label htmlFor="search" className="sr-only">
              Search posts
            </Label>
            <Input
              id="search"
              placeholder="Search posts..."
              className="w-full"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onInput={(e) => {
                if (e.target.value === "") handleClearSearch();
              }}
            />
            {query && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <div className="overflow-x-auto border-collapse border border-border bg-card rounded-lg">
          {loading ? (
            <p className="text-center py-4">Loading blogs...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : (
            <table className="min-w-full ">
              <thead>
                <tr className="bg-muted/10">
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Tags
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Author
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className={`border-t border-border ${
                      index % 2 === 0 ? "bg-muted/5" : "bg-card"
                    }`}
                  >
                    <td className="px-4 py-2 text-sm text-foreground">
                      #{blog._id.slice(-4)}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      {blog.title}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      {blog.category.map((cat) => cat.name).join(", ") ||
                        "Uncategorized"}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      {blog.tags?.map((tag) => tag.name).join(", ") ||
                        "No Tags"}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      {blog.author?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          blog.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : blog.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-foreground">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(blog._id)}
                        >
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEdit(blog._id)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-500"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          <p>
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
};

export default BlogsPage;

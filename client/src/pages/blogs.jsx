import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { customAxios } from "@/components/config/axios";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/reactTable";

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
      setPage(1);
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

  const handleCreatePost = () => {
    navigate("/create");
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const customSearchComponent = (
    <div className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <Label htmlFor="search" className="sr-only">
          Search posts
        </Label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="search"
          placeholder="Search posts..."
          className="w-full pl-10"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onInput={(e) => {
            if (e.target.value === "") handleClearSearch();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
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
      <Button variant="outline" onClick={handleSearch} disabled={searchLoading}>
        {searchLoading ? "Searching..." : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        cell: ({ row }) => `#${row.original._id.slice(-4)}`,
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) =>
          row.original.category?.map((cat) => cat.name).join(", ") ||
          "Uncategorized",
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) =>
          row.original.tags?.map((tag) => tag.name).join(", ") || "No Tags",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => row.original.author?.name || "Unknown",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const statusClass =
            status === "Published"
              ? "bg-green-100 text-green-800"
              : status === "Draft"
              ? "bg-yellow-100 text-yellow-800"
              : status === "scheduled"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800";

          const formattedStatus =
            status.charAt(0).toUpperCase() + status.slice(1);

          if (status === "scheduled" && row.original.scheduledPublishDate) {
            const date = new Date(row.original.scheduledPublishDate);
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date);

            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClass}`}
                    >
                      {formattedStatus}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Scheduled for: {formattedDate}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          if (status === "published" && row.original.publishedAt) {
            const date = new Date(row.original.publishedAt);
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(date);

            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClass}`}
                    >
                      {formattedStatus}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Published on: {formattedDate}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClass}`}
            >
              {formattedStatus}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(row.original._id)}
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
                <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original._id)}
                  className="text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        meta: {
          className: "text-right",
        },
      },
    ],
    []
  );

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
          <Button onClick={handleCreatePost}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        {customSearchComponent}

        <div className="overflow-x-auto border-collapse border border-border bg-card rounded-lg">
          {loading || searchLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={blogs}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={page}
              isLoading={false}
              blogStyle={true}
              hideSearch={true}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogsPage;

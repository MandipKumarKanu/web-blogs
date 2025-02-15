import DataTable from "@/components/reactTable";
import { toDateOnlyISO } from "@/components/utils/DateConverter";
import { useBlogStore } from "@/store/useBlogStore";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Eye, X } from "lucide-react";
import { approveBlog, rejectBlog } from "@/components/api/blog";
import parse from "html-react-parser";

const ApproveBlog = () => {
  const { blogs, getUnBlogs, loading, error, totalPages } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [getUnBlogs, currentPage, pageSize]);
  const fetchData = async () => {
    await getUnBlogs(currentPage, pageSize);
  };

  const handleApprove = async (blogId) => {
    // console.log(blogId);
    await approveBlog(blogId);
    fetchData();
  };

  const handleReject = async (blogId) => {
    await rejectBlog(blogId);
    fetchData();
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No.",
        cell: (rowData) =>
          (currentPage - 1) * pageSize + Number(rowData.row.id) + 1 + ".",
      },
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue()}</span>
        ),
      },
      {
        header: "Content",
        accessorKey: "content",
        cell: ({ getValue }) => {
          const text = getValue();
          return (
            <span className="text-sm text-muted-foreground">
              {parse(text.length > 100 ? text.substring(0, 100) + "..." : text)}
            </span>
          );
        },
      },
      {
        header: "Author",
        accessorFn: (row) => row.author?.name || "N/A",
      },
      {
        header: "Tags",
        accessorFn: (row) =>
          row.tags && row.tags.length > 0 ? row.tags.join(", ") : "N/A",
      },
      {
        header: "Categories",
        accessorFn: (row) =>
          row.categories && row.categories.length > 0
            ? row.categories.join(", ")
            : "N/A",
      },
      {
        header: "Status",
        accessorFn: (row) =>
          row.scheduled
            ? `Scheduled (${toDateOnlyISO(row.scheduledPublishDate)})`
            : row.status,
        cell: ({ row, getValue }) => {
          if (row.original.scheduled) {
            return (
              <div className="flex flex-col">
                <span className="font-semibold text-primary">Scheduled</span>
                <span className="text-xs text-muted-foreground">
                  {toDateOnlyISO(row.original.scheduledPublishDate)}
                </span>
              </div>
            );
          }
          return (
            <span className="capitalize text-foreground">{getValue()}</span>
          );
        },
      },
      {
        header: "Created At",
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const blogId = row.original._id;
          return (
            <div className="flex gap-2">
              {/* {console.log(row)} */}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBlog(row.original);
                  setIsDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="success"
                onClick={() => handleApprove(blogId)}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(blogId)}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [currentPage, pageSize]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-fulf  mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Pending Blog Approvals
      </h1>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive mb-4">
          Error: {error}
        </div>
      )}

      {blogs.length > 0 ? (
        <>
          {/* <div className="bg-background shadow rounded-lg p-4 overflow-x-auto"> */}
          {/* <div className=""> */}
          <DataTable
            data={blogs}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
          {/* </div> */}
          {/* </div> */}

          {isDialogOpen && selectedBlog && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-lg">
                <DialogHeader className="space-y-2 border-b pb-2 mb-4">
                  <DialogTitle className="text-2xl font-semibold text-foreground">
                    {selectedBlog.title}
                  </DialogTitle>
                  <DialogClose
                    className="text-muted-foreground"
                    onClick={() => setIsDialogOpen(false)}
                  />
                </DialogHeader>
                {/* Use the shadcn ScrollArea for a custom, non-default scrollbar */}
                <ScrollArea className="h-[calc(90vh-120px)]">
                  <div className="space-y-6 p-4">
                    <div className="aspect-video relative overflow-hidden rounded-lg shadow">
                      <img
                        src={
                          selectedBlog.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={selectedBlog.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Author
                        </h3>
                        <p className="bg-muted p-3 rounded-lg">
                          {selectedBlog.author?.name || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Created At
                        </h3>
                        <p className="bg-muted p-3 rounded-lg">
                          {new Date(
                            selectedBlog.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Tags
                        </h3>
                        <p className="bg-muted p-3 rounded-lg">
                          {(selectedBlog.tags &&
                            selectedBlog.tags.join(", ")) ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Categories
                        </h3>
                        <p className="bg-muted p-3 rounded-lg">
                          {(selectedBlog.categories &&
                            selectedBlog.categories.join(", ")) ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Status
                        </h3>
                        <p className="bg-muted p-3 rounded-lg">
                          {selectedBlog.scheduled
                            ? `Scheduled (${toDateOnlyISO(
                                selectedBlog.scheduledPublishDate
                              )})`
                            : selectedBlog.status}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Content
                      </h3>
                      <div className="prose max-w-none bg-muted p-4 rounded-lg">
                        {parse(selectedBlog.content)}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="success"
                        onClick={() => {
                          handleApprove(selectedBlog._id);
                          setIsDialogOpen(false);
                        }}
                      >
                        Approve Blog
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleReject(selectedBlog._id);
                          setIsDialogOpen(false);
                        }}
                      >
                        Reject Blog
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        !loading && (
          <p className="text-center text-muted-foreground mt-8">
            No blogs found
          </p>
        )
      )}
    </div>
  );
};

export default ApproveBlog;

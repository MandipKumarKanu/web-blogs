import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderTree, Plus, Search } from "lucide-react";
import { customAxios } from "@/components/config/axios";
import { toast } from "sonner";
import getErrorMessage from "@/components/utils/getErrorMsg";

const tagSchema = z.object({
  name: z
    .string()
    .nonempty("Tag name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
});

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTags = async (page = 1) => {
    setLoading(true);
    try {
      const response = await customAxios.get(`/tags?page=${page}&limit=10`);
      setTags(response.data.tags);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateTag = async (data) => {
    try {
      if (editingTag) {
        await customAxios.patch(`/tags/${editingTag._id}`, data);
        toast.success("Tag updated successfully!");
      } else {
        await customAxios.post("/tags", data);
        toast.success("Tag created successfully!");
      }
      fetchTags(page);
      handleDialogClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteTag = async (tagId) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await customAxios.delete(`/tags/${tagId}`);
        toast.success("Tag deleted successfully!");
        fetchTags(page);
      } catch (error) {
        console.error("Error deleting tag:", error);
        toast.error("Error deleting tag");
      }
    }
  };

  useEffect(() => {
    fetchTags(page);
  }, [page]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tagSchema),
  });

  const handleDialogOpen = (tag = null) => {
    setEditingTag(tag);
    if (tag) {
      setValue("name", tag.name);
    } else {
      reset();
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    reset();
    setEditingTag(null);
    setIsDialogOpen(false);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            <p className="text-muted-foreground mt-1">
              Manage your content tags
            </p>
          </div>
          <Button onClick={() => handleDialogOpen(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search tags
            </Label>
            <Input
              id="search"
              placeholder="Search tags..."
              className="w-full"
              type="search"
            />
          </div>
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tag List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FolderTree className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{tag.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                         id: #{tag._id.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDialogOpen(tag)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTag(tag._id)}
                      >
                        Delete
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <p>
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Edit Tag" : "Add Tag"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => {
              createOrUpdateTag(data);
            })}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  placeholder="Enter tag name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <Button type="submit">{editingTag ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default TagsPage;

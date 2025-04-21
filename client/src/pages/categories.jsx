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

const categorySchema = z.object({
  name: z
    .string()
    .nonempty("Category name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
});

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await customAxios.get(
        `/categories?page=${page}&limit=10`
      );
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateCategory = async (data) => {
    try {
      if (editingCategory) {
        await customAxios.patch(`/categories/${editingCategory._id}`, data);
        toast.success("Category updated successfully!");
      } else {
        await customAxios.post("/categories", data);
        toast.success("Category created successfully!");
      }
      fetchCategories(page);
      handleDialogClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await customAxios.delete(`/categories/${categoryId}`);
        toast.success("Category deleted successfully!");
        fetchCategories(page);
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category");
      }
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const handleDialogOpen = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setValue("name", category.name);
    } else {
      reset();
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    reset();
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage your content categories
            </p>
          </div>
          <Button onClick={() => handleDialogOpen(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search categories
            </Label>
            <Input
              id="search"
              placeholder="Search categories..."
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
            <CardTitle>Category List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FolderTree className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                         id: #{category._id.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDialogOpen(category)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCategory(category._id)}
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
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => {
              createOrUpdateCategory(data);
            })}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <Button type="submit">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CategoriesPage;

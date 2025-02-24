import React, { useState, useCallback, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/ui/multi-select";
import { CKEditorComp } from "./ckEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { Card } from "./ui/card";
import { onUpdateBlog } from "./api/blog";

const EditBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const initialBlog = location.state?.blog;

  const [imagePreview, setImagePreview] = useState(initialBlog?.image || null);
  const [desc, setDesc] = useState(initialBlog?.content || "");
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm({
    defaultValues: {
      title: initialBlog?.title || "",
      content: initialBlog?.content || "",
      status: initialBlog?.status || "pending",
      scheduledPublishDate: initialBlog?.scheduledPublishDate
        ? new Date(initialBlog.scheduledPublishDate)
        : null,
      tags: initialBlog?.tags || [],
      categories: initialBlog?.categories || [],
    },
  });

  const tagOptions = useMemo(
    () => [
      { value: "Technology", label: "Technology" },
      { value: "Programming", label: "Programming" },
      { value: "Design", label: "Design" },
      { value: "Travel", label: "Travel" },
      { value: "Lifestyle", label: "Lifestyle" },
      { value: "Food", label: "Food" },
      { value: "Health", label: "Health" },
      { value: "Science", label: "Science" },
      { value: "Art", label: "Art" },
      { value: "Music", label: "Music" },
      { value: "Education", label: "Education" },
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { value: "Tech Blog", label: "Tech Blog" },
      { value: "Personal Diary", label: "Personal Diary" },
      { value: "Travel Journal", label: "Travel Journal" },
      { value: "Cooking", label: "Cooking" },
      { value: "Fitness", label: "Fitness" },
      { value: "Education", label: "Education" },
      { value: "Reviews", label: "Reviews" },
      { value: "News", label: "News" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Sports", label: "Sports" },
      { value: "Politics", label: "Politics" },
      { value: "Health", label: "Health" },
      { value: "Technology", label: "Technology" },
      { value: "Environment", label: "Environment" },
    ],
    []
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleImageFile = useCallback((file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    },
    [handleImageFile]
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      handleImageFile(file);
    },
    [handleImageFile]
  );

  const removeImage = useCallback(() => {
    setImagePreview(null);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      // console.log(desc);
      const updatedBlog = {
        ...initialBlog,
        ...data,
        image: imagePreview,
        content: desc,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateBlog(blogId, updatedBlog);
      navigate(-1);
    },
    [initialBlog, imagePreview, onUpdateBlog, navigate, desc]
  );

  return (
    <Card className="max-w-4xl mx-auto p-6 my-5">
      <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter an engaging title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormLabel>Blog Image</FormLabel>
              <div
                className={`border-2 border-dashed rounded-lg transition-colors h-[200px] ${
                  isDragging ? "border-primary" : "border-muted"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative h-full">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your image here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">or</p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => document.getElementById("image").click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <MultiSelect
                      options={tagOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select up to 5 tags..."
                      maxCount={5}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <MultiSelect
                      options={categoryOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select up to 3 categories..."
                      maxCount={3}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Suspense fallback={<div>Loading editor...</div>}>
                    <CKEditorComp content={desc} setContent={setDesc} />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publishing Options</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Publish Now</SelectItem>
                      <SelectItem value="scheduled">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("status") === "scheduled" && (
              <FormField
                control={form.control}
                name="scheduledPublishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              Update Blog
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default EditBlog;

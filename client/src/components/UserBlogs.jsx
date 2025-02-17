import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import parse from "html-react-parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  DotSquare,
  Edit,
  Trash,
  Heart,
  MessageCircleDashed,
  Share2,
  Upload,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import MultiSelect from "@/components/ui/multi-select";
import { CKEditorComp } from "./ckEditor";



const EditDialog = React.memo(({
  isOpen,
  onOpenChange,
  form,
  desc,
  setDesc,
  isDragging,
  imagePreview,
  tagOptions,
  categoryOptions,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageChange,
  removeImage,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl mx-auto h-[85vh] flex flex-col overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Edit Blog Post
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your blog post below
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <CardContent>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
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
                    onClick={() => {
                      onOpenChange(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    Update Blog
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
});

const UserBlogs = ({ blogs, loadingBlogs, onUpdateBlog, onDeleteBlog }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [desc, setDesc] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      status: "pending",
      scheduledPublishDate: null,
      tags: [],
      categories: [],
    },
  });

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

  const handleEdit = useCallback(
    (blog) => {
      // Update form state synchronously before opening the dialog
      setDesc(blog.content);
      setSelectedBlog(blog);
      setImagePreview(blog.image);

      form.reset({
        title: blog.title,
        content: blog.content,
        status: blog.status || "pending",
        scheduledPublishDate: blog.scheduledPublishDate
          ? new Date(blog.scheduledPublishDate)
          : null,
        tags: blog.tags || [],
        categories: blog.categories || [],
      });

      setIsEditOpen(true);
    },
    [form]
  );

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await onDeleteBlog(blogId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageFile(file);
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    const updatedBlog = {
      ...selectedBlog,
      ...data,
      image: imagePreview,
      updatedAt: new Date().toISOString(),
    };

    await onUpdateBlog(updatedBlog);
    setIsEditOpen(false);
  };

  if (loadingBlogs) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You haven't published any blogs yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1">
      {blogs.map((post) => (
        <Card
          key={post._id}
          className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row h-full">
            <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>

            <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {format(new Date(post.publishedAt), "PPP")}
                </div>
                <Link to={`/blog/${post._id}`}>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight line-clamp-1 hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                </Link>
                <div className="text-muted-foreground mb-6 line-clamp-2">
                  {parse(post.content)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                    <MessageCircleDashed className="h-4 w-4 text-blue-500" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                    <Share2 className="h-4 w-4 text-blue-500" />
                    <span>{post.shares || 0}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
                    >
                      <DotSquare className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(post)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(post._id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
      <EditDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={form}
        desc={desc}
        setDesc={setDesc}
        isDragging={isDragging}
        imagePreview={imagePreview}
        tagOptions={tagOptions}
        categoryOptions={categoryOptions}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleImageChange={handleImageChange}
        removeImage={removeImage}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default UserBlogs;

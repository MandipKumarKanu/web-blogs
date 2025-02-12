import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ImageIcon, Tags, Upload, Users2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "@/components/ui/multi-select";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBlog } from "@/components/api/blog";
import { toast } from "sonner";
import { CKEditorComp } from "@/components/ckEditor";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const IMGBB_API_KEY = "39155f715e13e66488803fb4160d90d0";

const PREDEFINED_TAGS = [
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
];

const PREDEFINED_CATEGORIES = [
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
];

const blogSchema = z.object({
  title: z.string().min(12, "Title must be at least 12 characters"),
  // content: z.string().min(40, "Content must be at least 40 characters"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png and .webp formats are supported"
    ),
  status: z.enum(["pending", "scheduled"]),
  scheduledPublishDate: z.date().optional().nullable(),
});

const BlogForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "pending",
      scheduledPublishDate: null,
    },
  });

  const { watch, setValue, clearErrors, reset } = form;
  const status = watch("status");

  useEffect(() => {
    if (status === "pending") {
      setValue("scheduledPublishDate", null);
    }
  }, [status, setValue]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      clearErrors("image");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
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
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setValue("image", file);
      clearErrors("image");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let imageUrl = null;

      if (data.image) {
        imageUrl = await uploadToImgBB(data.image);
      }

      if (data.status === "pending") {
        data.scheduledPublishDate = null;
      }

      console.log({
        ...data,
        imageUrl,
        tags: selectedTags,
        categories: selectedCategories,
      });

      await createBlog({
        title: data.title,
        content: desc,
        tags: selectedTags,
        categories: selectedCategories,
        image: imageUrl,
        scheduledPublishDate: data.scheduledPublishDate,
      });
      toast.success("Blog submitted for review");

      reset();
      setSelectedCategories([]);
      setSelectedTags([]);
      setImagePreview(null);
      setDesc(""); 
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Blog Post
          </CardTitle>
        </CardHeader>
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
                      <Input
                        {...field}
                        placeholder="Enter an engaging title..."
                      />
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
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            document.getElementById("image").click()
                          }
                          size="sm"
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                  <FormMessage>
                    {form.formState.errors.image?.message}
                  </FormMessage>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel>Tags</FormLabel>
                    <div className="relative">
                      <MultiSelect
                        options={PREDEFINED_TAGS}
                        onValueChange={setSelectedTags}
                        placeholder="Select up to 5 tags..."
                        maxCount={5}
                        value={selectedTags}
                      />
                      {/* <Tags className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can select up to 5 tags
                    </p>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Categories</FormLabel>
                    <div className="relative">
                      <MultiSelect
                        options={PREDEFINED_CATEGORIES}
                        onValueChange={setSelectedCategories}
                        placeholder="Select up to 3 categories..."
                        maxCount={3}
                        value={selectedCategories}
                      />
                      {/* <Users2 className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can select up to 3 categories
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      {/* <Textarea
                          {...field}
                          placeholder="Write your blog content..."
                          className="min-h-[200px]"
                        /> */}
                      <CKEditorComp content={desc} setContent={setDesc} />
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
                        value={field.value}
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

                {status === "scheduled" && (
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
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Blog"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;

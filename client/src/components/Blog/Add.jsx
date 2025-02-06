import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ImageIcon, TextIcon, Upload } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PREDEFINED_TAGS = [
  "Technology",
  "Programming",
  "Design",
  "Travel",
  "Lifestyle",
  "Food",
  "Health",
  "Science",
  "Art",
  "Music",
];

const PREDEFINED_CATEGORIES = [
  "Tech Blog",
  "Personal Diary",
  "Travel Journal",
  "Cooking",
  "Fitness",
  "Education",
  "Reviews",
  "News",
  "Entertainment",
  "Sports",
];

const addSchema = z.object({
  title: z.string().min(12, "Title of the blog must be at least 12 characters"),
  content: z.string().min(40, "Content must be at least 40 characters"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png and .webp formats are supported"
    ),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

const Add = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onAdd = (data) => {
    const finalData = {
      ...data,
      tags: selectedTags,
      categories: selectedCategories,
    };
    console.log(finalData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <div className="relative">
            <Input
              id="title"
              type="text"
              className="pl-10"
              placeholder="Enter blog title..."
              {...register("title")}
            />
            <TextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.title && (
            <Alert variant="destructive" className="py-2 text-sm">
              <AlertDescription>{errors.title.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Blog Image</Label>
          <div className="relative">
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="pl-10"
              {...register("image", {
                onChange: handleImageChange,
              })}
            />
            <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 w-auto rounded-md"
              />
            </div>
          )}
          {errors.image && (
            <Alert variant="destructive" className="py-2 text-sm">
              <AlertDescription>{errors.image.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Description</Label>
          <div className="relative">
            <Textarea
              id="content"
              className="pl-10 min-h-[120px]"
              placeholder="Enter blog content..."
              {...register("content")}
            />
            <TextIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.content && (
            <Alert variant="destructive" className="py-2 text-sm">
              <AlertDescription>{errors.content.message}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="grid grid-cols-3 gap-2">
            {PREDEFINED_TAGS.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <Label htmlFor={`tag-${tag}`}>{tag}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Selection */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid grid-cols-3 gap-2">
            {PREDEFINED_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Blog
        </Button>
      </form>
    </div>
  );
};

export default Add;

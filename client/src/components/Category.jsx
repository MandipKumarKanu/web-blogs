import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  MessageCircleDashed,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import BlogCard from "./BlogCard";
import { getByCategory } from "./api/blog";
import useCategoryTagStore from "@/store/useCategoryTagStore";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

// Enhanced BlogCardSkeleton with more realistic loading UI
const BlogCardSkeleton = () => {
  return (
    <Card className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden bg-muted">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-4 left-4">
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
        </div>

        <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="space-y-2 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
            <div className="flex items-center gap-4">
              <BadgeSkeleton />
              <BadgeSkeleton />
              <BadgeSkeleton />
            </div>

            <Skeleton className="h-12 w-32 rounded-sm" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

// Badge skeleton for the interaction counts
const BadgeSkeleton = () => (
  <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
    <Skeleton className="h-4 w-4 rounded-full" />
    <Skeleton className="h-4 w-6" />
  </div>
);

// Category carousel item skeleton
const CategorySkeletonItem = () => (
  <CarouselItem className="pl-1 basis-1/2 md:basis-1/4 lg:basis-1/6">
    <div className="p-1">
      <Card className="transition-all rounded-sm duration-300 shadow-md">
        <CardContent className="flex w-full h-16 items-center justify-center p-6">
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    </div>
  </CarouselItem>
);

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    categories,
    fetchCategoriesAndTags,
    loading: categoryLoading,
  } = useCategoryTagStore();

  useEffect(() => {
    fetchByCategory();
  }, [selectedCategory]);

  const fetchByCategory = async () => {
    try {
      setLoading(true);
      const response = await getByCategory(selectedCategory);
      setFilteredData(response.data.blogs || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const transformedCategories = [
    { name: "All", value: "All" },
    ...categories.map((cat) => ({ name: cat.name, value: cat._id })),
  ];
  

  return (
    <section className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center md:text-left">
          Discover the World of Blogs
        </h2>
        <Link to="/topics">
          <Button
            variant="outline"
            className="text-muted-foreground flex items-center gap-2 px-6 py-3 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            Explore All Posts
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="mt-6 px-8">
        <Carousel>
          <CarouselContent className="-ml-1 flex gap-4">
            {categoryLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => <CategorySkeletonItem key={i} />)
              : transformedCategories.map((category, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-1 basis-1/2 md:basis-1/4 lg:basis-1/6 cursor-pointer"
                  >
                    <div
                      className="p-1"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <Card
                        className={`transition-all rounded-sm duration-300 shadow-md ${
                          selectedCategory === category.value
                            ? "bg-primary/10 text-primary border border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        } hover:shadow-xl`}
                      >
                        <CardContent className="flex w-full h-16 items-center justify-center p-6 text-lg font-semibold">
                          {category.name}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="space-y-8 px-8 mt-8">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <BlogCardSkeleton key={i} />)
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredData.length > 0 ? (
          filteredData
            .slice(0, 5)
            .map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                selectedCategory={selectedCategory}
              />
            ))
        ) : (
          <p className="text-center text-muted-foreground text-lg mt-10">
            No blogs found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default Category;

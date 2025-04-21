import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
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
    if (categories.length === 0) {
      fetchCategoriesAndTags();
    }
  }, []);

  useEffect(() => {
    fetchByCate();
  }, [selectedCategory]);

  const fetchByCate = async () => {
    try {
      setLoading(true);
      const response = await getByCategory(selectedCategory);
      setFilteredData(response.data.blogs);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const transformedCategories = [
    { name: "All", value: "All" },
    ...categories.map((category) => ({
      name: category.name,
      value: category._id,
    })),
  ];

  return (
    <section className="container mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center md:text-left">
          Discover the World of Blogs
        </h2>
        <Button
          variant="outline"
          className="text-muted-foreground flex items-center gap-2 px-6 py-3 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
        >
          Explore All Posts
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="mt-6 px-8">
        {categoryLoading ? (
          <p>Loading categories...</p>
        ) : (
          <Carousel className="">
            <CarouselContent className="-ml-1 flex gap-4">
              {transformedCategories.map((category, index) => (
                <CarouselItem
                  key={index}
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
        )}
      </div>

      <div className="space-y-8 px-8 mt-4">
        {loading ? (
          <p>Loading blogs...</p>
        ) : filteredData && filteredData.length > 0 ? (
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
          <p>No Blogs in this category</p>
        )}
      </div>
    </section>
  );
};

export default Category;

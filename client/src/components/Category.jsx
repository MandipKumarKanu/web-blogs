import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  MessageCircleDashed,
  Share2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { categoryData } from "./categorydata";

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { name: "All", value: "all" },
    { name: "Education", value: "education" },
    { name: "Politics", value: "politics" },
    { name: "Technology", value: "technology" },
    { name: "Health", value: "health" },
    { name: "Sports", value: "sport" },
    { name: "Environment", value: "environment" },
  ];

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    let data =
      selectedCategory !== "all"
        ? categoryData.filter((data) => {
            return (
              data.category.toUpperCase() === selectedCategory.toUpperCase()
            );
          })
        : categoryData;

    setFilteredData(data);
  }, [selectedCategory]);

  return (
    <section className="container mx-auto py-12 px-6">
      {/* Heading & Explore Button */}
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

      {/* Category Carousel */}
      <div className="mt-6 px-8">
        <Carousel className="">
          <CarouselContent className="-ml-1 flex gap-4">
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="pl-1 basis-1/2 md:basis-1/4 lg:basis-1/6 cursor-pointer"
              >
                <div
                  className="p-1"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <Card
                    className={`transition-all rounded-sm duration-300 shadow-md  ${
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

      <div className="space-y-8 px-8 mt-4">
        {filteredData &&
          filteredData.slice(0,5).map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden">
                  <div className="absolute inset-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {selectedCategory === "all" && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary/60 rounded-full text-xs text-white px-4 py-1">
                        {post.category}
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {post.date}
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight line-clamp-1 ">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2 group-hover:text-muted-foreground/80">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                        <MessageCircleDashed className="h-4 w-4 text-blue-500" />
                        <span>{post.shares}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                        <Share2 className="h-4 w-4 text-blue-500" />
                        <span>{post.shares}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 " />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default Category;

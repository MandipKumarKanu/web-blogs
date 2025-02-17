import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import parse from "html-react-parser";
import { getByCategoryGrp } from "@/components/api/blog";
import { Link } from "react-router-dom";

const TopicPage = () => {
  const [categories] = useState([
    { name: "Education", value: "Education" },
    { name: "Politics", value: "Politics" },
    { name: "Technology", value: "Technology" },
    { name: "Health", value: "Health" },
    { name: "Sports", value: "Sport" },
    { name: "Environment", value: "Environment" },
  ]);

  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryBlogs();
  }, []);

  const fetchCategoryBlogs = async () => {
    setLoading(true);
    try {
      const response = await getByCategoryGrp({
        categories: categories.map((cat) => cat.value),
      });
      setCategoryBlogs(response.data.blogsByCategoryGrp);
    } catch (error) {
      setError("Error fetching blogs.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderBlogCard = (blog) => (
    <Card className="h-[235px] border-0 shadow-md">
      <CardHeader>
        <Link to={`/blog/${blog._id}`}>
          <CardTitle className="line-clamp-2  leading-snug hover:text-primary transition-colors duration-300">
            {blog.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground line-clamp-[6]">
          {parse(blog.content)}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[350px] rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive bg-destructive/10 p-6 rounded-xl inline-block">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {categoryBlogs.map(({ category, blogs }) => (
          <div key={category} className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Insights in <span className="text-primary">{category}</span>
              </h2>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <span>Explore All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {blogs.length > 0 ? (
              <div className="px-12">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {blogs.map((blog, index) => (
                      <CarouselItem
                        key={blog._id || index}
                        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                      >
                        {renderBlogCard(blog)}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ) : (
              <div className="text-muted-foreground bg-muted/10 p-6 rounded-xl inline-block">
                No blogs available in this category.
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopicPage;

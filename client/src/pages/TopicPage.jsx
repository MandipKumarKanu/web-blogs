import React, { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Clock, Bookmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import { getByCategoryGrp } from "@/components/api/blog";
import { Link } from "react-router-dom";
import useCategoryTagStore from "@/store/useCategoryTagStore";

const TopicPage = () => {
  const {
    categories,
    fetchCategoriesAndTags,
    loading: categoryLoading,
  } = useCategoryTagStore();
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategoriesAndTags();
    }
  }, [fetchCategoriesAndTags]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchCategoryBlogs();
    }
  }, [categories]);

  const fetchCategoryBlogs = async () => {
    setLoading(true);
    try {
      const response = await getByCategoryGrp({
        categories: categories.map((cat) => cat._id),
      });
      setCategoryBlogs(response.data.blogsByCategoryGrp);
    } catch (error) {
      setError("Error fetching blogs.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || "Unknown";
  };

  const getRandomReadTime = () => {
    return Math.floor(Math.random() * 15) + 3;
  };

  const renderBlogCard = (blog, isFeatured = false) => {
    const readTime = getRandomReadTime();

    if (isFeatured) {
      return (
        <Card className="h-full border-0 overflow-hidden bg-gradient-to-br from-primary/5 to-background shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group">
          <div className="flex flex-col h-full">
            <CardHeader className="pb-2 pt-6">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 w-fit mb-3"
              >
                Featured
              </Badge>
              <Link to={`/blog/${blog._id}`}>
                <CardTitle className="text-2xl md:text-3xl font-bold leading-tight hover:text-primary  duration-300 group-hover:translate-x-1 transition-transform">
                  {blog.title}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-base text-muted-foreground line-clamp-5 mb-4">
                {parse(blog.content)}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Avatar className="h-8 w-8">
                  <div className="bg-primary/20 h-full w-full flex items-center justify-center text-primary font-medium">
                    {blog.author.name.charAt(0)}
                  </div>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {readTime} min read
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="">
              <Link
                to={`/blog/${blog._id}`}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline group-hover:translate-x-1 transition-transform"
              >
                Read Article <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </div>
        </Card>
      );
    }

    return (
      <Card className="h-full border border-border/30 bg-card hover:bg-card/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden group">
        <CardHeader className="pb-2">
          <Link to={`/blog/${blog._id}`}>
            <CardTitle className="line-clamp-2 leading-snug hover:text-primary  duration-300 group-hover:translate-x-0.5 transition-transform">
              {blog.title}
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {parse(blog.content)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{readTime} min read</span>
            </div>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <Bookmark className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading || categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 rounded-lg mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 rounded-xl bg-muted col-span-1 lg:col-span-1" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 lg:col-span-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Skeleton className="h-12 w-64 rounded-lg mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive bg-destructive/10 p-8 rounded-xl inline-block shadow-lg">
          <div className="text-2xl font-bold mb-2">Oops!</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {categoryBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium text-muted-foreground">
              No categories found.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Check back soon for exciting content across various topics.
            </p>
          </div>
        ) : (
          categoryBlogs.map(({ category, blogs }, categoryIndex) => {
            const categoryName = getCategoryName(category);
            const featuredBlog = blogs.length > 0 ? blogs[0] : null;
            const regularBlogs = featuredBlog ? blogs.slice(1) : blogs;

            return (
              <div key={category} className={categoryIndex > 0 ? "mt-24" : ""}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight flex items-center gap-2">
                      <span>Insights in </span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        {categoryName}
                      </span>
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Latest thoughts and explorations
                    </p>
                  </div>
                  <Link
                    to={`/category/${category}?name=${encodeURIComponent(
                      categoryName
                    )}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10"
                  >
                    <span>Explore All</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {blogs.length > 0 ? (
                  <>
                    {featuredBlog && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-1">
                          {renderBlogCard(featuredBlog, true)}
                        </div>
                        <div className="lg:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {regularBlogs.slice(0, 4).map((blog, index) => (
                              <div key={blog._id || index}>
                                {renderBlogCard(blog)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {regularBlogs.length > 4 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        {regularBlogs.slice(4).map((blog, index) => (
                          <div key={`extra-${blog._id || index}`}>
                            {renderBlogCard(blog)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground bg-muted/10 p-8 rounded-xl inline-block shadow-sm border border-border/30">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5" />
                      <span>No blogs available in this category yet.</span>
                    </div>
                  </div>
                )}

                {categoryIndex < categoryBlogs.length - 1 && (
                  <Separator className="mt-16 opacity-30" />
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default TopicPage;

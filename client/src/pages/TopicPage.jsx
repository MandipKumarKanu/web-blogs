import React, { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Clock, Bookmark, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input"; // Added Input component
import parse from "html-react-parser";
import { getByCategoryGrp } from "@/components/api/blog";
import { Link } from "react-router-dom";
import useCategoryTagStore from "@/store/useCategoryTagStore";

// Featured Blog Card Skeleton component remains the same
const FeaturedBlogCardSkeleton = () => (
  <Card className="h-full border-0 overflow-hidden bg-gradient-to-br from-primary/5 to-background shadow-xl rounded-xl">
    <div className="flex flex-col h-full">
      <CardHeader className="pb-2 pt-6">
        <Skeleton className="h-6 w-24 mb-3 rounded-full" />
        <Skeleton className="h-9 w-full mb-2" />
        <Skeleton className="h-9 w-4/5" />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-6 w-32" />
      </CardFooter>
    </div>
  </Card>
);

// Regular Blog Card Skeleton component remains the same
const RegularBlogCardSkeleton = () => (
  <Card className="h-full border border-border/30 bg-card shadow-md rounded-lg overflow-hidden">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-full mb-1" />
      <Skeleton className="h-6 w-4/5" />
    </CardHeader>
    <CardContent>
      <div className="mb-3">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

// Category Section Skeleton component remains the same
const CategorySectionSkeleton = ({ index }) => (
  <div className={index > 0 ? "mt-24" : ""}>
    <div className="flex justify-between items-center mb-8">
      <div>
        <Skeleton className="h-10 w-64 rounded-lg mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div className="lg:col-span-1">
        <FeaturedBlogCardSkeleton />
      </div>
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <RegularBlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>

    {index < 1 && <Separator className="mt-16 opacity-30" />}
  </div>
);

const TopicPage = () => {
  const {
    categories,
    fetchCategoriesAndTags,
    loading: categoryLoading,
  } = useCategoryTagStore();
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state for search
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter categories based on search query
  const filteredCategoryBlogs = categoryBlogs.filter((categoryBlog) => {
    const categoryName = getCategoryName(categoryBlog.category);
    return categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Show multiple category sections in skeleton state */}
          {Array.from({ length: 2 }).map((_, index) => (
            <CategorySectionSkeleton key={index} index={index} />
          ))}
        </div>
      </section>
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
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input
              placeholder="Search categories..."
              className="pl-10 pr-4 py-6 border-border/30 bg-card shadow-sm focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
        ) : filteredCategoryBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium text-muted-foreground">
              No matching categories found.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Try a different search term or explore all categories.
            </p>
            <button
              className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
              onClick={() => setSearchQuery("")}
            >
              Show All Categories
            </button>
          </div>
        ) : (
          filteredCategoryBlogs.map(({ category, blogs }, categoryIndex) => {
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

                {categoryIndex < filteredCategoryBlogs.length - 1 && (
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

import BlogCard from "@/components/BlogCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByCategory } from "@/components/api/blog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const { name } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchByCate();
  }, [name]);

  const fetchByCate = async () => {
    try {
      setLoading(true);
      const response = await getByCategory(name);
      setFilteredData(response.data.blogs);
    } catch (error) {
      setError("Failed to fetch blogs.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Insights in <span className="text-primary">{name}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the latest articles and insights about{" "}
              {name.toLowerCase()}
            </p>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1  gap-6">
            {filteredData&&filteredData.map((blog) => (
              <div
                key={blog.id}
                className="transform hover:-translate-y-1 transition-transform duration-200"
              >
                <BlogCard post={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-foreground mb-2">
              No Articles Found
            </h3>
            <p className="text-muted-foreground">
              There are currently no articles available in the{" "}
              {name.toLowerCase()} category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;

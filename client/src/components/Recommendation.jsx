import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RecentCard from "@/components/RecentCard";
import VerticalCard from "@/components/VerticalCard";
import { useLocalStorage } from "@/hooks/use-localStorage";
import { customAxios } from "@/components/config/axios";
import { Card, CardHeader } from "./ui/card";
import { ArrowUpRight, Share2 } from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-lg flex-shrink-0 w-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <CardHeader className="space-y-2 p-4">
        <Link to={`/blog/${blog?._id}`}>
          <h2 className="text-xl font-semibold text-foreground mb-4 leading-tight line-clamp-2 h-[3rem] overflow-hidden hover:text-primary transition-colors duration-300">
            {blog.title}
          </h2>
        </Link>
        <div className="text-sm text-muted-foreground">
          {blog?.category?.[0].name}
        </div>
      </CardHeader>

      <div className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2 cursor-pointer">
            <FaRegHeart className="h-4 w-4 text-gray-500" />
            <span>{blog.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2 cursor-pointer">
            <Share2 className="h-4 w-4 text-blue-500" />
            <span>{blog?.shares || 0}</span>
          </div>
        </div>
        <Link to={`/blog/${blog?._id}`}>
          <Button
            variant="ghost"
            className="w-full sm:w-auto group rounded-sm px-6 py-5 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
          >
            Read Article
            <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 " />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const Recommendation = () => {
  const [interests] = useLocalStorage("interest", []);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await customAxios.post("/blogs/recommendation-content", {
        interests,
      });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [interests]);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-muted-foreground">
            Loading recommendations...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-6 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
            Recommended for You
          </h2>
          <p className="text-muted-foreground ">
            Based on your interests, here are some articles you might like.
          </p>
          {/* <Button
            variant="outline"
            size="lg"
            className="max-w-44 rounded-full px-8 py-6 text-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            Explore More
          </Button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((post, key) => (
            <BlogCard key={key} blog={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendation;

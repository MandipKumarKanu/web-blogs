import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { featuredData } from "./featuredData";
// import { useBlogStore } from "@/store/useBlogStore";

const Featured = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);

 

  useEffect(() => {
    setFeaturedPosts(featuredData);
  }, []);

  return (
    <section className="container mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight ">
          Featured Blogs
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Explore the most popular and impactful articles on the web this month.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {featuredPosts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden rounded-lg"
          >
            <div className="relative w-full h-56 md:h-72">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 leading-tight line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <Button
                variant="ghost"
                className="group w-full sm:w-auto rounded-lg px-6 py-3 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-primary"
              >
                Read Article
                <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button
          variant="outline"
          className="text-muted-foreground flex items-center gap-2 px-6 py-3 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
        >
          Explore More Posts
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default Featured;

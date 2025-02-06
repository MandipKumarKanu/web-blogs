import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User2, Heart, Share2, ArrowUpRight } from "lucide-react";

const RecentPosts = () => {
  const posts = [
    {
      id: 1,
      title: "The Evolution of Sustainable Architecture in 2025",
      category: "Architecture",
      excerpt:
        "Discover how architects are revolutionizing sustainable design with breakthrough materials and innovative approaches to create carbon-negative buildings.",
      author: "Emma Richardson",
      date: "January 28, 2025",
      image:
        "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg",
      likes: "23.5k",
      shares: "1.2k",
      readTime: "8 min read",
    },
    {
      id: 2,
      title: "Quantum Computing: Breaking New Ground in Cryptography",
      category: "Technology",
      excerpt:
        "Explore the latest breakthroughs in quantum computing and their implications for the future of data security and encryption protocolsExplore the latest breakthroughs in quantum computing and their implications for the future of data security and encryption protocolsExplore the latest breakthroughs in quantum computing and their implications for the future of data security and encryption protocolsExplore the latest breakthroughs in quantum computing and their implications for the future of data security and encryption protocolsExplore the latest breakthroughs in quantum computing and their implications for the future of data security and encryption protocols.",
      author: "Dr. James Chen",
      date: "January 25, 2025",
      image: "https://th.bing.com/th/id/OIG4.7h3EEAkofdcgjDEjeOyg",
      likes: "18.2k",
      shares: "956",
      readTime: "12 min read",
    },
    {
      id: 3,
      title: "The Rise of Regenerative Agriculture",
      category: "Environment",
      excerpt:
        "How modern farming techniques are being transformed to combat climate change while improving food security and soil health.",
      author: "Sarah Martinez",
      date: "January 22, 2025",
      image:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      likes: "15.7k",
      shares: "823",
      readTime: "10 min read",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12 md:mb-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
            Recent Posts: Stay Informed
          </h2>
          <Button
            variant="outline"
            size="lg"
            className="max-w-44 rounded-full px-8 py-6 text-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            View All Articles
          </Button>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
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
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <div
                      className="bg-primary/60 rounded-full text-xs text-white px-4 py-1"
                    >
                      {post.category}
                    </div>
                  </div>
                </div>

                <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-primary" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {post.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted-foreground/10 pl-3 rounded-3xl py-2 pr-6 border-2">
                        <Share2 className="h-4 w-4 text-blue-500" />
                        <span>{post.shares}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto group rounded-full px-6 py-3 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;

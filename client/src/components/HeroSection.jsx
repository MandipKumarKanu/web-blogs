import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-[93dvh] flex items-center justify-center py-12 px-4 sm:px-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left space-y-8">
          <div
            className="inline-flex items-center gap-2 bg-muted/20 backdrop-blur-sm px-4 py-2 
            rounded-full border border-border/50 hover:border-primary/50 transition-all duration-300"
          >
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm text-foreground">
              Welcome to the Future of Blogging
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Unleash Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient">
              Creativity
            </span>{" "}
            with Every Post
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Join a community of innovators, thinkers, and creators. Explore
            cutting-edge topics, share your ideas, and stay ahead of the curve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to={"/new"}>
              <Button
                className="rounded-2xl px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary 
              hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                aria-label="Start Exploring"
              >
                Start Exploring
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <Button
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg flex items-center gap-2 
              hover:bg-muted/20 hover:border-primary/50 transition-all duration-300"
              aria-label="Join the Community"
            >
              <Rocket className="h-5 w-5" />
              Join the Community
            </Button>
          </div>
        </div>

        <div className="relative w-full h-full flex justify-center lg:justify-end">
          <div
            className="relative w-full max-w-lg h-[400px] lg:h-[500px] rounded-[2.5rem] 
            overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500"
          >
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Creative Thinking"
              className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
                The Art of Creative Thinking
              </h2>
              <p className="text-sm text-foreground mt-2 line-clamp-2">
                Learn how to unlock your creative potential and turn ideas into
                reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

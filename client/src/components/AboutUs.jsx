import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Users,
  PenTool,
  Rocket,
  ArrowRight,
  Star,
  Globe,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";

const AboutUs = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    startInterval();

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isHovering) {
      clearInterval(intervalRef.current);
    } else {
      startInterval();
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovering]);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % 4);
      }, 3000);
    }
  };

  const handleMouseEnter = (index) => {
    clearInterval(intervalRef.current);
    setIsHovering(true);
    setActiveFeature(index);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startInterval();
  };

  const features = [
    {
      icon: <Users className="h-12 w-12" />,
      title: "Community Driven",
      description:
        "Join a diverse group of writers and readers. Discover trending topics, follow your interests, and connect with like-minded people.",
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-500/10",
      textColor: "text-violet-500",
    },
    {
      icon: <PenTool className="h-12 w-12" />,
      title: "Powerful Writing Tools",
      description:
        "Enjoy a distraction-free editor, AI-powered summaries, and rich formatting to make your stories shine.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-500",
    },
    {
      icon: <Rocket className="h-12 w-12" />,
      title: "Grow Your Audience",
      description:
        "Publish your blogs, get featured, and reach thousands. Our platform helps you build your personal brand.",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: "Modern & Secure",
      description:
        "Enjoy a fast, secure, and beautiful experience—whether you're reading, writing, or exploring.",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
  ];

  const testimonials = [
    {
      name: "Ramu Kaka",
      role: "Legendary Chaiwala",
      text: "FutureBlog made my chai breaks legendary. Now I spill tea and knowledge at the same time!",
    },
    {
      name: "Chotu Don",
      role: "Underworld Storyteller",
      text: "I used to rule the streets, now I rule the trending page. My stories finally get the respect they deserve!",
    },
    {
      name: "Hero Hera Lal",
      role: "Bollywood Dreamer",
      text: "With these writing tools, even my filmi plot twists get standing ovations. Maa kasam, productivity double ho gaya!",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden relative">
      <div
        className={`max-w-6xl mx-auto z-10 transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 mb-16">
          <div className="relative">
            {/* <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-6 py-3 rounded-full font-semibold text-base backdrop-blur-sm border border-primary/30 shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5" />
              <span className="relative z-10">About FutureBlog</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-sm animate-pulse"></div>
            </span> */}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-center bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent drop-shadow-sm pb-2">
            Share Your Voice with the World
          </h1>

          <p className="text-xl text-slate-300 text-center max-w-3xl leading-relaxed">
            FutureBlog is a modern platform for creators, thinkers, and
            innovators. We empower you to write, share, and connect with a
            vibrant community passionate about ideas and stories.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <Button className="rounded-full px-8 py-6 text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all duration-300 shadow-lg shadow-primary/20 group">
              Join FutureBlog
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-lg font-medium border-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800/70 backdrop-blur-sm transition-all duration-300"
            >
              Explore FutureBlog
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-16">
          {[
            { icon: <Globe />, value: "50+", label: "Users" },
            { icon: <PenTool />, value: "10+", label: "Daily Posts" },
            { icon: <MessageCircle />, value: "1+", label: "Comments" },
            { icon: <Star />, value: "69%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-primary/5 group"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-16 my-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cool
            </span>{" "}
            Features
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === idx
                      ? `bg-gradient-to-br ${feature.bgColor} border border-${feature.textColor}/30 shadow-lg`
                      : "bg-slate-900/50 border border-slate-800 hover:bg-slate-800/70"
                  }`}
                  onClick={() => setActiveFeature(idx)}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        activeFeature === idx
                          ? `bg-gradient-to-br ${feature.color} text-white`
                          : `${feature.bgColor} ${feature.textColor}`
                      } transition-all duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-bold ${
                          activeFeature === idx
                            ? "text-white"
                            : "text-slate-200"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`${
                          activeFeature === idx
                            ? "text-white/80"
                            : "text-slate-400"
                        } text-sm mt-1 line-clamp-1`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-slate-800 shadow-xl">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activeFeature === idx
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <div
                    className={`h-full w-full bg-gradient-to-br ${feature.color} opacity-10`}
                  ></div>
                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      <div
                        className={`p-4 rounded-2xl inline-flex ${feature.bgColor} ${feature.textColor} mb-6`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-white/80 max-w-lg">
                        {feature.description}
                      </p>
                    </div>

                    <Button
                      className={`mt-8 self-start bg-gradient-to-r ${feature.color} text-white rounded-full px-6 py-6 text-lg hover:brightness-110 transition-all`}
                    >
                      Explore {feature.title}
                      <ArrowRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="my-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Community
            </span>{" "}
            Says
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="inline-block h-5 w-5 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-lg text-slate-300 flex-grow">
                    {testimonial.text}
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to start your journey?
              </h3>
              <p className="text-lg text-slate-300 max-w-lg">
                Join thousands of creators who are already sharing their stories
                and building their audience on FutureBlog.
              </p>
            </div>
            <Button className="rounded-full px-8 py-6 text-lg font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all duration-300 shadow-lg shadow-white/20 whitespace-nowrap">
              Join FutureBlog Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;

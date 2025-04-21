import { useBlogStore } from "@/store/useBlogStore";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { toDateOnlyISO } from "./utils/DateConverter";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

const Landing = () => {
  const { weekError, weekLoad, weeklyPopularBlogs, getWeeklyPop } =
    useBlogStore();

  useEffect(() => {
    // console.log(weeklyPopularBlogs);
    if (weeklyPopularBlogs === 0) fetch();
  }, []);

  const fetch = async () => {
    await getWeeklyPop();
  };

  return (
    <div className="w-full h-full flex justify-center p-4 md:p-8">
      <div className="container w-full h-full grid gap-8 lg:grid-cols-3 grid-cols-1">
        <div className="lg:col-span-2 col-span-1 w-full">
          <div className="text-4xl md:text-6xl font-bold mb-6 flex justify-between items-end">
            <span className="italic ml-5">Best of the week</span>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              Explore all posts
              <ArrowRight className="h-4 w-4 transition-transform" />
            </Button>
          </div>

          <div className="relative w-full">
            <Link to={`/blog/${weeklyPopularBlogs[0]?._id}` || "/"}>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent rounded-[2.5rem] z-10" />
              <img
                src={weeklyPopularBlogs[0]?.image}
                loading="lazy"
                alt={weeklyPopularBlogs[0]?.title}
                className="rounded-[2.5rem] object-cover w-full h-[500px] transition-transform duration-300"
              />
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                <div className="backdrop-blur-sm bg-white/10 py-2 px-4 text-sm rounded-2xl text-white">
                  {weeklyPopularBlogs[0]?.publishedAt &&
                    new Date(
                      weeklyPopularBlogs[0]?.publishedAt
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </div>
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 py-2 px-4 text-sm rounded-2xl text-white">
                  {weeklyPopularBlogs[0]?.category &&
                    weeklyPopularBlogs[0]?.category[0]?.name}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg line-clamp-3 ">
                  {weeklyPopularBlogs[0]?.title}
                </h2>
                <Button className="rounded-2xl px-6 py-5 backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white">
                  Read Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="p-6 rounded-[2.5rem] backdrop-blur-lg bg-gray-800/5 border border-white/10 h-full">
            <Link to={`/blog/${weeklyPopularBlogs[1]?._id}` || "/"}>
              <span className="text-sm font-medium text-purple-600">
                {weeklyPopularBlogs[1]?.category &&
                  weeklyPopularBlogs[1]?.category[0]?.name}
              </span>
              <h3 className="text-2xl font-bold mt-2 mb-3 line-clamp-2 hover:text-primary transition-colors duration-300">
                {weeklyPopularBlogs[1]?.title}
              </h3>
              <div className="text-muted-foreground line-clamp-3">
                {weeklyPopularBlogs[1]?.content &&
                  parse(weeklyPopularBlogs[1]?.content)}
              </div>
            </Link>
          </div>

          <div className="relative group h-full">
            <Link to={`/blog/${weeklyPopularBlogs[2]?._id}` || "/"}>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-[2.5rem] z-10" />
              <img
                src={weeklyPopularBlogs[2]?.image}
                loading="lazy"
                alt={weeklyPopularBlogs[2]?.title}
                className="rounded-[2.5rem] object-cover w-full h-[300px] transition-transform duration-300 group-hover:scale-[0.99]"
              />
            </Link>
            <div className="absolute bottom-6 right-6 z-20">
              <Link to={`/popular`}>
                <Button className="rounded-2xl px-6 py-5 backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white">
                  View Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
  
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="w-full h-full flex justify-center p-4 md:p-8">
      <div className="container w-full h-full grid gap-8 lg:grid-cols-3 grid-cols-1">
        <div className="lg:col-span-2 col-span-1 w-full">
          <div className="text-4xl md:text-6xl font-bold mb-6 flex justify-between items-end">
            <span className="italic ml-5">Best of the week</span>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground  flex items-center gap-2"
            >
              Explore all posts
              <ArrowRight className="h-4 w-4 transition-transform " />
            </Button>
          </div>

          <div className="relative w-full ">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent rounded-[2.5rem] z-10" />
            <img
              src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
              alt="Featured Post"
              className="rounded-[2.5rem] object-cover w-full h-[500px] transition-transform duration-300 "
            />
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <div className="backdrop-blur-sm bg-white/10 py-2 px-4 text-sm rounded-2xl text-white">
                Feb 01, 2025
              </div>
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 py-2 px-4 text-sm rounded-2xl text-white">
                Technology
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg line-clamp-3">
                Exploring the Future of Augmented Reality in Everyday Life
              </h2>
              <Button className="rounded-2xl px-6 py-5 backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white">
                Read Article
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="p-6 rounded-[2.5rem] backdrop-blur-lg bg-gray-800/5 border border-white/10 h-full">
            <span className="text-sm font-medium text-purple-600">Design</span>
            <h3 className="text-2xl font-bold mt-2 mb-3 line-clamp-2">
              Mastering UI/UX Principles for Better Digital Experiences
            </h3>
            <p className="text-muted-foreground line-clamp-3">
              Discover the fundamental principles that every designer should
              know to create intuitive and engaging user interfaces in modern
              applications.
            </p>
          </div>

          <div className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-[2.5rem] z-10" />
            <img
              src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
              alt="Secondary Post"
              className="rounded-[2.5rem] object-cover w-full h-full min-h-[300px] transition-transform duration-300 group-hover:scale-[0.99]"
            />
            <div className="absolute bottom-6 right-6 z-20">
              <Button className="rounded-2xl px-6 py-5 backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white">
                View Collection
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

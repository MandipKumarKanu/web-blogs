import React, { useEffect } from "react";
import { ArrowRight, Twitter, Linkedin, Rss, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBlogStore } from "@/store/useBlogStore";
import { Link } from "react-router-dom";

const Footer = () => {
  const { weekError, weekLoad, weeklyPopularBlogs, getWeeklyPop } =
    useBlogStore();

  useEffect(() => {
    if (weeklyPopularBlogs.length === 0) fetch();
    // console.log(weeklyPopularBlogs);
  }, []);

  const fetch = async () => {
    await getWeeklyPop();
  };
  return (
    <footer className="bg-gray-800/10 text-muted-foreground py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-primary mb-4 font-medium transition-transform transform hover:scale-105">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/tech"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="/lifestyle"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Lifestyle
                </a>
              </li>
              <li>
                <a
                  href="/productivity"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Productivity
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/ai"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Artificial Intelligence
                </a>
                <Badge variant="secondary" className="ml-2 animate-pulse">
                  New
                </Badge>
              </li>
              <li>
                <a
                  href="/writing"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Writing Tips
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary mb-4 font-medium transition-transform transform hover:scale-105">
              Popular Posts
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={`blog/${weeklyPopularBlogs?.[0]?._id}`}
                  className="hover:text-primary transition-colors transform hover:scale-105 line-clamp-2"
                >
                  {weeklyPopularBlogs?.[0]?.title}
                </Link>
              </li>
              <li>
                <Link
                  to={`blog/${weeklyPopularBlogs?.[1]?._id}`}
                  className="hover:text-primary transition-colors transform hover:scale-105 line-clamp-1"
                >
                  {weeklyPopularBlogs?.[1]?.title}
                </Link>
              </li>
              <li>
                <Link
                  to={`blog/${weeklyPopularBlogs?.[2]?._id}`}
                  className="hover:text-primary transition-colors transform hover:scale-105 line-clamp-1"
                >
                  {weeklyPopularBlogs?.[2]?.title}
                </Link>
              </li>
              <li>
                <Link
                  to={`blog/${weeklyPopularBlogs?.[3]?._id}`}
                  className="hover:text-primary transition-colors transform hover:scale-105 line-clamp-1"
                >
                  {weeklyPopularBlogs?.[3]?.title}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary mb-4 font-medium transition-transform transform hover:scale-105">
              Archives
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/2024/01"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  January 2024
                </a>
              </li>
              <li>
                <a
                  href="/2023/12"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  December 2023
                </a>
              </li>
              <li>
                <a
                  href="/2023/11"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  November 2023
                </a>
              </li>
              <li>
                <a
                  href="/archives"
                  className="flex items-center group hover:text-primary transition-colors"
                >
                  View all archives
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform ease-in-out duration-300" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary mb-4 font-medium transition-transform transform hover:scale-105">
              About
            </h3>
            <p className="mb-4 text-sm">
              A blog about technology, productivity, and personal development.
              Join our community of readers and writers.
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/write"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Write for Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="/terms"
              className="hover:text-primary transition-colors transform hover:scale-105"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="hover:text-primary transition-colors transform hover:scale-105"
            >
              Privacy
            </a>
            <a
              href="/faq"
              className="hover:text-primary transition-colors flex items-center"
            >
              <Rss className="w-4 h-4 mr-1 transform hover:scale-110" />
              FAQ
            </a>
          </div>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a
              href="https://twitter.com/SamsadMiya6"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:samsadmiya33@gmail.com"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mandip-kanu-589790168/"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} FutureBlog. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

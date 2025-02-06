import React from "react";
import { ArrowRight, Twitter, Linkedin, Rss, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
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
                <a
                  href="/post-1"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Getting Started with Web Development
                </a>
              </li>
              <li>
                <a
                  href="/post-2"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  The Future of AI in 2024
                </a>
              </li>
              <li>
                <a
                  href="/post-3"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  10 Productivity Hacks
                </a>
              </li>
              <li>
                <a
                  href="/post-4"
                  className="hover:text-primary transition-colors transform hover:scale-105"
                >
                  Writing Better Blog Posts
                </a>
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
              href="/rss"
              className="hover:text-primary transition-colors flex items-center"
            >
              <Rss className="w-4 h-4 mr-1 transform hover:scale-110" />
              RSS Feed
            </a>
          </div>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a
              href="https://twitter.com"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@blog.com"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-primary transition-colors transform hover:scale-110"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Blog Name. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

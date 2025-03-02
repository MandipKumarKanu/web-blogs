import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./config/axios";

const SearchComponent = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      return !prev;
    });
    setQuery("");
    setResults([]);
    setNoResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 3) {
      setResults([]);
      setIsLoading(false);
      setNoResults(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/blogs/searchByQuery?q=${encodeURIComponent(query)}`
        );
        setResults(data);
        setNoResults(data.length === 0);

        if (resultsRef.current) {
          resultsRef.current.scrollTop = 0;
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchVisible(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
   
      <Button
        variant="ghost"
        onClick={toggleSearch}
        className="p-2 rounded-full hover:bg-accent transition-colors"
        aria-label={isSearchVisible ? "Close search" : "Open search"}
      >
        {isSearchVisible ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </Button>

      {isSearchVisible && (
        <div
          className="absolute top-12 right-0 w-80 md:w-96 lg:w-[32rem] bg-background shadow-xl rounded-lg z-50 border border-border overflow-hidden transition-all duration-200 ease-in-out max-h-[80vh]"
          onKeyDown={handleKeyDown}
        >
          <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search blogs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 w-full"
              />
              {query && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(80vh - 73px)" }}
            ref={resultsRef}
          >
            {isLoading && (
              <div className="flex justify-center items-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Searching...</span>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="p-2">
                {results.map((blog) => (
                  <Card
                    key={blog._id}
                    className="mb-2 cursor-pointer hover:bg-accent/10 transition-colors border-border"
                    onClick={() => {
                      navigate(`/blog/${blog._id}`);
                      setIsSearchVisible(false);
                    }}
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-base leading-tight line-clamp-1">
                        {blog.title}
                      </CardTitle>
                      {blog.excerpt && (
                        <CardDescription className="line-clamp-2 text-sm mt-1">
                          {blog.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && noResults && query.length >= 3 && (
              <div className="p-6 text-center text-muted-foreground">
                <p>No blogs found matching "{query}"</p>
                <p className="text-sm mt-1">
                  Try different keywords or browse all blogs
                </p>
              </div>
            )}

            {!isLoading && !noResults && query.length < 3 && (
              <div className="p-6 text-center text-muted-foreground">
                <p>Type at least 3 characters to search</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

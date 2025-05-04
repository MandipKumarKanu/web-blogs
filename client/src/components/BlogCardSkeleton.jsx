import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "./ui/card";

const BlogCardSkeleton = () => {
  return (
    <Card className="group hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0">
          <Skeleton className="w-full h-full object-cover" />
        </div>

        <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
          <Skeleton className="h-4 w-32" />

          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />

          <div className="pt-6 border-t border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-16 rounded-3xl" />
              <Skeleton className="h-8 w-16 rounded-3xl" />
              <Skeleton className="h-8 w-16 rounded-3xl" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BlogCardSkeleton;

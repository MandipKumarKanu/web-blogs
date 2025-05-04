import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const PopularCardSkeleton = () => {
  return (
    <Card className="group overflow-hidden rounded-2xl border">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-[35%] h-72 md:h-auto shrink-0 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-4 left-4">
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
        </div>

        <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <Skeleton className="h-9 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />

            <div className="mb-6">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/20">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-20 rounded-3xl" />
              <Skeleton className="h-10 w-20 rounded-3xl" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

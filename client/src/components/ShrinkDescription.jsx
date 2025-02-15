import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const ShrinkDescription = ({ desc, size = 450 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!desc) {
    return (
      <div className="text-lg text-muted-foreground">
        No description available!
      </div>
    );
  }

  const isArrayContent = Array.isArray(desc);
  const truncatedContent = isArrayContent
    ? desc.slice(0, size)
    : desc.slice(0, size);

  return (
    <div className="relative">
      <div
        className={cn(
          "text-lg text-muted-foreground overflow-hidden transition-[max-height] duration-300 ease-in-out",
          showFullDescription ? "max-h-[2000px]" : "max-h-[450px]"
        )}
      >
        <div
          className={cn(
            "transition-opacity duration-300",
            showFullDescription ? "opacity-100" : "opacity-80"
          )}
        >
          {showFullDescription ? (
            isArrayContent ? (
              <div>{desc}</div>
            ) : (
              desc
            )
          ) : (
            <div>
              {isArrayContent ? truncatedContent : `${truncatedContent}...`}
            </div>
          )}
        </div>
      </div>

      {!showFullDescription && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
            <Button
              variant="ghost"
              onClick={() => setShowFullDescription(true)}
              className="group hover:bg-accent/50 transition-colors duration-300"
            >
              <span className="flex items-center gap-2 text-xl">
                Read Full Blog
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShrinkDescription;

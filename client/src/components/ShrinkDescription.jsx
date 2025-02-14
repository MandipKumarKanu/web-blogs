import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ShrinkDescription = ({ desc, size = 1800 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription((prev) => !prev);

  if (!desc) return <div>No description available!</div>;

  // If description is short enough, simply render it.
  if (desc.length <= size) {
    return <div className="text-lg text-muted-foreground">{desc}</div>;
  }

  // When full description is shown
  if (showFullDescription) {
    return (
      <div className="text-lg text-muted-foreground">
        {desc}
        <div className="flex justify-center mt-4">
          <Button variant="ghost" onClick={toggleDescription}>
            Read Less
          </Button>
        </div>
      </div>
    );
  }

  // When description is truncated, add a gradient overlay and a button over it.
  return (
    <div className="relative">
      <div className="text-lg text-muted-foreground">
        {desc.slice(0, size)}...
      </div>
      {/* Gradient overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      {/* Centered button over the overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <Button variant="ghost" onClick={toggleDescription}>
          Read Full Blog
        </Button>
      </div>
    </div>
  );
};

export default ShrinkDescription;

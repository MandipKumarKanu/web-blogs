import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold text-foreground mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;

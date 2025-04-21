import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({
  icon,
  label,
  isCollapsed,
  isActive,
  onSelect,
  items,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isCollapsed) {
      setIsOpen(!isOpen);
    }
    onSelect();
  };

  return (
    <div className="flex flex-col">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start mb-1",
          isCollapsed && "lg:justify-center"
        )}
        onClick={handleClick}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <motion.span
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="transition-opacity"
          >
            {label}
          </motion.span>
        </div>
        {!isCollapsed && (
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="ml-auto"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        )}
      </Button>

      <AnimatePresence>
        {!isCollapsed && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-1 mb-1 space-y-1">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start pl-8"
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCollapsed && (
        <div className="lg:group-hover:block hidden absolute left-20 z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-1 bg-popover rounded-md shadow-md border"
          >
            {items.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;

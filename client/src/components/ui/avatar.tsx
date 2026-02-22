import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  color?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, initials, color, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white",
          className
        )}
        style={{ backgroundColor: color || "#3b82f6" }}
        {...props}
      >
        {initials}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };

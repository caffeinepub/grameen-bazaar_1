import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const sizeMap = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: star index is positionally stable
            key={`star-${i}`}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              "transition-transform",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default pointer-events-none",
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                filled || half
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground",
                half && "fill-amber-200",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

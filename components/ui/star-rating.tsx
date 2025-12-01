import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 20,
    interactive = false,
    onRatingChange,
    className
}) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className={cn("flex gap-1", className)}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = interactive
                    ? starValue <= (hoverRating || rating)
                    : starValue <= rating;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => interactive && setHoverRating(starValue)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={cn(
                            "transition-all",
                            interactive && "cursor-pointer hover:scale-110"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-slate-200 text-slate-200"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

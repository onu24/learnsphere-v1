import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
    isActive: boolean;
    onClick: () => void;
    size?: number;
    className?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
    isActive,
    onClick,
    size = 20,
    className
}) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={cn(
                "p-2 rounded-full transition-all hover:scale-110",
                isActive
                    ? "text-red-500 hover:bg-red-50"
                    : "text-slate-400 hover:bg-slate-100",
                className
            )}
            aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={size}
                className={cn(
                    "transition-all",
                    isActive && "fill-current animate-pulse"
                )}
            />
        </button>
    );
};

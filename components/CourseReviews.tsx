import React, { useState } from 'react';
import { Review } from '../types';
import { StarRating } from './ui/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseReviewsProps {
    courseId: number;
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

const REVIEWS_PER_PAGE = 5;

export const CourseReviews: React.FC<CourseReviewsProps> = ({
    courseId,
    reviews,
    averageRating,
    totalReviews
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    const currentReviews = reviews.slice(startIndex, endIndex);

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                No reviews yet. Be the first to review this course!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-slate-900">{averageRating.toFixed(1)}</div>
                        <StarRating rating={Math.round(averageRating)} size={16} className="justify-center mt-1" />
                        <div className="text-sm text-slate-500 mt-1">{totalReviews} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter(r => r.rating === star).length;
                            const percentage = (count / totalReviews) * 100;
                            return (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600 w-12">{star} star</span>
                                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-slate-500 w-8">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {currentReviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={review.userAvatar} alt={review.username} />
                                <AvatarFallback>{review.username[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{review.username}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StarRating rating={review.rating} size={14} />
                                            <span className="text-xs text-slate-400">{formatDate(review.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

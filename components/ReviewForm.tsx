import React, { useState } from 'react';
import { StarRating } from './ui/star-rating';
import { Send } from 'lucide-react';

interface ReviewFormProps {
    courseId: number;
    userId: string;
    username: string;
    onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    courseId,
    userId,
    username,
    onSubmit
}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || !comment.trim()) return;

        setSubmitting(true);
        try {
            await onSubmit(rating, comment);
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Rating
                </label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size={24}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this course..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={submitting || rating === 0 || !comment.trim()}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

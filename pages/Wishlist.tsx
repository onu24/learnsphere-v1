import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth, useCourses, useCart } from '../App';
import { useWishlist } from '../contexts/WishlistContext';

export const Wishlist: React.FC = () => {
    const { user } = useAuth();
    const { courses } = useCourses();
    const { addToCart } = useCart();
    const { wishlist, removeFromWishlist } = useWishlist();

    const wishlistCourses = courses.filter(course => wishlist.includes(course.id));

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
                <Heart size={48} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h2>
                <p className="text-slate-500 mb-8">Please login to view your wishlist</p>
                <Link to="/login" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors">
                    Login
                </Link>
            </div>
        );
    }

    if (wishlistCourses.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
                <Heart size={48} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h2>
                <p className="text-slate-500 mb-8">Start adding courses you love!</p>
                <Link to="/" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors">
                    Browse Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="text-red-500" size={32} />
                <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                <span className="text-slate-500">({wishlistCourses.length} courses)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all">
                        <Link to={`/course/${course.id}`}>
                            <img
                                src={course.image}
                                alt={course.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                        </Link>
                        <div className="p-4">
                            <Link to={`/course/${course.id}`}>
                                <h3 className="font-bold text-slate-900 mb-2 hover:text-brand-600 transition-colors">
                                    {course.name}
                                </h3>
                            </Link>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-brand-600">₹{course.price}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addToCart(course)}
                                        className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                        title="Add to Cart"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(course.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

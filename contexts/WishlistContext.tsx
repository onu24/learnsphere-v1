import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../App';
import * as DB from '../services/firebase';

interface WishlistContextType {
    wishlist: number[];
    addToWishlist: (courseId: number) => Promise<void>;
    removeFromWishlist: (courseId: number) => Promise<void>;
    isInWishlist: (courseId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        if (user) {
            loadWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const loadWishlist = async () => {
        if (!user) return;
        try {
            const userWishlist = await DB.getWishlist(user._id);
            setWishlist(userWishlist);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        }
    };

    const addToWishlist = async (courseId: number) => {
        if (!user) {
            alert('Please login to add courses to your wishlist');
            return;
        }
        try {
            await DB.addToWishlist(user._id, courseId);
            setWishlist(prev => [...prev, courseId]);
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
        }
    };

    const removeFromWishlist = async (courseId: number) => {
        if (!user) return;
        try {
            await DB.removeFromWishlist(user._id, courseId);
            setWishlist(prev => prev.filter(id => id !== courseId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const isInWishlist = (courseId: number) => {
        return wishlist.includes(courseId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};

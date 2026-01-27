export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed'
}

export interface Review {
  _id: string;
  courseId: number;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export interface GlobalFeedback {
  _id: string;
  userId: string | null;
  username: string;
  email: string;
  rating: number; // 1-5
  feedback: string;
  timestamp: string;
}

export interface EnrolledCourse {
  courseId: number;
  courseName: string;
  courseImage: string;
  enrolledAt: string;
  progress: number; // 0-100
  lastAccessed?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  passwordHash: string; // Simulated hash
  role: UserRole;
  createdAt: string;
  wishlist?: number[]; // Array of course IDs
  enrolledCourses?: EnrolledCourse[];
}

export interface Course {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  trailerUrl?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface CartItem extends Course {
  cartId: string; // Unique ID for cart management
}

export interface Transaction {
  _id: string;
  userId: string | null; // Nullable for guest
  customerName: string; // Explicitly store name of user
  payerEmail: string;
  transactionId: string; // The ID entered by user
  courses: string[]; // List of course names
  totalAmount: number;
  status: OrderStatus;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, deleteDoc, setDoc, getDoc, writeBatch, where } from "firebase/firestore";
import { User, UserRole, Transaction, OrderStatus, Course, Review, GlobalFeedback, EnrolledCourse } from "../types";
import { COURSES as INITIAL_COURSES } from "../constants";
import * as MockDB from "./mockMongo";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

// Initialize Firebase with error handling
let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseError: string | null = null;

try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    firebaseError = 'Firebase configuration is missing. Please set up your .env file with Firebase credentials.';
    console.warn(firebaseError);
  }
} catch (error: any) {
  firebaseError = `Firebase initialization failed: ${error.message}`;
  console.error(firebaseError);
}

// Collection Names
const TRANSACTIONS_COLLECTION = 'transactions';
const COURSES_COLLECTION = 'courses';
const USERS_COLLECTION = 'users';
const REVIEWS_COLLECTION = 'reviews';
const FEEDBACK_COLLECTION = 'feedback';

// Helper function to check Firebase initialization
const ensureFirebaseInitialized = () => {
  if (firebaseError || !auth || !db) {
    throw new Error(firebaseError || 'Firebase is not initialized. Please check your environment variables.');
  }
};

// Check if Firebase is available
const isFirebaseAvailable = (): boolean => {
  return !firebaseError && !!auth && !!db;
};

// --- USER SERVICES ---

export const registerUser = async (userData: Omit<User, '_id' | 'createdAt' | 'role'>): Promise<User> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for registerUser');
    return MockDB.registerUser(userData);
  }

  try {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.passwordHash); // passwordHash here is actually the raw password
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, {
      displayName: userData.username
    });

    // 2. Determine Role
    const role = userData.email === 'admin@learnsphere.com' ? UserRole.ADMIN : UserRole.USER;
    const createdAt = new Date().toISOString();

    const newUser: User = {
      _id: firebaseUser.uid,
      username: userData.username,
      email: userData.email,
      passwordHash: '***', // Don't store actual hash in local state
      role: role,
      createdAt: createdAt
    };

    // 3. Save User Data to Firestore Database
    await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), {
      username: userData.username,
      email: userData.email,
      role: role,
      createdAt: createdAt
    });

    return newUser;
  } catch (error: any) {
    // If Firebase fails, fallback to mockMongo
    console.warn('Firebase registerUser failed, falling back to localStorage:', error.message);
    return MockDB.registerUser(userData);
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for loginUser');
    return MockDB.loginUser(email, password);
  }

  try {
    // 1. Auth Login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Fetch User Data from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        _id: firebaseUser.uid,
        username: data.username,
        email: data.email,
        passwordHash: '***',
        role: data.role as UserRole,
        createdAt: data.createdAt
      };
    } else {
      // Fallback if DB document doesn't exist (e.g. legacy user or direct firebase console creation)
      const role = firebaseUser.email === 'admin@learnsphere.com' ? UserRole.ADMIN : UserRole.USER;
      // Optionally save it now to sync
      return {
        _id: firebaseUser.uid,
        username: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        passwordHash: '***',
        role: role,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
      };
    }
  } catch (error: any) {
    // If Firebase fails, fallback to mockMongo
    console.warn('Firebase loginUser failed, falling back to localStorage:', error.message);
    return MockDB.loginUser(email, password);
  }
};

export const logoutUser = async () => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for logoutUser');
    MockDB.logoutUser();
    return;
  }

  try {
    await signOut(auth);
  } catch (error: any) {
    console.warn('Firebase logoutUser failed, falling back to localStorage:', error.message);
    MockDB.logoutUser();
  }
};

// Ensure admin accounts exist in Firebase Auth + Firestore
export const ensureAdminExists = async (): Promise<void> => {
  // Skip if Firebase is not available (will use localStorage fallback)
  if (!isFirebaseAvailable()) {
    console.log('Firebase not available, skipping ensureAdminExists (using localStorage)');
    return;
  }

  const adminAccounts = [
    { email: 'admin@learnsphere.com', password: 'admin@123', username: 'admin' },
    { email: 'test@admin.com', password: 'test@1123', username: 'testadmin' }
  ];

  for (const acct of adminAccounts) {
    try {
      // Check Firestore for existing user document
      const q = query(collection(db, USERS_COLLECTION), where('email', '==', acct.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        console.log(`Admin exists in Firestore: ${acct.email}`);
        continue;
      }

      // Try to create Auth user
      try {
        const cred = await createUserWithEmailAndPassword(auth, acct.email, acct.password);
        const firebaseUser = cred.user;
        await updateProfile(firebaseUser, { displayName: acct.username });
        const createdAt = new Date().toISOString();
        await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), {
          username: acct.username,
          email: acct.email,
          role: UserRole.ADMIN,
          createdAt
        });
        console.log(`Created admin account: ${acct.email}`);
      } catch (authErr: any) {
        // If auth error indicates already exists, try to find the auth user by listing users isn't available in client SDK.
        // As a fallback, log and continue — admins can be manually created in Firebase Console.
        console.warn(`Could not create auth user for ${acct.email}:`, authErr.message || authErr);
      }
    } catch (err: any) {
      console.error('ensureAdminExists error for', acct.email, err.message || err);
    }
  }
};

// --- TRANSACTION SERVICES ---

export const createTransaction = async (data: Omit<Transaction, '_id' | 'timestamp'>): Promise<Transaction> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for createTransaction');
    return MockDB.createTransaction(data);
  }

  try {
    const newTx = {
      ...data,
      status: data.status || OrderStatus.PENDING, // Allow passing status, default to Pending
      timestamp: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), newTx);

    return {
      ...newTx,
      _id: docRef.id
    } as Transaction;
  } catch (error: any) {
    console.warn('Firebase createTransaction failed, falling back to localStorage:', error.message);
    return MockDB.createTransaction(data);
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for getTransactions');
    return MockDB.getTransactions();
  }

  try {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    })) as Transaction[];
  } catch (error: any) {
    console.warn('Firebase getTransactions failed, falling back to localStorage:', error.message);
    return MockDB.getTransactions();
  }
};

export const confirmTransaction = async (id: string): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for confirmTransaction');
    MockDB.confirmTransaction(id);
    // Also enroll user in courses for localStorage
    MockDB.enrollUserFromTransaction(id);
    return;
  }

  try {
    const txRef = doc(db, TRANSACTIONS_COLLECTION, id);
    const txDoc = await getDoc(txRef);
    
    if (!txDoc.exists()) {
      throw new Error('Transaction not found');
    }

    const txData = txDoc.data() as Transaction;
    
    // Update transaction status
    await updateDoc(txRef, {
      status: OrderStatus.CONFIRMED
    });

    // Enroll user in courses if transaction has a userId
    if (txData.userId) {
      await enrollUserFromTransaction(id);
    }
  } catch (error: any) {
    console.warn('Firebase confirmTransaction failed, falling back to localStorage:', error.message);
    MockDB.confirmTransaction(id);
    // Try to enroll even if Firebase update failed
    MockDB.enrollUserFromTransaction(id);
  }
};

// Helper function to enroll user in courses from a transaction
const enrollUserFromTransaction = async (txId: string): Promise<void> => {
  try {
    const transactions = await getTransactions();
    const transaction = transactions.find(tx => tx._id === txId);
    
    if (!transaction || !transaction.userId || transaction.status !== OrderStatus.CONFIRMED) {
      return;
    }

    // Get all courses to match course names
    const allCourses = await getCourses();
    
    // Enroll user in each course from the transaction
    for (const courseName of transaction.courses) {
      // Find course by name
      const course = allCourses.find(c => c.name === courseName);
      
      if (course) {
        const enrolledCourse: EnrolledCourse = {
          courseId: course.id,
          courseName: course.name,
          courseImage: course.image,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          lastAccessed: new Date().toISOString()
        };
        
        await enrollInCourse(transaction.userId!, enrolledCourse);
      }
    }
  } catch (error) {
    console.error('Failed to enroll user from transaction:', error);
  }
};

// --- COURSE SERVICES ---

export const getCourses = async (): Promise<Course[]> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback');
    return MockDB.getCourses();
  }

  try {
    const querySnapshot = await getDocs(collection(db, COURSES_COLLECTION));
    const courses = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure ID is number if needed by frontend
      return {
        id: typeof data.id === 'string' ? parseInt(data.id) : data.id,
        ...data
      };
    }) as Course[];

    return courses.sort((a, b) => a.id - b.id);
  } catch (error: any) {
    console.warn('Firebase getCourses failed, falling back to localStorage:', error.message);
    return MockDB.getCourses();
  }
};

export const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for addCourse');
    return MockDB.addCourse(courseData);
  }

  try {
    const courses = await getCourses();
    // Generate simple numeric ID
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;

    const newCourse = {
      id: newId,
      ...courseData
    };

    // Use the ID as the document ID for easier retrieval/updates
    await setDoc(doc(db, COURSES_COLLECTION, newId.toString()), newCourse);

    return newCourse;
  } catch (error: any) {
    console.warn('Firebase addCourse failed, falling back to localStorage:', error.message);
    return MockDB.addCourse(courseData);
  }
};

export const bulkAddCourses = async (newCoursesData: Omit<Course, 'id'>[]): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for bulkAddCourses');
    MockDB.bulkAddCourses(newCoursesData);
    return;
  }

  try {
    const courses = await getCourses();
    let currentMaxId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) : 0;

    const batch = writeBatch(db);

    newCoursesData.forEach((courseData, index) => {
      const newId = currentMaxId + 1 + index;
      const docRef = doc(db, COURSES_COLLECTION, newId.toString());
      batch.set(docRef, {
        id: newId,
        ...courseData
      });
    });

    await batch.commit();
  } catch (error: any) {
    console.warn('Firebase bulkAddCourses failed, falling back to localStorage:', error.message);
    MockDB.bulkAddCourses(newCoursesData);
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for deleteCourse');
    MockDB.deleteCourse(id);
    return;
  }

  try {
    await deleteDoc(doc(db, COURSES_COLLECTION, id.toString()));
  } catch (error: any) {
    console.warn('Firebase deleteCourse failed, falling back to localStorage:', error.message);
    MockDB.deleteCourse(id);
  }
};

export const updateCoursePrice = async (id: number, newPrice: number): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for updateCoursePrice');
    MockDB.updateCoursePrice(id, newPrice);
    return;
  }

  try {
    const courseRef = doc(db, COURSES_COLLECTION, id.toString());
    await updateDoc(courseRef, {
      price: newPrice
    });
  } catch (error: any) {
    console.warn('Firebase updateCoursePrice failed, falling back to localStorage:', error.message);
    MockDB.updateCoursePrice(id, newPrice);
  }
};

// Generic update helper for admin UI (keeps older API compatibility)
export const updateCourse = async (id: number, data: Partial<Course>): Promise<void> => {
  const courseRef = doc(db, COURSES_COLLECTION, id.toString());
  // Ensure numeric fields are cast appropriately if passed as strings
  const payload: any = { ...data };
  if (payload.price && typeof payload.price === 'string') payload.price = parseFloat(payload.price);
  await updateDoc(courseRef, payload);
};
export const resetCourses = async (): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for resetCourses');
    MockDB.resetCourses();
    return;
  }

  try {
    await seedCourses();
  } catch (error: any) {
    console.warn('Firebase resetCourses failed, falling back to localStorage:', error.message);
    MockDB.resetCourses();
  }
};

export const seedCourses = async (): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for seedCourses');
    MockDB.seedCourses();
    return;
  }

  try {
    const batch = writeBatch(db);
    INITIAL_COURSES.forEach(course => {
      const docRef = doc(db, COURSES_COLLECTION, course.id.toString());
      batch.set(docRef, course);
    });
    await batch.commit();
  } catch (error: any) {
    console.warn('Firebase seedCourses failed, falling back to localStorage:', error.message);
    MockDB.seedCourses();
  }
};

// --- REVIEW SERVICES ---

export const addReview = async (reviewData: Omit<Review, '_id' | 'timestamp'>): Promise<Review> => {
  const newReview = {
    ...reviewData,
    timestamp: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), newReview);

  return {
    ...newReview,
    _id: docRef.id
  } as Review;
};

export const getCourseReviews = async (courseId: number): Promise<Review[]> => {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('courseId', '==', courseId),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  })) as Review[];
};

export const getCourseAverageRating = async (courseId: number): Promise<{ average: number; total: number }> => {
  const reviews = await getCourseReviews(courseId);
  if (reviews.length === 0) return { average: 0, total: 0 };

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return {
    average: sum / reviews.length,
    total: reviews.length
  };
};

// --- GLOBAL FEEDBACK SERVICES ---

export const addGlobalFeedback = async (feedbackData: Omit<GlobalFeedback, '_id' | 'timestamp'>): Promise<GlobalFeedback> => {
  const newFeedback = {
    ...feedbackData,
    timestamp: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), newFeedback);

  return {
    ...newFeedback,
    _id: docRef.id
  } as GlobalFeedback;
};

export const getAllFeedback = async (): Promise<GlobalFeedback[]> => {
  const q = query(collection(db, FEEDBACK_COLLECTION), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  })) as GlobalFeedback[];
};

export const getAverageSiteRating = async (): Promise<{ average: number; total: number }> => {
  const feedback = await getAllFeedback();
  if (feedback.length === 0) return { average: 0, total: 0 };

  const sum = feedback.reduce((acc, fb) => acc + fb.rating, 0);
  return {
    average: sum / feedback.length,
    total: feedback.length
  };
};

// --- WISHLIST SERVICES ---

export const addToWishlist = async (userId: string, courseId: number): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for addToWishlist');
    MockDB.addToWishlist(userId, courseId);
    return;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentWishlist = userDoc.data().wishlist || [];
      if (!currentWishlist.includes(courseId)) {
        await updateDoc(userRef, {
          wishlist: [...currentWishlist, courseId]
        });
      }
    }
  } catch (error: any) {
    console.warn('Firebase addToWishlist failed, falling back to localStorage:', error.message);
    MockDB.addToWishlist(userId, courseId);
  }
};

export const removeFromWishlist = async (userId: string, courseId: number): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for removeFromWishlist');
    MockDB.removeFromWishlist(userId, courseId);
    return;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentWishlist = userDoc.data().wishlist || [];
      await updateDoc(userRef, {
        wishlist: currentWishlist.filter((id: number) => id !== courseId)
      });
    }
  } catch (error: any) {
    console.warn('Firebase removeFromWishlist failed, falling back to localStorage:', error.message);
    MockDB.removeFromWishlist(userId, courseId);
  }
};

export const getWishlist = async (userId: string): Promise<number[]> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for getWishlist');
    return MockDB.getWishlist(userId);
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().wishlist || [];
    }
    return [];
  } catch (error: any) {
    console.warn('Firebase getWishlist failed, falling back to localStorage:', error.message);
    return MockDB.getWishlist(userId);
  }
};

// --- ENROLLED COURSES SERVICES ---

export const enrollInCourse = async (userId: string, courseData: EnrolledCourse): Promise<void> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for enrollInCourse');
    MockDB.enrollInCourse(userId, courseData);
    return;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentEnrolled = userDoc.data().enrolledCourses || [];
      const alreadyEnrolled = currentEnrolled.some((c: EnrolledCourse) => c.courseId === courseData.courseId);

      if (!alreadyEnrolled) {
        await updateDoc(userRef, {
          enrolledCourses: [...currentEnrolled, courseData]
        });
      }
    }
  } catch (error: any) {
    console.warn('Firebase enrollInCourse failed, falling back to localStorage:', error.message);
    MockDB.enrollInCourse(userId, courseData);
  }
};

export const getEnrolledCourses = async (userId: string): Promise<EnrolledCourse[]> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for getEnrolledCourses');
    return MockDB.getEnrolledCourses(userId);
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().enrolledCourses || [];
    }
    return [];
  } catch (error: any) {
    console.warn('Firebase getEnrolledCourses failed, falling back to localStorage:', error.message);
    return MockDB.getEnrolledCourses(userId);
  }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  // Fallback to mockMongo if Firebase is not available
  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available, using localStorage fallback for getAllUsers');
    return MockDB.getAllUsers();
  }

  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    })) as User[];
  } catch (error: any) {
    console.warn('Firebase getAllUsers failed, falling back to localStorage:', error.message);
    return MockDB.getAllUsers();
  }
};

export const updateCourseProgress = async (userId: string, courseId: number, progress: number): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const enrolledCourses = userDoc.data().enrolledCourses || [];
    const updated = enrolledCourses.map((course: EnrolledCourse) =>
      course.courseId === courseId
        ? { ...course, progress, lastAccessed: new Date().toISOString() }
        : course
    );

    await updateDoc(userRef, {
      enrolledCourses: updated
    });
  }
};
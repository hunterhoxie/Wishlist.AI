import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Collection reference
const usersRef = collection(db, 'users');

// Create or update user profile
export const createOrUpdateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    const profileData = {
      ...userData,
      updatedAt: new Date(),
    };
    
    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, profileData);
      console.log('User profile updated successfully');
    } else {
      // Create new user
      const newUserData = {
        ...profileData,
        createdAt: new Date(),
        friendCount: 0,
        wishlistCount: 0,
      };
      await setDoc(userRef, newUserData);
      console.log('User profile created successfully');
    }
    
    return userId;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Get user profile with real-time updates
export const getUserProfileRealtime = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback({ id: docSnapshot.id, ...docSnapshot.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error fetching user profile:', error);
    callback(null);
  });
};

// Search users by email or display name
export const searchUsers = async (searchTerm) => {
  try {
    // Search by email (exact match or partial)
    const emailQuery = query(
      usersRef,
      where('email', '>=', searchTerm.toLowerCase()),
      where('email', '<=', searchTerm.toLowerCase() + '\uf8ff')
    );
    
    // Search by display name
    const nameQuery = query(
      usersRef,
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );
    
    const [emailSnapshot, nameSnapshot] = await Promise.all([
      getDocs(emailQuery),
      getDocs(nameQuery)
    ]);
    
    const users = new Map();
    
    // Combine results, avoiding duplicates
    emailSnapshot.forEach((doc) => {
      users.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    nameSnapshot.forEach((doc) => {
      users.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    return Array.from(users.values()).slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Update user stats (friend count, wishlist count, etc.)
export const updateUserStats = async (userId, stats) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...stats,
      updatedAt: new Date(),
    });
    console.log('User stats updated successfully');
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

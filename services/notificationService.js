import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

// Collection reference
const notificationsRef = collection(db, 'notifications');

// Add a new notification
export const addNotification = async (userId, text, type = 'info') => {
  try {
    const notification = {
      userId,
      text,
      type,
      read: false,
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(notificationsRef, notification);
    console.log('Notification added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

// Get real-time notifications for a user
export const getUserNotifications = (userId, callback) => {
  const q = query(
    notificationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifications = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    callback(notifications);
  });

  return unsubscribe;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
    console.log('Notification marked as read');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.forEach((document) => {
      const docRef = doc(db, 'notifications', document.id);
      batch.update(docRef, { read: true });
    });
    
    await batch.commit();
    console.log('All notifications marked as read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notificationRef);
    console.log('Notification deleted');
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Clear all read notifications for a user
export const clearReadNotifications = async (userId) => {
  try {
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.forEach((document) => {
      const docRef = doc(db, 'notifications', document.id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    console.log('Read notifications cleared');
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
};

// Helper function to create different types of notifications
export const createWishlistNotification = (userId, wishlistName, action) => {
  const messages = {
    'added': `Someone added a gift to "${wishlistName}"!`,
    'shared': `Your "${wishlistName}" wishlist has been shared!`,
    'updated': `"${wishlistName}" has been updated!`,
  };
  
  return addNotification(userId, messages[action] || `Update to "${wishlistName}"`, 'wishlist');
};

export const createGroupNotification = (userId, groupName, action) => {
  const messages = {
    'joined': `You joined "${groupName}" group!`,
    'new_member': `New member joined "${groupName}"!`,
    'updated': `"${groupName}" group has been updated!`,
  };
  
  return addNotification(userId, messages[action] || `Update to "${groupName}"`, 'group');
};

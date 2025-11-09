import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

// Collection reference
const wishlistsRef = collection(db, 'wishlists');
const wishlistItemsRef = collection(db, 'wishlistItems');

// Create a new wishlist
export const createWishlist = async (userId, wishlistData) => {
  try {
    const wishlist = {
      userId,
      name: wishlistData.name,
      description: wishlistData.description || '',
      category: wishlistData.category || 'general',
      isPublic: wishlistData.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      itemCount: 0,
    };
    
    const docRef = await addDoc(wishlistsRef, wishlist);
    console.log('Wishlist created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating wishlist:', error);
    throw error;
  }
};

// Get all wishlists for a user
export const getUserWishlists = (userId, callback) => {
  const q = query(
    wishlistsRef, 
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const wishlists = [];
    querySnapshot.forEach((doc) => {
      wishlists.push({ id: doc.id, ...doc.data() });
    });
    callback(wishlists);
  }, (error) => {
    console.error('Error fetching wishlists:', error);
    callback([]);
  });
};

// Update a wishlist
export const updateWishlist = async (wishlistId, updateData) => {
  try {
    const wishlistRef = doc(db, 'wishlists', wishlistId);
    await updateDoc(wishlistRef, {
      ...updateData,
      updatedAt: new Date(),
    });
    console.log('Wishlist updated successfully');
  } catch (error) {
    console.error('Error updating wishlist:', error);
    throw error;
  }
};

// Delete a wishlist and all its items
export const deleteWishlist = async (wishlistId) => {
  try {
    // First, get all items in this wishlist
    const itemsQuery = query(wishlistItemsRef, where('wishlistId', '==', wishlistId));
    const itemsSnapshot = await getDocs(itemsQuery);
    
    // Delete all items in a batch
    const batch = writeBatch(db);
    itemsSnapshot.forEach((itemDoc) => {
      batch.delete(itemDoc.ref);
    });
    
    // Delete the wishlist itself
    batch.delete(doc(db, 'wishlists', wishlistId));
    
    await batch.commit();
    console.log('Wishlist and all items deleted successfully');
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    throw error;
  }
};

// Add item to wishlist
export const addWishlistItem = async (wishlistId, itemData) => {
  try {
    const item = {
      wishlistId,
      name: itemData.name,
      description: itemData.description || '',
      price: itemData.price || 0,
      category: itemData.category || 'general',
      imageUrl: itemData.imageUrl || '',
      link: itemData.link || '',
      priority: itemData.priority || 'medium',
      isPurchased: false,
      purchasedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(wishlistItemsRef, item);
    console.log('Wishlist item added with ID:', docRef.id);
    
    // Update wishlist item count
    const itemsQuery = query(wishlistItemsRef, where('wishlistId', '==', wishlistId));
    const itemsSnapshot = await getDocs(itemsQuery);
    await updateWishlist(wishlistId, { itemCount: itemsSnapshot.size });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    throw error;
  }
};

// Get all items for a wishlist
export const getWishlistItems = (wishlistId, callback) => {
  const q = query(
    wishlistItemsRef, 
    where('wishlistId', '==', wishlistId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  }, (error) => {
    console.error('Error fetching wishlist items:', error);
    callback([]);
  });
};

// Update wishlist item
export const updateWishlistItem = async (itemId, updateData) => {
  try {
    const itemRef = doc(db, 'wishlistItems', itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updatedAt: new Date(),
    });
    console.log('Wishlist item updated successfully');
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    throw error;
  }
};

// Delete wishlist item
export const deleteWishlistItem = async (itemId, wishlistId) => {
  try {
    await deleteDoc(doc(db, 'wishlistItems', itemId));
    
    // Update wishlist item count
    const itemsQuery = query(wishlistItemsRef, where('wishlistId', '==', wishlistId));
    const itemsSnapshot = await getDocs(itemsQuery);
    await updateWishlist(wishlistId, { itemCount: itemsSnapshot.size });
    
    console.log('Wishlist item deleted successfully');
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    throw error;
  }
};

// Mark item as purchased
export const markItemAsPurchased = async (itemId, purchasedBy) => {
  try {
    await updateWishlistItem(itemId, {
      isPurchased: true,
      purchasedBy,
      updatedAt: new Date(),
    });
    console.log('Item marked as purchased');
  } catch (error) {
    console.error('Error marking item as purchased:', error);
    throw error;
  }
};

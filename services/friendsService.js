import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, deleteDoc, getDocs, writeBatch, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
const friendsRef = collection(db, 'friends');
const friendRequestsRef = collection(db, 'friendRequests');
const usersRef = collection(db, 'users');

// Send friend request
export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    // Check if request already exists
    const existingRequestQuery = query(
      friendRequestsRef,
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', toUserId)
    );
    const existingRequestSnapshot = await getDocs(existingRequestQuery);
    
    if (!existingRequestSnapshot.empty) {
      throw new Error('Friend request already sent');
    }
    
    // Check if already friends
    const friendsQuery = query(
      friendsRef,
      where('userId', '==', fromUserId),
      where('friendId', '==', toUserId)
    );
    const friendsSnapshot = await getDocs(friendsQuery);
    
    if (!friendsSnapshot.empty) {
      throw new Error('Already friends');
    }
    
    const friendRequest = {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
    };
    
    const docRef = await addDoc(friendRequestsRef, friendRequest);
    console.log('Friend request sent with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Get friend requests for a user
export const getFriendRequests = (userId, callback) => {
  const q = query(
    friendRequestsRef,
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    callback(requests);
  }, (error) => {
    console.error('Error fetching friend requests:', error);
    callback([]);
  });
};

// Accept friend request
export const acceptFriendRequest = async (requestId, fromUserId, toUserId) => {
  try {
    const batch = writeBatch(db);
    
    // Update request status
    const requestRef = doc(db, 'friendRequests', requestId);
    batch.update(requestRef, { status: 'accepted', updatedAt: new Date() });
    
    // Add friendship for both users
    const friendship1 = {
      userId: fromUserId,
      friendId: toUserId,
      createdAt: new Date(),
    };
    
    const friendship2 = {
      userId: toUserId,
      friendId: fromUserId,
      createdAt: new Date(),
    };
    
    batch.add(doc(friendsRef), friendship1);
    batch.add(doc(friendsRef), friendship2);
    
    await batch.commit();
    console.log('Friend request accepted successfully');
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

// Decline friend request
export const declineFriendRequest = async (requestId) => {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    await updateDoc(requestRef, {
      status: 'declined',
      updatedAt: new Date(),
    });
    console.log('Friend request declined successfully');
  } catch (error) {
    console.error('Error declining friend request:', error);
    throw error;
  }
};

// Get user's friends
export const getUserFriends = (userId, callback) => {
  const q = query(
    friendsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const friends = [];
    querySnapshot.forEach((doc) => {
      friends.push({ id: doc.id, ...doc.data() });
    });
    callback(friends);
  }, (error) => {
    console.error('Error fetching friends:', error);
    callback([]);
  });
};

// Remove friend
export const removeFriend = async (userId, friendId) => {
  try {
    const batch = writeBatch(db);
    
    // Find and remove both friendship records
    const friendship1Query = query(
      friendsRef,
      where('userId', '==', userId),
      where('friendId', '==', friendId)
    );
    
    const friendship2Query = query(
      friendsRef,
      where('userId', '==', friendId),
      where('friendId', '==', userId)
    );
    
    const [friendship1Snapshot, friendship2Snapshot] = await Promise.all([
      getDocs(friendship1Query),
      getDocs(friendship2Query)
    ]);
    
    friendship1Snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    friendship2Snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log('Friend removed successfully');
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// Search for users by email or username
export const searchUsers = async (searchTerm) => {
  try {
    // Note: In a real app, you'd want to implement proper user search
    // This is a simplified version that would need to be expanded
    const usersQuery = query(
      usersRef,
      where('email', '>=', searchTerm),
      where('email', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(usersQuery);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get friend request status between two users
export const getFriendRequestStatus = async (fromUserId, toUserId) => {
  try {
    const q = query(
      friendRequestsRef,
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', toUserId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { status: 'pending', id: querySnapshot.docs[0].id };
    }
    
    // Check reverse direction
    const reverseQuery = query(
      friendRequestsRef,
      where('fromUserId', '==', toUserId),
      where('toUserId', '==', fromUserId)
    );
    
    const reverseSnapshot = await getDocs(reverseQuery);
    if (!reverseSnapshot.empty) {
      return { status: 'received', id: reverseSnapshot.docs[0].id };
    }
    
    // Check if already friends
    const friendsQuery = query(
      friendsRef,
      where('userId', '==', fromUserId),
      where('friendId', '==', toUserId)
    );
    
    const friendsSnapshot = await getDocs(friendsQuery);
    if (!friendsSnapshot.empty) {
      return { status: 'friends' };
    }
    
    return { status: 'none' };
  } catch (error) {
    console.error('Error getting friend request status:', error);
    throw error;
  }
};

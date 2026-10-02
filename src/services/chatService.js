import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  writeBatch 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Fetch active conversations for current user from Firestore.
 */
export async function getConversations() {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', user.uid)
  );

  const snapshot = await getDocs(q);
  const convs = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  convs.sort((a, b) => {
    const tA = a.lastMessageAt?.toMillis?.() || (a.lastMessageAt?.seconds ? a.lastMessageAt.seconds * 1000 : 0);
    const tB = b.lastMessageAt?.toMillis?.() || (b.lastMessageAt?.seconds ? b.lastMessageAt.seconds * 1000 : 0);
    return tB - tA;
  });

  return convs;
}

/**
 * Subscribe to active conversations for a user live via onSnapshot().
 * Returns unsubscribe function.
 */
export function getConversationsForUser(uid, callback) {
  if (!uid) return () => {};

  const q = query(
    collection(db, 'conversations'),
    where('participantIds', 'array-contains', uid)
  );

  return onSnapshot(q, (snapshot) => {
    const convs = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    convs.sort((a, b) => {
      const tA = a.lastMessageAt?.toMillis?.() || (a.lastMessageAt?.seconds ? a.lastMessageAt.seconds * 1000 : 0);
      const tB = b.lastMessageAt?.toMillis?.() || (b.lastMessageAt?.seconds ? b.lastMessageAt.seconds * 1000 : 0);
      return tB - tA;
    });

    if (typeof callback === 'function') {
      callback(convs);
    }
  }, (err) => {
    console.error('Error fetching conversations for user:', err);
    if (typeof callback === 'function') {
      callback([]);
    }
  });
}

/**
 * Mark a conversation as read by a given user.
 */
export async function markConversationRead(conversationId, uid) {
  if (!conversationId || !uid) return;
  try {
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, {
      [`lastReadBy.${uid}`]: serverTimestamp()
    });
  } catch (err) {
    console.error("Failed to mark conversation read:", err);
  }
}

/**
 * Check if a conversation is unread for a given user.
 */
export function isConversationUnread(conv, currentUserId) {
  if (!conv || !currentUserId) return false;
  if (conv.lastMessageSenderId === currentUserId) return false;

  const lastMsgTime = conv.lastMessageAt?.toMillis?.() || (conv.lastMessageAt?.seconds ? conv.lastMessageAt.seconds * 1000 : 0);
  if (!lastMsgTime) return false;

  const userReadTime = conv.lastReadBy?.[currentUserId]?.toMillis?.() || (conv.lastReadBy?.[currentUserId]?.seconds ? conv.lastReadBy[currentUserId].seconds * 1000 : 0);
  if (!userReadTime) return true;

  return lastMsgTime > userReadTime;
}

/**
 * Format timestamp into relative string (e.g. "2m ago", "Yesterday").
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  let date;
  if (timestamp.toDate) {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    return '';
  }

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Fetch a single conversation document by ID.
 */
export async function getConversation(conversationId) {
  if (!conversationId) return null;
  const docRef = doc(db, 'conversations', conversationId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...docSnap.data()
  };
}

/**
 * Subscribe to real-time messages for a conversation.
 */
export function subscribeToMessages(conversationId, callback) {
  if (!conversationId) return () => {};

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      let createdAtStr = new Date().toISOString();
      if (data.createdAt?.toDate) {
        createdAtStr = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === 'string') {
        createdAtStr = data.createdAt;
      }

      return {
        id: docSnap.id,
        ...data,
        createdAt: createdAtStr
      };
    });
    callback(messages);
  }, (err) => {
    console.error('Error listening to messages:', err);
    callback([]);
  });
}

/**
 * Send a message within a conversation.
 */
export async function sendMessage(conversationId, text) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in to send a message.");

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const msgData = {
    senderId: user.uid,
    text,
    type: 'text',
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(messagesRef, msgData);

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    lastMessageAt: serverTimestamp(),
    lastMessageText: text,
    lastMessageSenderId: user.uid,
    [`lastReadBy.${user.uid}`]: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...msgData,
    createdAt: new Date().toISOString()
  };
}

/**
 * Propose a meetup.
 */
export async function proposeMeetup(conversationId, location, time) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in to propose a meetup.");

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const msgData = {
    senderId: user.uid,
    type: 'match',
    status: 'proposed',
    location,
    time,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(messagesRef, msgData);

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    matchStatus: 'proposed',
    lastMessageAt: serverTimestamp(),
    lastMessageText: `🤝 Proposed meetup: ${location}`,
    lastMessageSenderId: user.uid,
    [`lastReadBy.${user.uid}`]: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...msgData,
    createdAt: new Date().toISOString()
  };
}

/**
 * Confirm/agree meetup.
 */
export async function agreeMeetup(conversationId, messageId) {
  if (messageId) {
    const msgRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(msgRef, { status: 'agreed' });
  }

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, { matchStatus: 'agreed' });
}

/**
 * Confirm meetup payment.
 */
export async function confirmMeetup(conversationId, messageId) {
  if (messageId) {
    const msgRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(msgRef, { status: 'paid' });
  }

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, { matchStatus: 'paid' });

  return { success: true };
}

/**
 * Make an offer.
 */
export async function makeOffer(conversationId, amount) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in to make an offer.");

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const msgData = {
    senderId: user.uid,
    type: 'offer',
    amount: Number(amount),
    status: 'pending',
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(messagesRef, msgData);

  const convRef = doc(db, 'conversations', conversationId);
  await updateDoc(convRef, {
    lastMessageAt: serverTimestamp(),
    lastMessageText: `🏷️ Price offer: ₹${amount}`,
    lastMessageSenderId: user.uid,
    [`lastReadBy.${user.uid}`]: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...msgData,
    createdAt: new Date().toISOString()
  };
}

/**
 * Accept an offer.
 */
export async function acceptOffer(conversationId, messageId) {
  if (!messageId) return;
  const msgRef = doc(db, 'conversations', conversationId, 'messages', messageId);
  await updateDoc(msgRef, { status: 'accepted' });
}

/**
 * Get existing conversation for a listing, or create a new one.
 */
export async function getOrCreateConversationForListing(listingId, sellerId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in to message seller.");

  const currentUserId = user.uid;

  const q = query(
    collection(db, 'conversations'),
    where('listingId', '==', listingId),
    where('participantIds', 'array-contains', currentUserId)
  );

  const snapshot = await getDocs(q);
  const existingDoc = snapshot.docs.find(d => {
    const data = d.data();
    return data.participantIds && data.participantIds.includes(sellerId);
  });

  if (existingDoc) {
    return existingDoc.id;
  }

  // Fetch listing to get seller's name
  let sellerName = 'Seller';
  try {
    const listingDocRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingDocRef);
    if (listingSnap.exists()) {
      sellerName = listingSnap.data().sellerName || 'Seller';
    }
  } catch (e) {
    console.error("Could not fetch listing sellerName:", e);
  }

  const currentUserName = user.displayName || user.email || 'User';

  const newConv = {
    listingId,
    participantIds: [currentUserId, sellerId],
    participantNames: {
      [currentUserId]: currentUserName,
      [sellerId]: sellerName
    },
    createdAt: serverTimestamp(),
    lastMessageAt: serverTimestamp(),
    lastMessageText: 'Conversation started',
    lastMessageSenderId: currentUserId,
    matchStatus: 'none',
    lastReadBy: {
      [currentUserId]: serverTimestamp()
    }
  };

  const docRef = await addDoc(collection(db, 'conversations'), newConv);
  return docRef.id;
}

/**
 * Fetch meetup info for a given listing ID if an agreed/proposed match exists.
 */
export async function getMeetupInfoForListing(listingId) {
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(
    collection(db, 'conversations'),
    where('listingId', '==', listingId),
    where('participantIds', 'array-contains', user.uid)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const convDoc = snapshot.docs[0];
  const convData = convDoc.data();

  const messagesRef = collection(db, 'conversations', convDoc.id, 'messages');
  const msgSnap = await getDocs(messagesRef);

  const matchMsg = msgSnap.docs
    .map(d => d.data())
    .find(m => m.type === 'match' || m.type === 'matchCard');

  if (!matchMsg) return null;

  const buyerId = convData.participantIds?.find(id => id !== user.uid) || null;

  return {
    conversationId: convDoc.id,
    location: matchMsg.location,
    time: matchMsg.time,
    status: matchMsg.status,
    buyerId
  };
}

/**
 * Delete a conversation document and all its message subcollection docs.
 */
export async function deleteConversation(conversationId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User must be signed in to delete conversation.");

  const convRef = doc(db, 'conversations', conversationId);
  const convSnap = await getDoc(convRef);
  if (!convSnap.exists()) return;

  const convData = convSnap.data();
  if (!convData.participantIds?.includes(user.uid)) {
    throw new Error("Only a participant can delete the conversation.");
  }

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const snapshot = await getDocs(messagesRef);

  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  batch.delete(convRef);

  await batch.commit();
}

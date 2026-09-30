import { MOCK_CONVERSATIONS } from '../data/mockData';

const DELAY_MS = 300;

/**
 * Fetch active conversations for current user.
 * 
 * Firebase implementation plan:
 * Will query 'chats' collection where participantIds array-contains current user id.
 */
export async function getConversations() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_CONVERSATIONS]);
    }, DELAY_MS);
  });
}

/**
 * Fetch a single conversation by ID.
 * 
 * Firebase implementation plan:
 * Will fetch 'chats' document by ID.
 */
export async function getConversation(conversationId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
      if (conv) resolve({ ...conv });
      else reject(new Error('Conversation not found'));
    }, DELAY_MS);
  });
}

/**
 * Send a message within a conversation.
 * 
 * Firebase implementation plan:
 * Will call updateDoc or addDoc in subcollection 'messages' with serverTimestamp().
 */
export async function sendMessage(conversationId, text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const msg = {
        id: `m_${Date.now()}`,
        senderId: 'user_101',
        text,
        createdAt: new Date().toISOString()
      };
      const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
      if (conv) conv.messages.push(msg);
      resolve(msg);
    }, DELAY_MS);
  });
}

/**
 * Simulate confirming a meetup (lock meetup).
 */
export async function confirmMeetup(conversationId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
      if (conv) {
        resolve({ success: true });
      } else {
        reject(new Error('Conversation not found'));
      }
    }, DELAY_MS);
  });
}

/**
 * Get existing conversation for a listing, or create a new one.
 */
export async function getOrCreateConversationForListing(listingId, sellerId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUserId = 'user_101'; // Mock current user
      
      // Find existing
      let conv = MOCK_CONVERSATIONS.find(c => 
        c.listingId === listingId && 
        c.participantIds.includes(currentUserId) && 
        c.participantIds.includes(sellerId)
      );
      
      // Create new if not found
      if (!conv) {
        conv = {
          id: `c_${Date.now()}`,
          listingId,
          participantIds: [currentUserId, sellerId],
          messages: []
        };
        MOCK_CONVERSATIONS.push(conv);
      }
      resolve(conv.id);
    }, DELAY_MS);
  });
}

/**
 * Fetch meetup info for a given listing ID if an agreed/proposed match exists.
 */
export async function getMeetupInfoForListing(listingId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conv = MOCK_CONVERSATIONS.find((c) => c.listingId === listingId);
      if (!conv) return resolve(null);

      const matchMsg = conv.messages?.find((m) => m.type === 'match');
      if (!matchMsg) return resolve(null);

      resolve({
        conversationId: conv.id,
        location: matchMsg.location,
        time: matchMsg.time,
        status: matchMsg.status,
        buyerId: conv.participantIds?.find(id => id !== 'user_101')
      });
    }, DELAY_MS);
  });
}

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

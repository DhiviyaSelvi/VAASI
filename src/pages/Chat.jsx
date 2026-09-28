import React, { useEffect, useState } from 'react';
import { getConversations } from '../services/chatService';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChat() {
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    }
    loadChat();
  }, []);

  return (
    <div className="placeholder-page">
      <h1>Peer-to-Peer Chat</h1>
      <p className="placeholder-desc">
        Arrange in-person handovers and negotiate prices directly with local buyers/sellers.
      </p>

      {loading ? (
        <p style={{ color: 'var(--color-teal)' }}>⏳ Loading conversations...</p>
      ) : (
        <div style={{ marginTop: 'var(--space-md)' }}>
          {conversations.map((conv) => (
            <div key={conv.id} style={{
              padding: 'var(--space-md)',
              border: '1px solid var(--color-line)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-sm)'
            }}>
              <strong>Conversation #{conv.id}</strong> (Listing: {conv.listingId})
              <p style={{ fontSize: '0.85rem', color: 'var(--color-quiet-grey)', marginTop: '4px' }}>
                Latest msg: "{conv.messages[conv.messages.length - 1]?.text}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

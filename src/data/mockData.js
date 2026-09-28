/**
 * Mock Seed Data for Vaasi Development
 */

export const MOCK_USER = {
  id: 'user_101',
  name: 'Kavitha R',
  locality: 'Peelamedu',
  college: 'PSG College of Technology',
  memberSince: '2024-01-15',
  ratingAverage: 4.8,
  ratingCount: 12
};

export const MOCK_LISTINGS = [
  {
    id: 'b1',
    title: 'Concepts of Physics (Vol 1)',
    author: 'H.C. Verma',
    publisher: 'Bharati Bhawan',
    category: 'Academic & Textbooks',
    condition: 'good',
    mrp: 460,
    price: 220,
    description: 'Great condition physics textbook. Minor pencil notes on chapter 3.',
    locality: 'Peelamedu',
    photoUrls: ['https://placehold.co/400x500/1F5C56/FFFFFF?text=Physics+HC+Verma'],
    status: 'available',
    sellerId: 'user_101',
    sellerName: 'Kavitha R',
    createdAt: '2026-09-20T10:30:00Z'
  },
  {
    id: 'b2',
    title: 'Ponniyin Selvan (Parts 1-5 Box Set)',
    author: 'Kalki Krishnamurthy',
    publisher: 'Vikatan',
    category: 'Tamil Literature',
    condition: 'like_new',
    mrp: 1200,
    price: 750,
    description: 'Complete collector edition set. Read once, crisp pages.',
    locality: 'RS Puram',
    photoUrls: ['https://placehold.co/400x500/E8A33D/FFFFFF?text=Ponniyin+Selvan'],
    status: 'available',
    sellerId: 'user_102',
    sellerName: 'Arun Kumar',
    createdAt: '2026-09-22T14:15:00Z'
  },
  {
    id: 'b3',
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Random House',
    category: 'Non-Fiction & Self-Help',
    condition: 'fair',
    mrp: 599,
    price: 250,
    description: 'Well-read copy with yellow highlighter markups in early chapters.',
    locality: 'Gandhipuram',
    photoUrls: ['https://placehold.co/400x500/1C1E1D/FFFFFF?text=Atomic+Habits'],
    status: 'available',
    sellerId: 'user_103',
    sellerName: 'Deepak S',
    createdAt: '2026-09-25T09:00:00Z'
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    listingId: 'b1',
    participantIds: ['user_101', 'user_999'],
    messages: [
      {
        id: 'm1',
        senderId: 'user_999',
        text: 'Hi Kavitha, is the HC Verma book available for handover near PSG tech gate?',
        createdAt: '2026-09-26T11:00:00Z'
      },
      {
        id: 'm2',
        senderId: 'user_101',
        text: 'Yes! Available today around 5 PM.',
        createdAt: '2026-09-26T11:05:00Z'
      }
    ]
  }
];

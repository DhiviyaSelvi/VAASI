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
    photoUrls: [],
    editionNote: '44th Revised Ed.',
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
    photoUrls: [],
    editionNote: '5 Vol Set',
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
    photoUrls: [],
    editionNote: 'Paperback Edition',
    status: 'available',
    sellerId: 'user_103',
    sellerName: 'Deepak S',
    createdAt: '2026-09-25T09:00:00Z'
  },
  {
    id: 'b4',
    title: 'Engineering Mathematics Sem 1 Notes & Guide',
    author: 'T. Veerarajan',
    publisher: 'McGraw Hill',
    category: 'Engineering & Tech',
    condition: 'like_new',
    mrp: 350,
    price: 120,
    description: 'Clean reference guide with practice problem sets for 1st year engineering.',
    locality: 'Peelamedu',
    photoUrls: [],
    editionNote: 'Notes Marked',
    status: 'available',
    sellerId: 'user_104',
    sellerName: 'Siddharth M',
    createdAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'b5',
    title: 'Quantitative Aptitude for Competitive Exams',
    author: 'R.S. Aggarwal',
    publisher: 'S. Chand',
    category: 'Competitive Exams',
    condition: 'good',
    mrp: 650,
    price: 140,
    description: 'Essential guide for campus placements and bank exams. Neat condition.',
    locality: 'Saravanampatti',
    photoUrls: [],
    editionNote: 'Barely used',
    status: 'available',
    sellerId: 'user_105',
    sellerName: 'Priya N',
    createdAt: '2026-09-27T08:30:00Z'
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

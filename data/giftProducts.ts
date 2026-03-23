export type GiftCategory = 'couples' | 'friends' | 'premium' | 'tech' | 'everyone';

export interface GiftProduct {
  id: string;
  name: string;
  price: number;
  shortUrl: string;
  imageUrl: string;
  category: GiftCategory[];
  quote: string;
}

export const GIFT_CATEGORIES: Record<GiftCategory, { label: string; emoji: string }> = {
  couples: { label: 'For Couples', emoji: '💕' },
  friends: { label: 'For Friends', emoji: '🎁' },
  premium: { label: 'Premium Gifts', emoji: '👑' },
  tech: { label: 'Tech & Gadgets', emoji: '📱' },
  everyone: { label: 'For Everyone', emoji: '🎉' },
};

export const giftProducts: GiftProduct[] = [
  {
    id: '1',
    name: 'Giftplease Spotify LED Photo Frame',
    price: 599,
    shortUrl: 'https://amzn.to/4bN32Sm',
    imageUrl: 'https://m.media-amazon.com/images/I/81xj+KB cordonatm.BLt._AC_SY400_.png',
    category: ['couples'],
    quote: 'Every lyric reminds me of you ❤️',
  },
  {
    id: '2',
    name: 'CW CRAFTS Spotify Frame (LED, Acrylic)',
    price: 640,
    shortUrl: 'https://amzn.to/4d3cxiw',
    imageUrl: 'https://m.media-amazon.com/images/I/71PQ+Y1R5QL._AC_SY400_.png',
    category: ['couples'],
    quote: 'Our song, forever framed in light ✨',
  },
  {
    id: '3',
    name: 'Kimirica Love Story Bath & Body Set',
    price: 1147,
    shortUrl: 'https://amzn.to/4lT81W3',
    imageUrl: 'https://m.media-amazon.com/images/I/81S1Uz+2PLL._AC_SY400_.png',
    category: ['everyone'],
    quote: 'Spa day for two, because you deserve it 💆‍♀️',
  },
  {
    id: '4',
    name: 'exciting Lives Love Messages Popup Box',
    price: 198,
    shortUrl: 'https://amzn.to/3PqhQP4',
    imageUrl: 'https://m.media-amazon.com/images/I/71xMF+dq-installment._AC_SY400_.png',
    category: ['couples', 'friends'],
    quote: 'Surprise them with words from the heart 💌',
  },
  {
    id: '5',
    name: 'THE GIFT STUDIO Premium Gift Hamper',
    price: 8499,
    shortUrl: 'https://amzn.to/4ss1jJb',
    imageUrl: 'https://m.media-amazon.com/images/I/81WjqKNpJqL._AC_SY400_.png',
    category: ['premium'],
    quote: 'Luxury wrapped with all my love 🎁',
  },
  {
    id: '6',
    name: 'Ferrero Rocher Moments 16pcs',
    price: 253,
    shortUrl: 'https://amzn.to/4cZhjNS',
    imageUrl: 'https://m.media-amazon.com/images/I/81RpQ5MvtmL._AC_SY400_.png',
    category: ['everyone'],
    quote: 'Sweet moments deserve sweet treats 🍫',
  },
  {
    id: '7',
    name: 'Nestle Kitkat & Dairy Milk Combo',
    price: 439,
    shortUrl: 'https://amzn.to/3NmG6Bc',
    imageUrl: 'https://m.media-amazon.com/images/I/81t80Rd JMML._AC_SY400_.png',
    category: ['everyone'],
    quote: 'Break the chocolate and make a wish 🎂',
  },
  {
    id: '8',
    name: 'Butterfly Chocolate Gift Hamper',
    price: 549,
    shortUrl: 'https://amzn.to/4lH25iM',
    imageUrl: 'https://m.media-amazon.com/images/I/81Nw4jFspxL._AC_SY400_.png',
    category: ['couples'],
    quote: 'Sweet as butterfly wings, beautiful as you 🦋',
  },
  {
    id: '9',
    name: 'OnePlus Nord Buds 3r TWS',
    price: 1599,
    shortUrl: 'https://amzn.to/40MPWPO',
    imageUrl: 'https://m.media-amazon.com/images/I/61fHo5PLLQL._AC_SY400_.png',
    category: ['tech'],
    quote: 'Listen to your favorite tunes together 🎧',
  },
  {
    id: '10',
    name: 'OnePlus Nord Buds 3 Pro',
    price: 2999,
    shortUrl: 'https://amzn.to/4dCnKqk',
    imageUrl: 'https://m.media-amazon.com/images/I/71Xp0Giantes._AC_SY400_.png',
    category: ['tech'],
    quote: 'Premium sound, premium vibes 🎵',
  },
  {
    id: '11',
    name: 'OnePlus Buds 4 TWS',
    price: 5499,
    shortUrl: 'https://amzn.to/4rQcgmO',
    imageUrl: 'https://m.media-amazon.com/images/I/61HnF+6WPLL._AC_SY400_.png',
    category: ['tech'],
    quote: 'Wireless freedom, endless melodies 🎧',
  },
  {
    id: '12',
    name: 'Masaba Self Care Luxury Hamper',
    price: 15499,
    shortUrl: 'https://amzn.to/4d4DFgX',
    imageUrl: 'https://m.media-amazon.com/images/I/91bC+BqBNfL._AC_SY400_.png',
    category: ['premium'],
    quote: 'Designer self-care for your special someone 👸',
  },
  {
    id: '13',
    name: 'Anamika Khanna Luxury Tea Hamper',
    price: 19299,
    shortUrl: 'https://amzn.to/47i05aP',
    imageUrl: 'https://m.media-amazon.com/images/I/91xXctrl8sL._AC_SY400_.png',
    category: ['premium'],
    quote: 'Elegance in every sip ☕',
  },
  {
    id: '14',
    name: 'Pure Temptation Chocoblast Waffle Cones',
    price: 697,
    shortUrl: 'https://amzn.to/4spI0zX',
    imageUrl: 'https://m.media-amazon.com/images/I/81T15b+q Ll._AC_SY400_.png',
    category: ['everyone'],
    quote: 'Chocolate dreams in every bite 🍦',
  },
  {
    id: '15',
    name: 'Masaba Self Care Hamper (variant)',
    price: 15499,
    shortUrl: 'https://amzn.to/4bXNTi1',
    imageUrl: 'https://m.media-amazon.com/images/I/81O5hEQHyFL._AC_SY400_.png',
    category: ['premium'],
    quote: 'Pamper them like royalty 👑',
  },
  {
    id: '16',
    name: 'Mighty Celebration Trunk Hamper',
    price: 5499,
    shortUrl: 'https://amzn.to/47eeSDr',
    imageUrl: 'https://m.media-amazon.com/images/I/81+wQQ+iUYL._AC_SY400_.png',
    category: ['premium'],
    quote: 'A trunk full of celebrations 🎉',
  },
  {
    id: '17',
    name: 'UNIQUE MINIATURE Crystal Cube LED',
    price: 3600,
    shortUrl: 'https://amzn.to/4cZkqp2',
    imageUrl: 'https://m.media-amazon.com/images/I/71B3xwOInstallment._AC_SY400_.png',
    category: ['premium', 'couples'],
    quote: 'Glow that never fades, like my love 💎',
  },
  {
    id: '18',
    name: 'Samsung Galaxy S26 Ultra 5G',
    price: 159999,
    shortUrl: 'https://amzn.to/40JocLZ',
    imageUrl: 'https://m.media-amazon.com/images/I/817VS6 Installment._AC_SY400_.png',
    category: ['tech', 'premium'],
    quote: 'The best deserves the best 📱',
  },
];

export const getProductsByCategory = (category: GiftCategory): GiftProduct[] => {
  return giftProducts.filter((product) => product.category.includes(category));
};

export const AFFILIATE_DISCLOSURE = "As an Amazon Associate, we earn from qualifying purchases.";
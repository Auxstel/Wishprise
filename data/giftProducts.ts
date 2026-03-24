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
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
    category: ['couples'],
    quote: 'Every lyric reminds me of you ❤️',
  },
  {
    id: '2',
    name: 'CW CRAFTS Spotify Frame (LED, Acrylic)',
    price: 640,
    shortUrl: 'https://amzn.to/4d3cxiw',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400',
    category: ['couples'],
    quote: 'Our song, forever framed in light ✨',
  },
  {
    id: '3',
    name: 'Kimirica Love Story Bath & Body Set',
    price: 1147,
    shortUrl: 'https://amzn.to/4lT81W3',
    imageUrl: 'https://images.unsplash.com/photo-1559594806-904d96ab293e?q=80&w=400',
    category: ['everyone'],
    quote: 'Spa day for two, because you deserve it 💆‍♀️',
  },
  {
    id: '4',
    name: 'exciting Lives Love Messages Popup Box',
    price: 198,
    shortUrl: 'https://amzn.to/3PqhQP4',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400',
    category: ['couples', 'friends'],
    quote: 'Surprise them with words from the heart 💌',
  },
  {
    id: '5',
    name: 'THE GIFT STUDIO Premium Gift Hamper',
    price: 8499,
    shortUrl: 'https://amzn.to/4ss1jJb',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400',
    category: ['premium'],
    quote: 'Luxury wrapped with all my love 🎁',
  },
  {
    id: '6',
    name: 'Ferrero Rocher Moments 16pcs',
    price: 253,
    shortUrl: 'https://amzn.to/4cZhjNS',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=400',
    category: ['everyone'],
    quote: 'Sweet moments deserve sweet treats 🍫',
  },
  {
    id: '7',
    name: 'Nestle Kitkat & Dairy Milk Combo',
    price: 439,
    shortUrl: 'https://amzn.to/3NmG6Bc',
    imageUrl: 'https://images.unsplash.com/photo-1582231242353-838612ca447c?q=80&w=400',
    category: ['everyone'],
    quote: 'Break the chocolate and make a wish 🎂',
  },
  {
    id: '8',
    name: 'Butterfly Chocolate Gift Hamper',
    price: 549,
    shortUrl: 'https://amzn.to/4lH25iM',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=400',
    category: ['couples'],
    quote: 'Sweet as butterfly wings, beautiful as you 🦋',
  },
  {
    id: '9',
    name: 'OnePlus Nord Buds 3r TWS',
    price: 1599,
    shortUrl: 'https://amzn.to/40MPWPO',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
    category: ['tech'],
    quote: 'Listen to your favorite tunes together 🎧',
  },
  {
    id: '10',
    name: 'OnePlus Nord Buds 3 Pro',
    price: 2999,
    shortUrl: 'https://amzn.to/4dCnKqk',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400',
    category: ['tech'],
    quote: 'Premium sound, premium vibes 🎵',
  },
  {
    id: '11',
    name: 'OnePlus Buds 4 TWS',
    price: 5499,
    shortUrl: 'https://amzn.to/4rQcgmO',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400',
    category: ['tech'],
    quote: 'Wireless freedom, endless melodies 🎧',
  },
  {
    id: '12',
    name: 'Masaba Self Care Luxury Hamper',
    price: 15499,
    shortUrl: 'https://amzn.to/4d4DFgX',
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=400',
    category: ['premium'],
    quote: 'Designer self-care for your special someone 👸',
  },
  {
    id: '13',
    name: 'Anamika Khanna Luxury Tea Hamper',
    price: 19299,
    shortUrl: 'https://amzn.to/47i05aP',
    imageUrl: 'https://images.unsplash.com/photo-1544787210-2211d40ef01e?q=80&w=400',
    category: ['premium'],
    quote: 'Elegance in every sip ☕',
  },
  {
    id: '14',
    name: 'Pure Temptation Chocoblast Waffle Cones',
    price: 697,
    shortUrl: 'https://amzn.to/4spI0zX',
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dabb89a?q=80&w=400',
    category: ['everyone'],
    quote: 'Chocolate dreams in every bite 🍦',
  },
  {
    id: '15',
    name: 'Masaba Self Care Hamper (variant)',
    price: 15499,
    shortUrl: 'https://amzn.to/4bXNTi1',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400',
    category: ['premium'],
    quote: 'Pamper them like royalty 👑',
  },
  {
    id: '16',
    name: 'Mighty Celebration Trunk Hamper',
    price: 5499,
    shortUrl: 'https://amzn.to/47eeSDr',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400',
    category: ['premium'],
    quote: 'A trunk full of celebrations 🎉',
  },
  {
    id: '17',
    name: 'UNIQUE MINIATURE Crystal Cube LED',
    price: 3600,
    shortUrl: 'https://amzn.to/4cZkqp2',
    imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=400',
    category: ['premium', 'couples'],
    quote: 'Glow that never fades, like my love 💎',
  },
  {
    id: '18',
    name: 'Samsung Galaxy S26 Ultra 5G',
    price: 159999,
    shortUrl: 'https://amzn.to/40JocLZ',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400',
    category: ['tech', 'premium'],
    quote: 'The best deserves the best 📱',
  },
];

export const getProductsByCategory = (category: GiftCategory): GiftProduct[] => {
  return giftProducts.filter((product) => product.category.includes(category));
};

export const AFFILIATE_DISCLOSURE = "As an Amazon Associate, we earn from qualifying purchases.";
export enum CakeFlavor {
  VANILLA = 'vanilla',
  CHOCOLATE = 'chocolate',
  STRAWBERRY = 'strawberry',
  RED_VELVET = 'red_velvet',
  LEMON = 'lemon',
  MINT = 'mint',
  BLUEBERRY = 'blueberry',
  CARAMEL = 'caramel',
  COFFEE = 'coffee',
  PISTACHIO = 'pistachio'
}

export enum CakeStyle {
  CLASSIC = 'classic',        // Round
  MODERN = 'modern',          // Square
  GRAND = 'grand',            // 2-Tier Round
  HEART = 'heart',            // Heart Shape
  HEXAGON = 'hexagon',        // Hexagonal
  TIERED_SQUARE = 'tiered_square', // 2-Tier Square
  BUNDT = 'bundt',            // Torus/Ring
  PILLOW = 'pillow',          // Rounded Box
  SPHERE = 'sphere',          // Ball/Planet
  TOWER = 'tower'             // 3-Tier Tall
}

export interface SurpriseData {
  id: string;
  senderName: string; // The Creator
  receiverName: string; // The Receiver
  introMessage: string;
  personalNote: string;
  finalMessage: string;
  cakeShape: UpdatedCakeShape;
  updatedCakeFlavor: UpdatedCakeFlavor;
  cakeDecoration: boolean;
  cakeDrip: boolean;
  cakeMessage: string;
  cakeMessageColor: string;
  cakeFlavor: CakeFlavor;
  cakeStyle: CakeStyle;
  candleCount: number;
  songUrl?: string; // Optional custom song
  voiceMessageUrl?: string; // New field for voice message
  wheelOptions?: string[]; // Custom options for the wheel
  createdAt: number;
}

export enum ExperienceStep {
  LANDING = 'LANDING',
  INTRO_ANIMATION = 'INTRO_ANIMATION',
  INTERACTIVE_CHECK = 'INTERACTIVE_CHECK',
  WHEEL = 'WHEEL',
  CANDLES = 'CANDLES',
  CAKE_CUTTING = 'CAKE_CUTTING',
  REVEAL = 'REVEAL',
  ENDING = 'ENDING'
}

export enum UpdatedCakeShape {
  ROUND  = 'round',
  SQUARE = 'square',
  HEART  = 'heart',
  TIER   = 'tier',
}

export enum UpdatedCakeFlavor {
  VANILLA = "vanilla", 
  CHOCOLATE = "chocolate", 
  STRAWBERRY = "strawberry", 
  RED_VELVET = "red_velvet", 
  CARAMEL = "caramel", 
  COFFEE = "coffee", 
  BLUEBERRY = "blueberry", 
  PISTACHIO = "pistachio"
}

export interface AdProps {
  type: 'banner' | 'interstitial' | 'rewarded';
  className?: string;
  onClose?: () => void;
}

export interface Feedback {
  id?: string;
  surpriseId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}
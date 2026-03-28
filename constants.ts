import { CakeFlavor } from './types';

export const APP_NAME = "Wishprise";

export const CAKE_COLORS: Record<CakeFlavor, string> = {
  [CakeFlavor.VANILLA]: '#FDF4E3',
  [CakeFlavor.CHOCOLATE]: '#5D4037',
  [CakeFlavor.STRAWBERRY]: '#FFCDD2',
  [CakeFlavor.RED_VELVET]: '#B71C1C',
  [CakeFlavor.LEMON]: '#FFF59D',
  [CakeFlavor.MINT]: '#C8E6C9',
  [CakeFlavor.BLUEBERRY]: '#7986CB',
  [CakeFlavor.CARAMEL]: '#D7CCC8',
  [CakeFlavor.COFFEE]: '#8D6E63',
  [CakeFlavor.PISTACHIO]: '#C5E1A5',
};

export const WHEEL_MESSAGES = [
  "You are loved beyond measure ❤️",
  "The world is better with you in it 🌍",
  "Your smile lights up every room ✨",
  "May this year be your best yet 🚀",
  "You deserve all the happiness 🎁",
  "Keep shining, beautiful soul 🌟",
];

// ============================================================================
// HOW TO FIX SOUNDS IN PRODUCTION:
// Pixabay blocks direct links from production servers. You MUST download these 
// sounds manually and place them inside the `public/sounds/` folder of your project:
// 
// 1. Download: https://cdn.pixabay.com/download/audio/2022/10/16/audio_9c03b03c86.mp3 
//    -> Save as: public/sounds/demo-music.mp3
// 2. Download: https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3 
//    -> Save as: public/sounds/pop.mp3
// 3. Download: https://cdn.pixabay.com/download/audio/2022/03/15/audio_7306236b2d.mp3 
//    -> Save as: public/sounds/spin.mp3
// 4. Download: https://cdn.pixabay.com/download/audio/2022/01/18/audio_820a9a7a6c.mp3 
//    -> Save as: public/sounds/chime.mp3
// ============================================================================

export const DEMO_MUSIC_URL = "/sounds/demo-music.mp3"; 
export const POPPER_SOUND_URL = "/sounds/pop.mp3"; 

// Magical Interaction SFX
export const BALLOON_POP_URL = "/sounds/pop.mp3";
export const WHEEL_SPIN_URL = "/sounds/spin.mp3";
export const MAGIC_CHIME_URL = "/sounds/chime.mp3";

export const PLACEHOLDER_ID = 'demo-123';
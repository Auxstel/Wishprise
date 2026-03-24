export type PosterTheme = 'dark' | 'light' | 'gold' | 'minimal' | 'fun' | 'romantic' | 'luxury';
export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface PosterTemplate {
    id: string;
    name: string;
    category: string;
    theme: PosterTheme;
    colors: {
        bg: string;
        text: string;
        accent: string;
        muted: string;
    };
    fonts: {
        headline: string;
        message: string;
    };
    elements?: string[];
    tag?: 'Trending' | 'Most Loved' | 'New';
    previewImageUrl?: string;
}

export const POSTER_TEMPLATES: PosterTemplate[] = [
    {
        id: 'minimal-elegance',
        name: 'Minimal Elegance',
        category: 'Minimal Elegance',
        theme: 'minimal',
        colors: {
            bg: '#ffffff',
            text: '#0f172a',
            accent: '#8b5cf6',
            muted: '#64748b'
        },
        fonts: {
            headline: '"Playfair Display", serif',
            message: '"Inter", sans-serif'
        },
        tag: 'Trending'
    },
    {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        category: 'Luxury Gold',
        theme: 'gold',
        colors: {
            bg: '#1c1917',
            text: '#ffffff',
            accent: '#fbbf24',
            muted: '#78716c'
        },
        fonts: {
            headline: '"Playfair Display", serif',
            message: '"Inter", sans-serif'
        },
        tag: 'Most Loved'
    },
    {
        id: 'cute-fun',
        name: 'Cute & Fun',
        category: 'Cute & Fun',
        theme: 'fun',
        colors: {
            bg: '#fdf2f8',
            text: '#be185d',
            accent: '#f472b6',
            muted: '#db2777'
        },
        fonts: {
            headline: '"Inter", sans-serif',
            message: '"Inter", sans-serif'
        },
        tag: 'New'
    },
    {
        id: 'romantic-vibes',
        name: 'Romantic',
        category: 'Romantic',
        theme: 'romantic',
        colors: {
            bg: '#450a0a',
            text: '#ffffff',
            accent: '#f43f5e',
            muted: '#fca5a5'
        },
        fonts: {
            headline: '"Playfair Display", serif',
            message: '"Inter", sans-serif'
        }
    },
    {
        id: 'dark-pro',
        name: 'Dark Studio',
        category: 'Trending Posters',
        theme: 'dark',
        colors: {
            bg: '#0f172a',
            text: '#ffffff',
            accent: '#c084fc',
            muted: '#94a3b8'
        },
        fonts: {
            headline: '"Inter", sans-serif',
            message: '"Inter", sans-serif'
        }
    }
];

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    type?: string;
    name?: string;
    image?: string;
}

export const Seo: React.FC<SeoProps> = ({
    title,
    description,
    type = 'website',
    name = 'Wishprise',
    image = '/og-image.jpg' // Assuming we might have one or will add one later, fallback
}) => {
    const siteTitle = title ? `${title} | Wishprise` : 'Wishprise - Magical 3D Birthday Surprises';
    const siteDescription = description || "Create stunning, interactive 3D birthday surprises for free. No login required. customized cakes, music, and magic delivered via a simple link.";

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={siteDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={image} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

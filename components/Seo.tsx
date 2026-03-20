import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title?: string;
    description?: string;
    type?: string;
    name?: string;
    image?: string;
    path?: string;
    noindex?: boolean;
}

export const Seo: React.FC<SeoProps> = ({
    title,
    description,
    type = 'website',
    name = 'Wishprise',
    image = '/og-image.jpg', // Assuming we might have one or will add one later, fallback
    path = '',
    noindex = false
}) => {
    const siteTitle = title ? `${title} | Wishprise` : 'Wishprise - Free 3D Birthday Wish Maker';
    const siteDescription = description || "Create stunning, interactive 3D birthday surprises for free. No login required. The #1 birthday wish maker for custom cakes, music, and virtual magic delivered via link.";
    const canonicalUrl = `https://wishprise.online${path}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={siteDescription} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={canonicalUrl} />
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="apple-touch-icon" href="/logo.png" />
            <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
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

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
    schemaType?: 'SoftwareApplication' | 'WebSite' | 'Article' | 'FAQPage';
    faqData?: Array<{ question: string; answer: string }>;
}

export const Seo: React.FC<SeoProps> = ({
    title,
    description,
    type = 'website',
    name = 'Wishprise',
    image = '/og-image.jpg',
    path = '',
    noindex = false,
    schemaType = 'WebSite',
    faqData = []
}) => {
    const siteTitle = title ? `${title} | Wishprise` : 'Wishprise - Create Free 3D Birthday Wishes Online';
    const siteDescription = description || "Wishprise is the #1 free 3D birthday wish maker. Create stunning interactive surprises with custom cakes and music. Send via WhatsApp link in 2026. No login required.";
    const canonicalUrl = `https://wishprise.online${path}`;

    // 1. Primary Schema (SoftwareApp vs WebSite vs Article)
    let primarySchema: any = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": title || name,
        "url": canonicalUrl,
        "description": siteDescription,
    };

    if (schemaType === 'SoftwareApplication') {
        primarySchema = {
            ...primarySchema,
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        };
    }

    // 2. Breadcrumb Schema (Automatic based on path)
    const pathParts = path.split('/').filter(Boolean);
    const breadcrumbItems = [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wishprise.online" }
    ];
    
    pathParts.forEach((part, index) => {
        const itemPath = `https://wishprise.online/${pathParts.slice(0, index + 1).join('/')}`;
        const itemName = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": itemName,
            "item": itemPath
        });
    });

    // 3. FAQ Schema
    let faqSchema: any = null;
    if (schemaType === 'FAQPage' && faqData && faqData.length > 0) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name='description' content={siteDescription} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={canonicalUrl} />
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="apple-touch-icon" href="/logo.png" />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={image} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content="@wishprise" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={image} />

            {/* Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(primarySchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
            {faqSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            )}
        </Helmet>
    );
};

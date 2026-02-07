'use client';

import { useEffect } from 'react';

interface PageMetadataProps {
    title?: string;
    description?: string;
    faviconUrl?: string;
}

export default function PageMetadata({ title, description, faviconUrl }: PageMetadataProps) {
    useEffect(() => {
        // 1. Update Title
        if (title && document.title !== title) {
            document.title = title;
        }

        // 2. Update Meta Description
        if (description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                metaDescription.setAttribute('content', description);
                document.head.appendChild(metaDescription);
            }
        }

        // 3. Update Favicon
        if (faviconUrl) {
            const existingFavicons = document.querySelectorAll('link[rel*="icon"]');

            // Update the first one found or create new
            if (existingFavicons.length > 0) {
                existingFavicons.forEach((el) => {
                    (el as HTMLLinkElement).href = faviconUrl;
                });
            } else {
                const linkFavicon = document.createElement('link');
                linkFavicon.rel = 'icon';
                linkFavicon.href = faviconUrl;
                document.head.appendChild(linkFavicon);
            }
        }
    }, [title, description, faviconUrl]);

    return null;
}

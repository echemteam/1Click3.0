"use client"
import React, { useEffect } from 'react'
import { useLazyGetStaticPageBySlugQuery } from 'src/redux/serviceApi/slugAPI';
import { usePathname } from 'next/navigation';
import "./RandDService.scss";
import Head from 'next/head';
import DataLoader from '@components/Common/Loader/DataLoader';
import PageNotFoundPage from '@features/pageNotFound/PageNotFoundPage';


const RandDService = () => {
    const pathname = usePathname();
    const slug = pathname.split("/").pop();

    const [getStaticPage, { data: page, isFetching, isError }] = useLazyGetStaticPageBySlugQuery();

    useEffect(() => {
        if (slug) {
            getStaticPage(encodeURIComponent(slug));
        }
    }, [slug]);

    if (isFetching) {
        return <div><DataLoader /></div>;
    }

    if (isError) {
        return <div><PageNotFoundPage /></div>;
    }

    if (!page) {
        // nothing fetched yet or still resolving
        return <div><DataLoader /></div>; // or a loader
    }

    if (!page.isActive && page.slug !== slug) {
        return <div><PageNotFoundPage /></div>;
    }

    return (
        <div className="randd-page">
            <Head>
                <title>{page?.metaTitle || page?.title}</title>
                <meta name="description" content={page?.metaDescription || ""} />
                <meta name="keywords" content={page?.metaKeywords || ""} />
                <meta name="robots" content={page?.metaRobots || ""} />
                <link rel="canonical" href={page?.canonicalUrl || ""} />

                <meta property="og:title" content={page?.ogTitle || page?.title} />
                <meta property="og:description" content={page?.ogDescription || ""} />
                <meta property="og:image" content={page?.ogImage || ""} />

                <meta name="twitter:title" content={page?.twitterTitle || page?.title} />
                <meta name="twitter:description" content={page?.twitterDescription || ""} />
                <meta name="twitter:image" content={page?.twitterImage || ""} />

                {page?.structuredDataJsonLd && (
                    <script type="application/ld+json">{page.structuredDataJsonLd}</script>
                )}
            </Head>

            <div dangerouslySetInnerHTML={{ __html: page?.content || "" }} />
        </div>
    );
}

export default RandDService
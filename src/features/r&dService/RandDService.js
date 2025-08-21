"use client"
import React, { useEffect } from 'react'
import { useLazyGetStaticPageBySlugQuery } from 'src/redux/serviceApi/slugAPI';
import { usePathname } from 'next/navigation';
import "./RandDService.scss";
import Head from 'next/head';


const RandDService = () => {
    const pathname = usePathname();
    const slug = pathname.split("/").pop();
    console.log('slug', slug);

    const [getStaticPage, { data: page, isFetching, isError }] = useLazyGetStaticPageBySlugQuery();
    console.log('page', page);


    useEffect(() => {
        if (slug) {
            getStaticPage(encodeURIComponent(slug));

        }
    }, [slug]);

    if (isFetching) return <div>Loading...</div>;
    if (isError || !page?.isActive) return <div>Under Maintenance</div>;

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
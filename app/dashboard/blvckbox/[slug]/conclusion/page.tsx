'use client';
import React from 'react';
import Layout from '../../../../../components/layout/Layout';
import ConclusionPage from '../../../../../components/dashboard/blvckbox/[slug]/conclusion/page';
import { useParams } from 'next/navigation';

const Page = () => {
    const params = useParams();
    const slug = params?.slug as string;

    return (
        <Layout>
            {slug ? <ConclusionPage slug={slug} /> : <p>Loading...</p>}
        </Layout>
    );
};

export default Page;

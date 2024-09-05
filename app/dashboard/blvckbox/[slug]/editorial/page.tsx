'use client';
import React from 'react';
import Layout from '../../../../../components/layout/Layout';
import EditorialPage from '../../../../../components/dashboard/blvckbox/[slug]/editorial/page';
import { useParams } from 'next/navigation';

const Page = () => {
    const params = useParams();
    const slug = params?.slug as string;

    return (
        <Layout>
            {slug ? <EditorialPage slug={slug} /> : <p>Loading...</p>}
        </Layout>
    );
};

export default Page;

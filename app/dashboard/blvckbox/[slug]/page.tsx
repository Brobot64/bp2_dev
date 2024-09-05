'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import EditBlvckboxForm from '../../../../components/dashboard/blvckbox/[slug]/page';
import Layout from '../../../../components/layout/Layout';

const Page = () => {
    const params = useParams();
    const slug = params?.slug as string;

    return (
        <Layout>
            {slug ? <EditBlvckboxForm slug={slug} /> : <p>Loading...</p>}
        </Layout>
    );
};

export default Page;

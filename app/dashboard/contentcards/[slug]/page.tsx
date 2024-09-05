'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../../components/layout/Layout';
import withAuth from '../../../../components/hoc/withAuth';
import EditContentcardForm from '../../../../components/dashboard/contentcards/[slug]/page';

const Page: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  return (
    <Layout>
      {slug ? <EditContentcardForm slug={slug} /> : <p>Loading...</p>}
    </Layout>
  );
};

export default withAuth(Page, [1]);

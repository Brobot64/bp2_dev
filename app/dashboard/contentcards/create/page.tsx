'use client';
import React from 'react';
import Layout from '../../../../components/layout/Layout';
import withAuth from '../../../../components/hoc/withAuth';
import ContentcardForm from '../../../../components/dashboard/contentcards/create/Page';


const Page: React.FC = () => {
  return (
    <Layout>
      <ContentcardForm />
    </Layout>
  );
};

export default withAuth(Page, [1]);
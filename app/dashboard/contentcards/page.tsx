'use client';
import React from 'react';
import Layout from '../../../components/layout/Layout';
import withAuth from '../../../components/hoc/withAuth';
import Contentcard from '../../../components/dashboard/contentcards/Page';


const Page: React.FC = () => {
  return (
    <Layout>
      <Contentcard />
    </Layout>
  );
};

export default withAuth(Page, [1]);
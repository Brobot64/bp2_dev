'use client';
import React from 'react';
import Layout from '../../../components/layout/Layout';
import withAuth from '../../../components/hoc/withAuth';
import Subsciptions from '../../../components/dashboard/subscriptions/page';


const Page: React.FC = () => {
  return (
    <Layout>
      <Subsciptions />
    </Layout>
  );
};

export default withAuth(Page, [1]);
'use client';
import React from 'react';
import Layout from '../../../components/layout/Layout';
import withAuth from '../../../components/hoc/withAuth';
import Blvckcard from '../../../components/dashboard/blvckvcards/page';


const Page: React.FC = () => {
  return (
    <Layout>
      <Blvckcard />
    </Layout>
  );
};

export default withAuth(Page, [1,2]);
'use client';
import React from 'react';
import Layout from '../../../components/layout/Layout';
import Users from '../../../components/dashboard/create-user/page';
import withAuth from '../../../components/hoc/withAuth';
import Blvckbox from '../../../components/dashboard/blvckbox/page';


const Page: React.FC = () => {
  return (
    <Layout>
      <Blvckbox />
    </Layout>
  );
};

export default withAuth(Page, [1]);
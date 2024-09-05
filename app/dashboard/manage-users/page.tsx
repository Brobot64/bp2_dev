'use client';
import React from 'react';
import Layout from '../../../components/layout/Layout';
import Users from '../../../components/dashboard/manage-users/page';
import withAuth from '../../../components/hoc/withAuth';


const Page: React.FC = () => {
  return (
    <Layout>
      <Users />
    </Layout>
  );
};

export default withAuth(Page, [1,2]);
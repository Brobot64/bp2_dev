'use client';
import React from 'react';
import Layout from '../../../../components/layout/Layout';
import withAuth from '../../../../components/hoc/withAuth';
import BlvckboxForm from '../../../../components/dashboard/blvckbox/create/page';


const Page: React.FC = () => {
  return (
    <Layout>
      <BlvckboxForm />
    </Layout>
  );
};

export default withAuth(Page, [1]);
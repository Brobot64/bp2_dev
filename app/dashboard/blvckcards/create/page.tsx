'use client';
import React from 'react';
import Layout from '../../../../components/layout/Layout';
import withAuth from '../../../../components/hoc/withAuth';
import BlvckcardForm from '../../../../components/dashboard/blvckvcards/create/page';


const Page: React.FC = () => {
  return (
    <Layout>
      <BlvckcardForm />
    </Layout>
  );
};

export default withAuth(Page, [1,2]);
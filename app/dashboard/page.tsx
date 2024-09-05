'use client';
import React from 'react';
import Layout from '../../components/layout/Layout';
import DashboardPage from '../../components/dashboard/DashboardPage';
import withAuth from '../../components/hoc/withAuth';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <DashboardPage />
    </Layout>
  );
};

export default withAuth(Dashboard, [1, 2]);

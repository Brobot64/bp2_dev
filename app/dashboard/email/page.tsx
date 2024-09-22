'use client';
import React from 'react'
import withAuth from '@components/hoc/withAuth';
import Layout from '@components/layout/Layout';
import Emails from '@components/dashboard/email-contents/page';
import EmailComposer from '@components/dashboard/email-contents/EmailComposer';

const Page: React.FC = () => {
  return (
    <Layout>
      <Emails/>
    </Layout>
  )
}

export default withAuth(Page, [1])
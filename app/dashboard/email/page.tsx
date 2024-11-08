'use client';
import React, { useState } from 'react'
import withAuth from '@components/hoc/withAuth';
import Layout from '@components/layout/Layout';
import Emails from '@components/dashboard/email-contents/page';
import EmailComposer from '@components/dashboard/email-contents/EmailComposer';
import QuillEditor from '@components/dashboard/email-contents/QuillEditor';
import EmailTemplates from '@components/dashboard/email-contents/EmailTemplateEditor';

const Page: React.FC = () => { 
  const [body, setBody] = useState<string>('');  // State to store the email body content

  const handleBodyChange = (content: string) => {
    setBody(content);  // Update the state whenever the content changes
  };
  return (
    <Layout>
      {/* <Emails/> */}
      <EmailTemplates/>
      {/* <QuillEditor value={body} onChange={handleBodyChange} /> */}
    </Layout>
  )
}

export default withAuth(Page, [1])
// src/pages/EmailComposer.tsx
import React, { useState } from 'react';
import EmailEditor from './EmailEditor';

const EmailComposer = () => {
  const [emailContent, setEmailContent] = useState('');

  const handleContentChange = (newContent: string) => {
    setEmailContent(newContent);
  };

  const handleSubmit = () => {
    // Handle the submission of the email content
    console.log('Email content:', emailContent);
  };

  return (
    <div>
      <h2>Compose Email</h2>
      <EmailEditor content={emailContent} onContentChange={handleContentChange} />
      <button onClick={handleSubmit}>Send Email</button>
    </div>
  );
};

export default EmailComposer;

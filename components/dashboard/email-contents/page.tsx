import React, { useState } from 'react';
import MessagePopup from '../popups/MessagePopup';
import EmailComposer from './EmailComposer';

const Emails: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


  const closeSuccessMessage = () => {
    setSuccessMessage('');
};

const closeErrorMessage = () => {
    setError('');
};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh

    // Log the form data
    console.log({
      to,
      subject,
      body,
    });

    // Optionally, you can clear the fields after submission
    setTo('');
    setSubject('');
    setBody('');
  };

  return (
    <div className='flex flex-col w-full h-5/6 bg-white rounded-[12px] overflow-hidden'>
      <div className='bg-black text-white p-3 pl-4'>
        Compose Email
      </div>
      <form onSubmit={handleSubmit} className='flex-1 flex flex-col gap-2 w-full py-2 px-4'>
        <input
          type="text"
          className='p-1 outline-none border-b-2'
          placeholder='To'
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="text"
          className='p-1 outline-none border-b-2'
          placeholder='Subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className='p-1 flex-grow border-[2px] outline-none rounded'
          placeholder='Email body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        {/* <EmailComposer/> */}

        <input
          type="submit"
          value="Send"
          className='w-fit py-2 px-7 cursor-pointer capitalize bg-blue-600 hover:bg-blue-400 text-white font-[600] rounded-full text-[17px]'
        />
      </form>

      { error && <MessagePopup message={error} onClose={closeErrorMessage}/> }
      { successMessage && <MessagePopup message={successMessage} onClose={closeSuccessMessage}/> }
      { loading && <MessagePopup message={'loading...'} onClose={() => setLoading(false)}/> }
    </div>
  );
};

export default Emails;

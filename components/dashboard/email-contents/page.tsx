import React, { useEffect, useRef, useState } from 'react';
import MessagePopup from '../popups/MessagePopup';
import EmailComposer from './EmailComposer';
import axios from 'axios';
import { useAuth } from '@/src/context/AuthProvider';
import QuillEditor from './QuillEditor';


type User = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
  first_login_at: string;
  profession: string;
  patients: number;
  lastLogin: string;
};


const Emails: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState<string>('');
  const handleBodyChange = (content: string) => {
    setMessage(content); 
  };
  const [loading, setLoading] = useState(false);
  const [isEmailSelect, setIsEmailSelect] = useState(false);
  const [error, setError] = useState<string>('');
  const { loggedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const emailRef = useRef<HTMLDivElement>(null);


  const closeSuccessMessage = () => {
    setSuccessMessage('');
};

const closeErrorMessage = () => {
    setError('');
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //

    // Log the form data
    console.log({
      to: filteredEmails,
      subject,
      body: message,
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/send-custom-email`, 
        {
          emailArray: filteredEmails,
          subject,
          body: message
        }
      );

      const dial = response.status;
      if(dial === 200 || dial === 200) {
        setSuccessMessage("Email sent successfully");
      } else {
        setError("Error sending Emails");
      }
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setTimeout(() => {
        setError('');
        setSuccessMessage('')
        setTo('');
        setSubject('');
        setBody('');
      }, 5000);
    }

    // Optionally, you can clear the fields after submission
    // setTo('');
    // setSubject('');
    // setBody('');
  };

  const closeModal = () => setIsEmailSelect(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailRef.current && !emailRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const fetchedUsers: User[] = Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error: any) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [])

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      
      const updatedEmails = filteredEmails.filter((email) => {
        const user = users.find(u => u.id === userId);
        return user ? email !== user.email : true;
      });

      setFilteredEmails(updatedEmails);
    } else {
      setSelectedUsers([...selectedUsers, userId]);

       const user = users.find((u) => u.id === userId);
       if (user) {
         setFilteredEmails([...filteredEmails, user.email]);
       }
    }
  };



  return (
    <div className='flex flex-col w-full h-5/6 bg-white rounded-[12px] overflow-hidden'>
      <div className='bg-black text-white p-3 pl-4'>
        Compose Email
      </div>
      <form onSubmit={handleSubmit} className='relative flex-1 flex flex-col gap-2 w-full py-2 px-4'>
        <input
          type="text"
          className='p-1 outline-none border-b-2'
          placeholder='To'
          onMouseEnter={() => setIsEmailSelect(true)}
          value={filteredEmails.join(", ")}
          onChange={(e) => setTo(e.target.value)}
        />
        {isEmailSelect && <div className='email-select absolute z-10 bg-slate-200 w-full mt-9 rounded-lg max-h-[400px] left-0' ref={emailRef}>
          <ul className=''>
            {
              users.map((user) => (
                <li onClick={() => toggleSelectUser(user.id)} key={user.id}>
                  <input 
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                  />
                  <span>{user.email}</span>
                </li>
              ))
            }
             
          </ul>
        </div>}
        <input
          type="text"
          className='p-1 outline-none border-b-2'
          placeholder='Subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {/* <textarea
          className='p-1 flex-grow border-[2px] outline-none rounded'
          placeholder='Email body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea> */}

        <div className='p-1 flex-grow border-[2px] outline-none rounded overflow-hidden'>
          <QuillEditor value={message} onChange={handleBodyChange} />
        </div>

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

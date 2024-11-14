import React, { useState, useRef, useEffect } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash, FaEllipsisH } from 'react-icons/fa';
import EmailFormer from './EmailFormer';
import { SlPlus } from 'react-icons/sl';
import axios from 'axios';
import Emails from './page';

type EmailTemplate = {
  id: number;
  title: string;
  content: string;
};

// const emailTemps: EmailTemplate[] = [
//   { id: 1, title: 'Payment', content: 'What we are to do' },
//   { id: 2, title: 'Notification', content: 'This is a notification template' },
//   { id: 3, title: 'Reminder', content: 'This is a reminder template' },
//   { id: 4, title: 'Alert', content: 'This is an alert template' },
// ];

const EmailTemplates: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [composeEmail, setComposeEmail] = useState<boolean>(true);
  const [email, setEmail] = useState<EmailTemplate | null>(null);
  const [emailTemps, setEmailTemps] = useState<EmailTemplate[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCloseEdit = () => setOpenEdit(!openEdit);

  const toggleMenu = (templateId: number) => {
    const selectedEmail = emailTemps.find((temp) => temp.id === templateId) || null;
    setOpenEdit(!openEdit);
    setOpenMenuId(openMenuId === templateId ? null : templateId);
    setEmail(selectedEmail)
  };

  const toggleMenuId = (templateId: number) => {
    // const selectedEmail = emailTemps.find((temp) => temp.id === templateId) || null;
    // setOpenEdit(!openEdit);
    setOpenMenuId(openMenuId === templateId ? null : templateId);
    // setEmail(selectedEmail)
  };


  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/emails');
      setEmailTemps(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };


  return (
    <>
      {
        composeEmail && <Emails action={() => setComposeEmail(!composeEmail)}/>
      }
      {!composeEmail && (
        !openEdit ? (
          <div className={style.body}>
            <div className="act-grp flex gap-2">
              <button
                className="flex items-center gap-2 justify-center p-2 rounded-full bg-slate-500 text-white text-[14px] my-4"
              >
                <SlPlus /> Add Email Template
              </button>
              <button
              onClick={() => setComposeEmail(!composeEmail)}
                className="flex items-center gap-2 justify-center p-2 rounded-full bg-slate-500 text-white text-[14px] my-4"
              >
                <FaEdit /> Compose Email
              </button>
            </div>
            <div className={style.tableContainer}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {emailTemps.map((template) => (
                    <tr key={template.id}>
                      <td>{template.id}</td>
                      <td style={{ textTransform: 'capitalize' }}>{template.title}</td>
                      <td style={{ maxWidth: '150px', overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{template.content}</td>
                      <td className={style.actionsColumn}>
                        <button
                          onClick={() => toggleMenuId(template.id)}
                          className={style.menuButton}
                        >
                          <FaEllipsisH />
                        </button>
                        {openMenuId === template.id && (
                          <div ref={menuRef} className={style.menu}>
                            <button
                              onClick={() => toggleMenu(template.id)}
                              className={style.dropdownMenuItem}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button className={style.dropdownMenuItem}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmailFormer
            sbj={email?.title || ''}
            bdy={email?.content || ''}
            id={email?.id || ''}
            action={handleCloseEdit}
          />
        )
      )}

    </>
  );
};

export default EmailTemplates;

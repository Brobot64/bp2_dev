import React, { useState, useRef, useEffect } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash, FaEllipsisH } from 'react-icons/fa';
import { SlPlus } from 'react-icons/sl';
import axios from 'axios';
import EmailFormer from './EmailFormer';
import Emails from './page';

type EmailTemplate = {
  id: number;
  name: string; // Changed from title to align with Laravel table column
  subject: string;
  body: string;
};

const EmailTemplates: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [composeEmail, setComposeEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<EmailTemplate | null>(null);
  const [emailTemps, setEmailTemps] = useState<EmailTemplate[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);
  const handleCloseEdit = () => setOpenEdit(!openEdit);

  // Fetch all email templates
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email-templates`);
      setEmailTemps(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Create a new email template
  const addTemplate = async (newTemplate: Partial<EmailTemplate>) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email-templates`, newTemplate);
      setEmailTemps([...emailTemps, response.data.data]);
    } catch (error) {
      console.error('Error adding template:', error);
    }
  };

  // Update an email template
  const updateTemplate = async (updatedTemplate: Partial<EmailTemplate>) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email-templates/${updatedTemplate.id}`, updatedTemplate);
      setEmailTemps((prev) =>
        prev.map((temp) => (temp.id === updatedTemplate.id ? { ...temp, ...updatedTemplate } : temp))
      );
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  // Delete an email template
  const deleteTemplate = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email-templates/${id}`);
      setEmailTemps(emailTemps.filter((template) => template.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const toggleMenu = (templateId: number) => {
    const selectedEmail = emailTemps.find((temp) => temp.id === templateId) || null;
    setOpenEdit(!openEdit);
    setOpenMenuId(openMenuId === templateId ? null : templateId);
    setEmail(selectedEmail);
  };

  const toggleMenuId = (templateId: number) => {
    setOpenMenuId(openMenuId === templateId ? null : templateId);
  };

  return (
    <>
      {composeEmail && <Emails action={() => setComposeEmail(!composeEmail)} />}
      {!composeEmail && (
        !openEdit ? (
          <div className={style.body}>
            <div className="act-grp flex gap-2">
              <button
                onClick={() => addTemplate({ name: 'New Template', subject: 'New Subject', body: 'New Body' })}
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
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Body</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {emailTemps.map((template) => (
                    <tr key={template.id}>
                      <td>{template.id}</td>
                      <td>{template.name}</td>
                      <td>{template.subject}</td>
                      <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {template.body}
                      </td>
                      <td className={style.actionsColumn}>
                        <button onClick={() => toggleMenuId(template.id)} className={style.menuButton}>
                          <FaEllipsisH />
                        </button>
                        {openMenuId === template.id && (
                          <div ref={menuRef} className={style.menu}>
                            <button onClick={() => toggleMenu(template.id)} className={style.dropdownMenuItem}>
                              <FaEdit /> Edit
                            </button>
                            <button onClick={() => deleteTemplate(template.id)} className={style.dropdownMenuItem}>
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
            sbj={email?.subject || ''}
            bdy={email?.body || ''}
            id={email?.id || ''}
            action={handleCloseEdit}
            // action={(updatedTemplate: Partial<EmailTemplate>) => updateTemplate(updatedTemplate)}
          />
        )
      )}
    </>
  );
};

export default EmailTemplates;

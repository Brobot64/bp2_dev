import React, { useState, useRef } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash, FaEllipsisH } from 'react-icons/fa';
import EmailFormer from './EmailFormer';

type EmailTemplate = {
  id: number;
  title: string;
  content: string;
};

const emailTemps: EmailTemplate[] = [
  { id: 1, title: 'Payment', content: 'What we are to do' },
  { id: 2, title: 'Notification', content: 'This is a notification template' },
  { id: 3, title: 'Reminder', content: 'This is a reminder template' },
  { id: 4, title: 'Alert', content: 'This is an alert template' },
];

const EmailTemplates: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (templateId: number) => {
    setOpenEdit(!openEdit);
    setOpenMenuId(openMenuId === templateId ? null : templateId);
  };

  return (
    <>
      {!openEdit ? (
        <div className={style.body}>
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
                    <td>{template.title}</td>
                    <td>{template.content}</td>
                    <td className={style.actionsColumn}>
                      <button
                        onClick={() => toggleMenu(template.id)}
                        className={style.menuButton}
                      >
                        <FaEllipsisH />
                      </button>
                      {openMenuId === template.id && (
                        <div ref={menuRef} className={style.menu}>
                          <button className={style.dropdownMenuItem}>
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
        <EmailFormer />
      )}
    </>
  );
};

export default EmailTemplates;

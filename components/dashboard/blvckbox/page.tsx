'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import style from '../../all.module.css';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import MessagePopup from '../popups/MessagePopup';
import { useRouter } from "next/navigation";
import { FaEllipsisH } from 'react-icons/fa';

type Blvckbox = {
    id: number;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    date: string;
    background: string;
};

const Blvckbox: React.FC = () => {
    const [blvckboxes, setBlvckboxes] = useState<Blvckbox[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          setError('');
          const token = localStorage.getItem('token');
    
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes`, {
              headers: {
                Authorization: `${token}`,
              },
            });
            setBlvckboxes(response.data);
          } catch (error: any) {
            setError('Failed to fetch Blvckbox data.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);


      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpenMenuId(null);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const handleDelete = async (id: number) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        
        const token = localStorage.getItem('token');
      
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          setBlvckboxes((prevBlvckboxes) => prevBlvckboxes.filter((box) => box.id !== id));
          setSuccessMessage('Blvckbox deleted successfully!');
        } catch (error: any) {
          setError('Failed to delete Blvckbox.');
        } finally {
          setLoading(false);
        }
      };
      

    const filteredBlvckboxes = blvckboxes.filter((box) =>
        box.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const closeSuccessMessage = () => {
        setSuccessMessage('');
    };

    const closeErrorMessage = () => {
        setError('');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleEdit = (box: Blvckbox) => {
      router.push(`/dashboard/blvckbox/${box.slug}`);
    };

    const toggleMenu = (userId: number) => {
      setOpenMenuId(openMenuId === userId ? null : userId);
    };

    const handleAddEditorial = (box: Blvckbox) => {
      router.push(`/dashboard/blvckbox/${box.slug}/editorial`);
  };

  const handleAddConclusion = (box: Blvckbox) => {
    router.push(`/dashboard/blvckbox/${box.slug}/conclusion`);
};

    return (
        <div className={style.cardContainer}>
            <div className={`${style.card} ${style.w100}`}>
                <div className={style.header}>
                    <div>
                        <span>Manage Blvckboxes</span>
                    </div>
                    <div className={style.options}>
                        <input
                            type="text"
                            placeholder="Search"
                            className={style.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={style.body}>
                    <div className={style.tableContainer}>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Background</th>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Subtitle</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlvckboxes.map((box) => (
                                    <tr key={box.id}>
                                        <td className={style.image}>
                                          {box.background ? (
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${box.background}`}
                                              alt={box.title}
                                              width={30}
                                              height={30}
                                            />
                                          ) : (
                                            <span>No Image</span> 
                                          )}
                                        </td>                                        
                                        <td>{box.title}</td>
                                        <td>{box.slug}</td>
                                        <td>{box.subtitle ? `${box.subtitle.substring(0, 60)}${box.subtitle.length > 60 ? '...' : ''}` : 'No Subtitle'}</td>
                                        <td>{new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }).format(new Date(box.date))}</td>
                                       


                                        <td className={style.actionsColumn}>
                                        <button className={style.menuButton} onClick={() => toggleMenu(box.id)}>
                                            <FaEllipsisH />
                                        </button>

                                        {openMenuId === box.id && (
            <div ref={menuRef} className={style.menu}>
                                        <button
                                                onClick={() => handleEdit(box)}
                                                className={`${style.editButton}`}
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(box.id)}
                                                className={`${style.delButton}`}
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                            <button
                                                        onClick={() => handleAddEditorial(box)}
                                                        className={`${style.addEditorialButton}`}
                                                    >
                                                        <FaPlus /> Editorial
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddConclusion(box)}
                                                        className={`${style.addEditorialButton}`}
                                                    >
                                                        <FaPlus /> Conclusion
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
            </div>
            {successMessage && (
                <MessagePopup message={successMessage} onClose={closeSuccessMessage} />
            )}
            {error && (
                <MessagePopup message={error} onClose={closeErrorMessage} />
            )}
        </div>
    );
};

export default Blvckbox;

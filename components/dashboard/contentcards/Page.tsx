import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import MessagePopup from '../popups/MessagePopup';
import { FaEllipsisH } from 'react-icons/fa';
import { useRouter } from "next/navigation";

type BlvckcardType = {
    id: number;
    title: string;
    slug: string;
    description: string;
    date: string;
    images: ImageType[];
    blvckbox_id: number;
};

interface ImageType {
    id: number;
    image_path: string;
}

const Contentcard: React.FC = () => {
    const [contentCards, setContentCards] = useState<BlvckcardType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setContentCards(response.data);
            } catch (error: any) {
                setError('Failed to fetch ContentCard data.');
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
      

      const handleEdit = (card: BlvckcardType) => {
        router.push(`/dashboard/contentcards/${card.slug}`);
      };

      
    const handleDelete = async (id: number) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setContentCards((prevContentCards) => prevContentCards.filter((card) => card.id !== id));
            setSuccessMessage('ContentCard deleted successfully!');
        } catch (error: any) {
            setError('Failed to delete ContentCard.');
        } finally {
            setLoading(false);
        }
    };

    const filteredContentCards = contentCards.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const closeSuccessMessage = () => {
        setSuccessMessage('');
    };

    const closeErrorMessage = () => {
        setError('');
    };

    const toggleMenu = (userId: number) => {
        setOpenMenuId(openMenuId === userId ? null : userId);
      };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={style.cardContainer}>
            <div className={`${style.card} ${style.w100}`}>
                <div className={style.header}>
                    <div>
                        <span>Manage Contentcard</span>
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
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContentCards.map((card) => (
                                    <tr key={card.id}>
                                        <td>{card.title}</td>
                                        <td>{card.slug}</td>
                                        <td>{card.description ? `${card.description.substring(0, 60)}${card.description.length > 60 ? '...' : ''}` : 'No Description'}</td>
                                        <td className={style.actionsColumn}>
                                        <button className={style.menuButton} onClick={() => toggleMenu(card.id)}>
                                            <FaEllipsisH />
                                        </button>

                                        {openMenuId === card.id && (
            <div ref={menuRef} className={style.menu}>

<button
                                                onClick={() => handleEdit(card)}
                                                className={`${style.editButton}`}
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(card.id)}
                                                className={`${style.delButton}`}
                                            >
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

export default Contentcard;
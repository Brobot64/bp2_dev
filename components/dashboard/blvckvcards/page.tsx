import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import style from '../../all.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import MessagePopup from '../popups/MessagePopup';
import { useRouter } from "next/navigation";
import { FaEllipsisH } from 'react-icons/fa';

type BlvckboxType = {
    id: number;
    title: string;
};

type ContentCardType = {
    id: number;
    title: string;
};

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

const Blvckcard: React.FC = () => {
    const [blvckcards, setBlvckcards] = useState<BlvckcardType[]>([]);
    const [blvckboxes, setBlvckboxes] = useState<BlvckboxType[]>([]);
    const [contentCards, setContentCards] = useState<ContentCardType[]>([]);
    const [selectedBlvckbox, setSelectedBlvckbox] = useState<string>('');
    const [selectedContentCard, setSelectedContentCard] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBlvckboxes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setBlvckboxes(response.data);
            } catch (error: any) {
                setError('Failed to fetch Blvckbox data.');
            }
        };

        const fetchBlvckcards = async () => {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckcards`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setBlvckcards(response.data);
            } catch (error: any) {
                setError('Failed to fetch Blvckcard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlvckboxes();
        fetchBlvckcards();
    }, []);

    useEffect(() => {
        const fetchContentCards = async () => {
            if (!selectedBlvckbox) return;

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards?blvckbox_id=${selectedBlvckbox}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setContentCards(response.data);
            } catch (error: any) {
                setError('Failed to fetch Content Card data.');
            }
        };

        fetchContentCards();
    }, [selectedBlvckbox]);

    const handleEdit = (card: BlvckcardType) => {
        router.push(`/dashboard/blvckcards/${card.slug}`);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckcards/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setBlvckcards((prevBlvckcards) => prevBlvckcards.filter((card) => card.id !== id));
            setSuccessMessage('Blvckcard deleted successfully!');
        } catch (error: any) {
            setError('Failed to delete Blvckcard.');
        } finally {
            setLoading(false);
        }
    };

    
    const filteredBlvckcards = blvckcards.filter((card) => {
        const matchesSearchTerm = card.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBlvckbox = !selectedBlvckbox || card.blvckbox_id.toString() === selectedBlvckbox;
        const matchesContentCard = !selectedContentCard || card.blvckbox_id.toString() === selectedContentCard; // Adjust this condition as needed
        return matchesSearchTerm && matchesBlvckbox && matchesContentCard;
    });

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
                        <span>Manage Blvckcards</span>
                    </div>
                    <div className={style.options}>
                        <input
                            type="text"
                            placeholder="Search"
                            className={style.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* <select
                            value={selectedBlvckbox}
                            onChange={(e) => setSelectedBlvckbox(e.target.value)}
                        >
                            <option value="">Select Blvckbox</option>
                            {blvckboxes.map((box) => (
                                <option key={box.id} value={box.id}>{box.title}</option>
                            ))}
                        </select>
                        <select
                            value={selectedContentCard}
                            onChange={(e) => setSelectedContentCard(e.target.value)}
                        >
                            <option value="">Select Content Card</option>
                            {contentCards.map((card) => (
                                <option key={card.id} value={card.id}>{card.title}</option>
                            ))}
                        </select> */}
                    </div>
                </div>

                <div className={style.body}>
                    {filteredBlvckcards.length === 0 ? (
                        <p style={{fontSize: '14px'}}>No data available</p>
                    ) : (
                        <div className={style.tableContainer}>
                            <table className={style.table}>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Slug</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlvckcards.map((card) => (
                                        <tr key={card.id}>
                                            <td className={style.image}>
                                                {Array.isArray(card.images) && card.images.length > 0 ? (
                                                    card.images.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${image?.image_path}`}
                                                            alt={card.title}
                                                            width={30}
                                                            height={30}
                                                            style={{ marginRight: '5px' }}
                                                        />
                                                    ))
                                                ) : (
                                                    <span>No images available</span>
                                                )}
                                            </td>
                                            <td>{card.title.length > 20 ? `${card.title.slice(0, 20)}...` : card.title}</td>
                                            <td>{card.slug.length > 30 ? `${card.slug.slice(0, 30)}...` : card.slug}</td>
                                            <td>{card.description.length > 60 ? `${card.description.slice(0, 60)}...` : card.description}</td>
                                            <td>
                                                {new Date(card.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>                                            <td className={style.actionsColumn}>
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
                    )}
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

export default Blvckcard;

'use client';

import axios from 'axios';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import style from '../../../all.module.css';
import MessagePopup from '../../popups/MessagePopup';
import { FaTrash, FaUpload } from 'react-icons/fa';
import slugify from 'slugify';
import { useDropzone } from 'react-dropzone';

type Blvckbox = {
    id: number;
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    background: string;
};

const ContentcardForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [selectedBlvckbox, setSelectedBlvckbox] = useState<string>('');
    const [blvckboxes, setBlvckboxes] = useState<Blvckbox[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchBlvckboxes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Authorization token is missing.');
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );

                setBlvckboxes(response.data);
            } catch (error) {
                console.error('Failed to fetch blvckboxes:', error);
            }
        };

        fetchBlvckboxes();
    }, []);

    const handleTitleChange = (value: string) => {
        setTitle(value);
        const generatedSlug = slugify(value, { lower: true });
        setSlug(generatedSlug);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('blvckbox_id', selectedBlvckbox);

            if (image) {
                formData.append('image', image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                }
            );

            console.log('ContentCard created:', response.data);
            setSuccessMessage('ContentCard created successfully!');
            setTitle('');
            setSlug('');
            setDescription('');
            setSelectedBlvckbox('');
            setImage(null);
            setImagePreview(null);
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Server error:', error.response.data);
                    setError(error.response.data.message || 'An error occurred.');
                } else if (error.request) {
                    console.error('No response from server:', error.request);
                    setError('Failed to communicate with the server.');
                } else {
                    console.error('Request error:', error.message);
                    setError('An unexpected error occurred.');
                }
            } else {
                console.error('Unknown error:', error);
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [] 
        },
        multiple: false
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleImageDelete = () => {
        setImage(null);
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleBlvckboxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBlvckbox(e.target.value);
    };

    const closeSuccessMessage = () => {
        setSuccessMessage('');
    };

    const closeErrorMessage = () => {
        setError('');
    };

    return (
        <div className={style.cardContainer}>
            <div className={` ${style.card} ${style.w25}`}>
                <div className={style.header}>
                    Create ContentCard
                </div>
                <div className={style.body}>
                    <form onSubmit={handleSubmit} className={style.formWrap}>
                        <div className={style.formGroup}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                placeholder='Enter Title'
                                onChange={(e) => handleTitleChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="slug">Slug</label>
                            <input
                                type="text"
                                id="slug"
                                value={slug}
                                placeholder='Enter Slug'
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                placeholder='Enter Description'
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="blvckbox">Blvckbox</label>
                            <select
                                id="blvckbox"
                                value={selectedBlvckbox}
                                onChange={handleBlvckboxChange}
                                required
                            >
                                <option value="">Select Blvckbox</option>
                                {blvckboxes.map((blvckbox) => (
                                    <option key={blvckbox.id} value={blvckbox.id}>{blvckbox.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="image">Image</label>
                            <div {...getRootProps({ className: style.uploadContainer })}>
                                <input
                                    {...getInputProps()}
                                    ref={imageInputRef}
                                    className={style.customUploadButton}
                                />
                                <label htmlFor="image" className={style.customUploadLabel}>
                                    <FaUpload /> Drag & Drop or Click to Upload Image
                                </label>
                            </div>
                            <div className={style.previewContainer}>
                            {imagePreview && (
                                                                    <div className={style.imagePreview}>
                                    <img src={imagePreview} alt="Image Preview" />
                                    <button type="button" onClick={handleImageDelete} className={style.deleteButton}>
                                        <FaTrash />
                                    </button>
                                    </div>
                            )}
                                </div>
                        </div>
                        <div className={`${style.centerContent} ${style.formGroup}`}>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : '[ Create ]'}
                            </button>
                        </div>
                    </form>
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

export default ContentcardForm;

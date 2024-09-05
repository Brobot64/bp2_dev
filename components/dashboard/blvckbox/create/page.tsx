'use client';

import axios from 'axios';
import React, { useRef, useState, useCallback } from 'react';
import style from '../../../all.module.css';
import MessagePopup from '../../popups/MessagePopup';
import { FaTrash, FaUpload } from 'react-icons/fa';
import slugify from 'slugify'; 
import { useDropzone, Accept } from 'react-dropzone';

const BlvckboxForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [background, setBackground] = useState<File | null>(null);
    const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const backgroundInputRef = useRef<HTMLInputElement | null>(null);

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
            formData.append('subtitle', subtitle);
            formData.append('description', description);
            formData.append('date', date);
            if (background) {
                formData.append('background', background);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${token}`,
                    },
                }
            );

            console.log('Blvckbox created:', response.data);
            setSuccessMessage('Blvckbox created successfully!');
            setTitle('');
            setSlug('');
            setSubtitle('');
            setDescription('');
            setDate('');
            setBackground(null);
            setBackgroundPreview(null);
            if (backgroundInputRef.current) {
                backgroundInputRef.current.value = '';
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
        setBackground(file);
        setBackgroundPreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setBackground(file);
        if (file) {
            setBackgroundPreview(URL.createObjectURL(file));
        } else {
            setBackgroundPreview(null);
        }
    };

    const handleBackgroundDelete = () => {
        setBackground(null);
        setBackgroundPreview(null);
        if (backgroundInputRef.current) {
            backgroundInputRef.current.value = '';
        }
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
                    Create Blvckbox
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
                                onChange={(e) => handleTitleChange(e.target.value)} // Use handleTitleChange for title input
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
                            <label htmlFor="subtitle">Subtitle</label>
                            <input
                                type="text"
                                id="subtitle"
                                value={subtitle}
                                placeholder='Enter Subtitle'
                                onChange={(e) => setSubtitle(e.target.value)}
                                required
                            />
                        </div>
                        {/* <div className={style.formGroup}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                placeholder='Enter Description'
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div> */}
                        <div className={style.formGroup}>
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="background">Background</label>
                            <div {...getRootProps({ className: style.uploadContainer })}>
                                <input {...getInputProps()} className={style.customUploadButton} />
                                <label htmlFor="background" className={style.customUploadLabel}>
                                    <FaUpload /> Drag & Drop or Click to Upload Background
                                </label>
                            </div>
                            <div className={style.previewContainer}>

                            {backgroundPreview && (
                                <div className={style.imagePreview}>
                                    <img src={backgroundPreview} alt="Background Preview" />
                                    <button type="button" onClick={handleBackgroundDelete} className={style.deleteButton}>
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

export default BlvckboxForm;

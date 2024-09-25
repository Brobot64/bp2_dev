import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { FaUpload, FaTrash } from 'react-icons/fa';
import style from '../../../../all.module.css';
import QuillEditor from '@components/dashboard/email-contents/QuillEditor';

type EditEditorialProps = {
    slug: string;
};

const EditorialPage: React.FC<EditEditorialProps> = ({ slug }) => {
    const [section, setSection] = useState<string>('');
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchEditorialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckbox/${slug}/editorial`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                const data = response.data;
    console.log(data)
                setSection(data.section);
                if (data.background_image) {
                    setBackgroundPreview(`${process.env.NEXT_PUBLIC_BASE_URL}/storage/${data.background_image}`);
                }
            } catch (error) {
                console.error('Error fetching editorial data:', error);
            }
        };
    
        fetchEditorialData();
    }, [slug]);
    

    const handleSectionChange = (value: string) => {
        setSection(value);
    };

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setBackgroundImage(file);
        setBackgroundPreview(URL.createObjectURL(file));
    };

    const handleBackgroundDelete = () => {
        setBackgroundImage(null);
        setBackgroundPreview(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('section', section);

        if (backgroundImage) {
            formData.append('background_image', backgroundImage);
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckbox/${slug}/editorial`,
                formData,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            router.push('/dashboard/blvckbox');
        } catch (error) {
            console.error('Error saving editorial section:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBodyChange = (content: string) => {
        setSection(content); 
      };

    return (
        <div className={style.cardContainer}>
            <div className={`${style.card} ${style.w25}`}>
                <div className={style.header}>Add Editorial Section</div>
                <div className={style.body}>
                    <form onSubmit={handleSubmit} className={style.formWrap}>
                        <div className={style.formGroup}>
                            <label htmlFor="section">Subtitle</label>
                            {/* <textarea
                                id="section"
                                placeholder='Enter Subtitle'
                                value={section}
                                onChange={(e) => handleSectionChange(e.target.value)}
                                rows={10}
                            /> */}
                            <QuillEditor value={section} onChange={handleBodyChange}/>
                        </div>

                        <div className={style.formGroup}>
                            <label htmlFor="background">Background</label>
                            <Dropzone onDrop={onDrop} accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }} multiple={false}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps({ className: style.uploadContainer })}>
                                        <input {...getInputProps()} className={style.customUploadButton} />
                                        <label htmlFor="background" className={style.customUploadLabel}>
                                            <FaUpload /> Drag & Drop or Click to Upload Background
                                        </label>
                                    </div>
                                )}
                            </Dropzone>
                            <div className={style.previewContainer}>
                                {backgroundPreview && (
                                    <div className={style.imagePreview}>
                                        <img src={backgroundPreview} alt="Background Preview" />
                                        <button
                                            type="button"
                                            onClick={handleBackgroundDelete}
                                            className={style.deleteButton}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${style.centerContent} ${style.formGroup}`}>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : '[ Save ]'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditorialPage;

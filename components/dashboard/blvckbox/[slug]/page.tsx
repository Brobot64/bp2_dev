import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import style from '../../../all.module.css';
import MessagePopup from '../../popups/MessagePopup';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

type EditBlvckboxFormProps = {
  slug: string;
};

const EditBlvckboxForm: React.FC<EditBlvckboxFormProps> = ({ slug }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slugState, setSlugState] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    accept: {
        'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setBackgroundPreview(URL.createObjectURL(file));
    }
  });

  useEffect(() => {
    const fetchBlvckbox = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token is missing.');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes/${slug}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        const blvckbox = response.data;
        setTitle(blvckbox.title);
        setSlugState(blvckbox.slug);
        setSubtitle(blvckbox.subtitle);
        setDescription(blvckbox.description);
        setDate(blvckbox.date);
        setBackgroundPreview(`${process.env.NEXT_PUBLIC_BASE_URL}${blvckbox.background}`);
      } catch (error) {
        console.error('Failed to fetch Blvckbox:', error);
        setError('Failed to fetch Blvckbox.');
      }
    };

    fetchBlvckbox();
  }, [slug]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    setSlugState(slugify(value, { lower: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slugState);
      formData.append('subtitle', subtitle);
      formData.append('description', description);
      formData.append('date', date);
      if (acceptedFiles.length > 0) {
        formData.append('background', acceptedFiles[0]);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes/${slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        }
      );

      setSuccessMessage('Blvckbox updated successfully!');
      router.push('/dashboard/blvckbox');
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred.');
      } else if (error.request) {
        setError('Failed to communicate with the server.');
      } else {
        setError('An unexpected error occurred.');
      }
    } else {
      setError('An unexpected error occurred.');
    }
  };

  const closeSuccessMessage = () => setSuccessMessage('');
  const closeErrorMessage = () => setError('');

  return (
    <div className={style.cardContainer}>
      <div className={`${style.card} ${style.w25}`}>
        <div className={style.header}><span onClick={() => router.back()} style={{ transform: 'scaleX(1)', cursor: 'pointer' }}>←  Edit Blvckbox</span></div>
        <div className={style.body}>
          <form onSubmit={handleSubmit} className={style.formWrap}>
            <div className={style.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                placeholder="Enter Title"
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={slugState}
                placeholder="Enter Slug"
                onChange={(e) => setSlugState(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="subtitle">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                value={subtitle}
                placeholder="Enter Subtitle"
                onChange={(e) => setSubtitle(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                placeholder="Enter Description"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                placeholder="Enter Date"
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="background">Background</label>
              <div {...getRootProps({ className: style.uploadContainer })} >
              <input {...getInputProps()} className={style.customUploadButton} />
              <label htmlFor="background" className={style.customUploadLabel}>
                                    <FaUpload /> Drag & Drop or Click to Upload Background
                                </label>
              </div>
              <div className={style.previewContainer}>
                {backgroundPreview && (
                  <div className={style.imagePreview}>
                    <img src={backgroundPreview} alt="Background Preview" />
                    <button type="button" onClick={() => setBackgroundPreview(null)}>
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${style.centerContent} ${style.formGroup}`}>
              <button type="submit" className={style.btnPrimary} disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
            {error && <MessagePopup message={error} onClose={closeErrorMessage} />}
            {successMessage && <MessagePopup message={successMessage} onClose={closeSuccessMessage} />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlvckboxForm;

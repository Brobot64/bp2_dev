import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import style from '../../../all.module.css';
import MessagePopup from '../../popups/MessagePopup';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

type Blvckbox = {
  id: number;
  title: string;
};

type EditContentcardFormProps = {
  slug: string;
};

const EditContentcardForm: React.FC<EditContentcardFormProps> = ({ slug }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slugState, setSlugState] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedBlvckbox, setSelectedBlvckbox] = useState<string>('');
  const [blvckboxes, setBlvckboxes] = useState<Blvckbox[]>([]);
  
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: {
        'image/*': []
    },
    onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setBackgroundPreview(URL.createObjectURL(file));
      }
  });

  useEffect(() => {
    const fetchBlvckboxes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token is missing.');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckboxes`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setBlvckboxes(response.data);
      } catch (error) {
        console.error('Failed to fetch Blvckboxes:', error);
        setError('Failed to fetch Blvckboxes.');
      }
    };

    fetchBlvckboxes();
  }, []);

  
  useEffect(() => {
    if (!slug) return;

    const fetchContentcard = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Authorization token is missing.');
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards/${slug}`,
            {
              headers: { Authorization: `${token}` },
            }
          );
          const contentcard = response.data;
          setTitle(contentcard.title);
          setSlugState(contentcard.slug);
          setDescription(contentcard.description);
          setSelectedBlvckbox(contentcard.blvckbox_id);
          setBackgroundPreview(`${process.env.NEXT_PUBLIC_BASE_URL}${contentcard.background}`);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Failed to fetch Contentcard:', error.response?.data || error.message);
          } else {
            console.error('An unexpected error occurred:', error);
          }
          setError('Failed to fetch Contentcard.');
        }
      };
      

    fetchContentcard();
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
      formData.append('description', description);
      formData.append('blvckbox_id', selectedBlvckbox);

      if (acceptedFiles.length > 0) {
        formData.append('background', acceptedFiles[0]);
      }
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards/${slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${token}`,
          },
        }
      );

      setSuccessMessage('Contentcard updated successfully!');
      resetForm();

      router.push('/dashboard/contentcards');
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlugState('');
    setDescription('');
    setImages([]);
    setSelectedBlvckbox('');
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
        <div className={style.header}><span onClick={() => router.back()} style={{ transform: 'scaleX(1)', cursor: 'pointer' }}>←  Edit Contentcard</span></div>
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
                value={slugState}
                placeholder='Enter Slug'
                onChange={(e) => setSlugState(e.target.value)}
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
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="blvckbox">Blvckbox</label>
              <select
                id="blvckbox"
                value={selectedBlvckbox}
                onChange={(e) => setSelectedBlvckbox(e.target.value)}
                required
              >
                <option value="">Select Blvckbox</option>
                {blvckboxes.map(blvckbox => (
                  <option key={blvckbox.id} value={blvckbox.id}>{blvckbox.title}</option>
                ))}
              </select>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="images">Images</label>
              <div {...getRootProps({ className: style.uploadContainer })}>
                <input {...getInputProps()} className={style.customUploadButton} />
                <label htmlFor="images" className={style.customUploadLabel}>
                  <FaUpload /> Drag & Drop or Click to Upload Images
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
                {loading ? 'Updating...' : '[Update]'}
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

export default EditContentcardForm;

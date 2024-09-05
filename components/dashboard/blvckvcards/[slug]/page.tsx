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
  slug: string;
  subtitle: string;
  teaserdescription: string;
  description: string;
  date: string;
  background: string;
};

type ContentCard = {
  id: number;
  title: string;
};

type EditBlvckcardFormProps = {
  slug: string;
};

const EditBlvckcardForm: React.FC<EditBlvckcardFormProps> = ({ slug }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slugState, setSlugState] = useState('');
  const [description, setDescription] = useState('');
  const [metakeywords, setMetaKeywords] = useState('');
  const [teaserdescription, setTeaserCardDescription] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [selectedBlvckbox, setSelectedBlvckbox] = useState<string>('');
  const [selectedContentCard, setSelectedContentCard] = useState<string>('');
  const [blvckboxes, setBlvckboxes] = useState<Blvckbox[]>([]);
  const [contentCards, setContentCards] = useState<ContentCard[]>([]);
  const [filteredContentCards, setFilteredContentCards] = useState<ContentCard[]>([]);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setImages(prevImages => [...prevImages, ...acceptedFiles]);
      setImagePreviews(prevPreviews => [
        ...prevPreviews,
        ...acceptedFiles.map(file => URL.createObjectURL(file))
      ]);
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
    const fetchContentCards = async () => {
      if (!selectedBlvckbox) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token is missing.');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/contentcards?blvckbox_id=${selectedBlvckbox}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setFilteredContentCards(response.data);
      } catch (error) {
        console.error('Failed to fetch Content Cards:', error);
        setError('Failed to fetch Content Cards.');
      }
    };

    fetchContentCards();
  }, [selectedBlvckbox]);

  useEffect(() => {
    if (!slug) return;

    const fetchBlvckcard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token is missing.');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckcards/${slug}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        const blvckcard = response.data;
        setTitle(blvckcard.title);
        setSlugState(blvckcard.slug);
        setDescription(blvckcard.description);
        setTeaserCardDescription(blvckcard.teaser_description);
        setMetaKeywords(blvckcard.meta_keywords);
        setDate(blvckcard.date);
        setSelectedBlvckbox(blvckcard.blvckbox_id);
        setSelectedContentCard(blvckcard.contentcard_id);
        setImageIds(blvckcard.images.map((image: any) => image.id));
        setImagePreviews(blvckcard.images.map((image: any) => `${process.env.NEXT_PUBLIC_BASE_URL}${image.image_path}`));
      } catch (error) {
        console.error('Failed to fetch Blvckcard:', error);
        setError('Failed to fetch Blvckcard.');
      }
    };

    fetchBlvckcard();
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
    formData.append('teaserdescription', teaserdescription);
    formData.append('metakeywords', metakeywords);
    formData.append('date', date);
    formData.append('blvckbox_id', selectedBlvckbox);
    formData.append('contentcard_id', selectedContentCard);

    images.forEach((image, index) => formData.append(`images[${index}]`, image));

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckcards/${slug}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      }
    );

    setSuccessMessage('Blvckcard updated successfully!');
    resetForm();

    router.push('/dashboard/blvckcards');
  } catch (error: any) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};

const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  setImages(prevImages => [...prevImages, ...files]);
  
  setImagePreviews(prevPreviews => [
    ...prevPreviews,
    ...files.map(file => URL.createObjectURL(file))
  ]);
};


  const handleImageDelete = async (index: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token is missing.');

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/blvckcards/images/${imageIds[index]}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      setImages(images.filter((_, i) => i !== index));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
      setImageIds(imageIds.filter((_, i) => i !== index)); 
    } catch (error) {
      handleError(error);
    }
  };
  const resetForm = () => {
    setTitle('');
    setSlugState('');
    setDescription('');
    setTeaserCardDescription('');
    setMetaKeywords('');
    setDate('');
    setImages([]);
    setImagePreviews([]);
    setSelectedBlvckbox('');
    setSelectedContentCard('');
    setFilteredContentCards([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Handle API errors
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

  // Close success message
  const closeSuccessMessage = () => setSuccessMessage('');

  // Close error message
  const closeErrorMessage = () => setError('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === 'Enter' || key === ' ' || key === ',') {
        e.preventDefault();
        updateKeywords();
    }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaKeywords(e.target.value);
};

const updateKeywords = () => {
    const allowedChars = /^[a-zA-Z0-9\s,]+$/; 

    const sanitizedKeywords = metakeywords.split('')
        .filter(char => allowedChars.test(char))
        .join('');

    const trimmedKeywords = sanitizedKeywords.trim(); 
    let keywordsArray = trimmedKeywords.split(/[\s,]+/).filter(Boolean); 

    if (!trimmedKeywords.endsWith(',')) {
        keywordsArray.push('');
    }

    const formattedKeywords = keywordsArray.join(', ').replace(/,\s*$/, ','); 
    setMetaKeywords(formattedKeywords);
};

  return (
    <div className={style.cardContainer}>
      <div className={` ${style.card} ${style.w25}`}>
        <div className={style.header}><span onClick={() => router.back()} style={{ transform: 'scaleX(1)', cursor: 'pointer' }}>←  Edit Blvckcard</span></div>
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
              <small className={style.helpText}>Please enter a descriptive title for your Blvckcard (maximum 100 characters).</small>
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
              <small className={style.helpText}>Slug should be unique and is used to create a URL-friendly version of the title (maximum 100 characters).</small>
            </div>
            <div className={style.formGroup}>
    <label htmlFor="metakeywords">Meta Keywords</label>
    <input
        id="metakeywords"
        type="text"
        value={metakeywords}
        placeholder="Enter Meta Keywords (comma-separated)"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        required
    />
    <small className={style.helpText}>Enter keywords that describe your content, separated by commas.</small>
</div>
            <div className={style.formGroup}>
    <label htmlFor="teaserdescription">Teaser Card Description (Meta Description)</label>
    <textarea
        id="teaserdescription"
        value={teaserdescription}
        placeholder="Enter Teaser Card Description"
        rows={5}
        style={{ resize: 'none' }}
        onChange={(e) => setTeaserCardDescription(e.target.value)}
        required
    ></textarea>
<small className={style.helpText}>
  This will be the meta description used for SEO purposes. Maximum length allowed is 1000 characters.
</small>
</div>
            <div className={style.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                placeholder='Enter Description'
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={12}
              />
              <small className={style.helpText}>Provide a detailed description of your Blvckcard (maximum 1000 characters).</small>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                placeholder='Enter Date'
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <small className={style.helpText}>Select the date associated with your Blvckcard.</small>
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
                {blvckboxes.map((blvckbox) => (
                  <option key={blvckbox.id} value={blvckbox.id}>{blvckbox.title}</option>
                ))}
              </select>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="contentCard">Content Card</label>
              <select
                id="contentCard"
                value={selectedContentCard}
                onChange={(e) => setSelectedContentCard(e.target.value)}
                required
              >
                <option value="">Select Content Card</option>
                {filteredContentCards.map((contentCard) => (
                  <option key={contentCard.id} value={contentCard.id}>{contentCard.title}</option>
                ))}
              </select>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="images">Images</label>
              <div {...getRootProps({ className: 'dropzone' })} className={style.uploadContainer}>
              <input {...getInputProps()} className={style.customUploadButton} />

              <label htmlFor="background" className={style.customUploadLabel}>
            <FaUpload /> Drag & Drop or Click to Upload Background
        </label>
          </div>
              <small className={style.helpText}>Upload images (JPEG, PNG, JPG, GIF) for your Blvckcard. Multiple images can be added, each up to 20MB. You can also upload videos (MP4, AVI, MOV, FLV), each up to 20MB.
              </small>
              
            <div className={style.previewContainer}>
                  {imagePreviews.map((image, index) => (
                    <div key={index} className={style.imagePreview}>
                      <img src={image} alt={`Preview ${index}`} />
                      <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className={style.deleteButton}
                >
                  <FaTrash />
                </button>
                    </div>
                  ))}
             
            </div>
            </div>
            
            {error && <MessagePopup message={error} onClose={closeErrorMessage} />}
            {successMessage && <MessagePopup message={successMessage} onClose={closeSuccessMessage} />}
            <div className={`${style.centerContent} ${style.formGroup}`}>

            <button type="submit" className={style.submitButton} disabled={loading}>
              {loading ? 'Saving...' : '[Update]'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlvckcardForm;

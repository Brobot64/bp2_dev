'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Slider from 'react-slick';
import style from './page.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SignInPopup from '../../../../auth/popups/SignInPopup';
import { useAuth } from '../../../../context/AuthProvider';
import Header from '../../../../partials/Header';
import SearchPopup from '../../../../popups/SearchPopup';

interface MediaProps {
  id: number;
  blvckcard_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
}

interface BlvckCard {
  id: number;
  title: string;
  slug: string;
  description: string;
  teaser_description: string | null;
  date: string;
  blvckbox_id: number;
  contentcard_id: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  meta_keywords: string | null;
  images: MediaProps[];
}

const BlvckCardDetail: React.FC = () => {
  const params = useParams<{ slug: string; newSlug: string; blvckcard: string }>();
  const slug = params?.slug || '';
  const newSlug = params?.newSlug || '';
  const blvckcard = params?.blvckcard || '';
  const [blvckCard, setBlvckCard] = useState<BlvckCard | null>(null);
  const [blvckCards, setBlvckCards] = useState<BlvckCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignInPopupVisible, setSignInPopupVisible] = useState(false);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);
  const { loggedUser, logout } = useAuth();
  const router = useRouter();
  const [editProfile, setEditProfile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000'; 

    return () => {
      document.body.style.backgroundColor = ''; 
    };
  }, []);

  useEffect(() => {
    if (!loggedUser) {
      const popupShown = localStorage.getItem('signInPopupShown');
      if (!popupShown) {
        setSignInPopupVisible(true);
      }
      setLoading(false);
      return;
    }

    const fetchBlvckCards = async () => {
      try {
        if (!slug || !newSlug) return;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${newSlug}`);
        const fetchedBlvckCards = response.data.data;
        setBlvckCards(fetchedBlvckCards);

        const currentCardIndex = fetchedBlvckCards.findIndex((card: BlvckCard) => card.slug === blvckcard);
        setCurrentIndex(currentCardIndex);
        setBlvckCard(fetchedBlvckCards[currentCardIndex]);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlvckCards();
  }, [slug, newSlug, blvckcard, loggedUser]);

  const openSignInPopup = () => setSignInPopupVisible(true);
  const openSearchPopup = () => setSearchPopupVisible(true);

  const handleLogout = async () => {
    logout();
    localStorage.removeItem('signInPopupShown');
    closeSignInPopup();
    setEditProfile(false);
  };

  const closeSignInPopup = () => setSignInPopupVisible(false);
  const handleSignInSuccess = (token: string) => {
    if (token) {
      localStorage.setItem('signInPopupShown', 'true');
      closeSignInPopup();
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % blvckCards.length;
    setCurrentIndex(nextIndex);
    router.push(`/blvckbox/${slug}/${newSlug}/${blvckCards[nextIndex].slug}`);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + blvckCards.length) % blvckCards.length;
    setCurrentIndex(prevIndex);
    router.push(`/blvckbox/${slug}/${newSlug}/${blvckCards[prevIndex].slug}`);
  };

  if (isSignInPopupVisible) {
    return (
      <SignInPopup
        onClose={closeSignInPopup}
        onSignInSuccess={handleSignInSuccess}
        onLoggedOut={() => {
          logout();
          closeSignInPopup();
        }}
        onEditProfile={editProfile}
        showCloseButton={false}
      />
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blvckCard) return <p>No data found</p>;

  const settings = {
    dots: true,
    dotsClass: `slick-dots ${style['custom-dots']}`,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <Header
        fixedNav={true}
        openEditProfile={() => {
          setSignInPopupVisible(true);
          setEditProfile(true);
        }}
        handleGoBack={() => router.push(`/blvckbox/${slug}`)}
        openSearchPopup={openSearchPopup}
        openSignInPopup={openSignInPopup}
        displayGoBack={true}
        showHome={false}
        invert={true}
      />

      <section className={style.snippetDetail}>
        <div className='container'>
          <div className={`${style.snippet} ${style.wrapper}`}>
            <div className={`${style.carouselContainer}`}>
              <Slider {...settings}>
                {blvckCard.images.map((mediaItem) => (
                  <div className={`item ${style.item}`} key={mediaItem.id}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${mediaItem.image_path}`}
                      alt={blvckCard.title}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className={`${style.textContent} ${style.snippetTextContent}`}>
              <div className={style.title}>
                <h1 className={style.snippetTitle}>{blvckCard.title}</h1>
              </div>
              <div
                className={style.desc}
                dangerouslySetInnerHTML={{ __html: blvckCard.description }}
              />
              <div className={style.navigationButtons}>
                <button onClick={handlePrevious}>Previous</button>
                <button onClick={handleNext}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isSearchPopupVisible && <SearchPopup onClose={() => setSearchPopupVisible(false)} />}
    </>
  );
};

export default BlvckCardDetail;

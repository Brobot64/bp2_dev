'use client';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import style from './page.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SignInPopup from '../../auth/popups/SignInPopup';
import SearchPopup from '../../popups/SearchPopup';
import Header from '../../partials/Header';
import Image from 'next/image';
import { useAuth } from '../../context/AuthProvider';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
} from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ImageType {
  id: number;
  image_path: string;
}

interface ContentCardType {
  title: string;
  background: string;
  slug: string;
  desc: string;
  date: string;
  images: ImageType[];
}

interface EditorialType {
  section: string;
  background_image: string;
}

interface ApiResponse {
  contentcards: ContentCardType[];
  editorial: EditorialType | null;
}

const DetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editorial, setEditorial] = useState<EditorialType | null>(null); 
  const [contentcards, setContentcards] = useState<ContentCardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);
  const [isSignInPopupVisible, setSignInPopupVisible] = useState(false);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { loggedUser, logout } = useAuth();
  const cardHoverListener = useRef<(event: MouseEvent) => void>();
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isMultiSlide, setIsMultiSlide] = useState<boolean>(false);



  const handleEditProfile = () => {
    openSignInPopup();
    setEditProfile(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  useEffect(() => {
    const centerCard = (card: HTMLElement) => {
      const container = cardContainerRef.current;
      if (!container) return;

      const rect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const cardCenter = rect.top - containerRect.top + rect.height / 2;
      const containerCenter = containerRect.height / 2;
      const targetScrollY = cardCenter - containerCenter;

      container.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    };

    cardHoverListener.current = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        centerCard(event.target);
      }
    };
  }, []);
  
  useEffect(() => {
    if (cardHoverListener.current) {
      const cards = document.querySelectorAll(`.${style.card}`);
      cards.forEach(card => {
        if (card instanceof HTMLElement) {
          card.addEventListener('mouseenter', cardHoverListener.current as EventListener);
        }
      });
  
      return () => {
        cards.forEach(card => {
          if (card instanceof HTMLElement && cardHoverListener.current) {
            card.removeEventListener('mouseenter', cardHoverListener.current as EventListener);
          }
        });
      };
    }
  }, [contentcards]);


  useEffect(() => {
    const fetchContentcards = async () => {
      setIsLoading(true);
      setError(null);
  
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contentcards/${slug}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setContentcards(response.data.contentcards);
        setEditorial(response.data.editorial);
      } catch (error) {
        console.error('Error fetching contentcards:', error);
        setError('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (slug) {
      fetchContentcards();
    }
  }, [slug]);

  const handleCardClick = (newSlug: string) => {
    if (!loggedUser) {
      openSignInPopup();
    } else {
      router.push(`/blvckbox/${encodeURIComponent(slug!)}/${encodeURIComponent(newSlug)}`);
    }
  };

  const handleGoBack = () => {
    router.push(`/blvckbox`);
  };

  const openSignInPopup = () => setSignInPopupVisible(true);
  const closeSignInPopup = () => setSignInPopupVisible(false);
  const openSearchPopup = () => setSearchPopupVisible(true);

  const handleSignInSuccess = (token: string) => {
    if (token) {
      closeSignInPopup();
    }
  };

  const handleLogout = async () => {
    logout();
    closeSignInPopup();
    setEditProfile(false);
  };

  const splitContentIntoSlides = (content: string, minLength: number): string[] => {
    const slides = [];
    let start = 0;
  
    while (start < content.length) {
      let end = start + minLength;
  
      if (end >= content.length) {
        end = content.length;
      } else {
        while (end < content.length && !['.', '!', '?', '\n', '\r'].includes(content[end])) {
          end++;
        }
        
        if (end >= content.length || !['.', '!', '?', '\n', '\r'].includes(content[end])) {
          end = Math.min(start + minLength, content.length);
          while (end < content.length && !['.', '!', '?', '\n', '\r'].includes(content[end])) {
            end++;
          }
        }
  
        if (end < content.length && ['.', '!', '?', '\n', '\r'].includes(content[end])) {
          end++;
        }
      }
  
      slides.push(content.substring(start, end).trim());
      start = end;
    }
  
    return slides;
  };
  
  

  const editorialSlides = editorial ? splitContentIntoSlides(editorial.section, 600) : [];

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay.start();
  };

  return (
    <>




      <div className={style.outerSectionsWrapper}>

        
      <section
        className={style.editorialSection}
        style={{
          backgroundImage: editorial
            ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/storage/${editorial.background_image})`
            : `url('/default-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
          <div className={style.pageContainerWide} id='blvckbook'>
            <div className={style.wrapper}>
              <div className={style.col}>
                <h1>[ Editorial ]</h1>
                <Swiper
        onInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={0}
        centeredSlides={true}
        slidesPerView={1}
        speed={1350}
        autoplay={{ delay: 5000 }}
        effect="fade"
        freeMode={true}
        fadeEffect={{
          crossFade: true,
        }}
        modules={[Autoplay, Pagination, EffectFade, Mousewheel, Keyboard]}
        className={style.editorialSwiper}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: false,
          invert: false
        }}
        direction={"horizontal"}
        followFinger={true}
        autoHeight={false}
        threshold={15}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
          {editorialSlides.length > 0 ? (
                    editorialSlides.map((slideContent, index) => (
                      <SwiperSlide key={index} className={style.swiperslide}>
                        <p>{slideContent}</p>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <p>Loading editorial content...</p>
                    </SwiperSlide>
                  )}
        </Swiper>
              </div>
              <div className={style.signature}>
                <Image src="/signature.png" alt="Sign In" width={250} height={250} />
                <h3>Teddy Pahagbia</h3>
              </div>
            </div>
          </div>
        </section>

        <section className={style.blvckbookDetail}>
            <div className={style.innerWrapper}>
            <div className={style.gridContainer}>
            <div className={style.backButton}><span onClick={handleGoBack}>BACK TO BLVCKBOX</span></div>
            <div className={style.sectionTitle}>[Contents]</div>
            <div className={style.cardContainer}>
              {isLoading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {contentcards.length === 0 && !isLoading && !error && <p>No data available</p>}
              {contentcards.length > 0 && contentcards.map((item, index) => (
                <div
                    key={index}
                    className={style.card}
                    onClick={() => handleCardClick(item.slug)}
                    onMouseEnter={() => setHoveredCardIndex(index)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                    style={{
                        backgroundImage: hoveredCardIndex === index ? `url(${process.env.NEXT_PUBLIC_BASE_URL}${item.background})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >                <div className={style.cardContent}>
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>
      </div>

      {isSignInPopupVisible && (
        <SignInPopup
          onLoggedOut={handleLogout}
          onClose={closeSignInPopup}
          onSignInSuccess={handleSignInSuccess}
          onEditProfile={editProfile}
        />
      )}

      {isSearchPopupVisible && <SearchPopup onClose={() => setSearchPopupVisible(false)} />}
    </>
  );
};

export default DetailPage;

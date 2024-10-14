'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Slider from 'react-slick';
import SwiperCore from 'swiper';
import {
  Autoplay,
  EffectFade,
  Pagination,
  Mousewheel,
  Keyboard,
} from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import '../../../app/test.css'
// import '../../../../../app/test.css';
import { Swiper, SwiperSlide } from 'swiper/react';
// import style from './page.module.css';
import style from '@/app/journal/[slug]/[edition]/[content]/page.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SignInPopup from '@/src/auth/popups/SignInPopup';
import { useAuth } from '@/src/context/AuthProvider';
import Header from '@/src/partials/Header';
import Loader from '@/src/component/loader';
import Sharepopup from '@/src/popups/sharepopup';
import Description from '@components/common/description';
import { FaShareNodes } from 'react-icons/fa6';
import { useApp } from '@/src/context/AppProvider';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { Helmet } from 'react-helmet';
import { Metadata } from 'next';

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
  const { isBgDark, setIsBgDark } = useApp();
  const params = useParams<{
    slug: string;
    edition: string;
    content: string;
  }>();
  const slug = params?.slug || '';
  const edition = params?.edition || '';
  const content = params?.content || '';
  const [blvckCard, setBlvckCard] = useState<BlvckCard | null>(null);
  const [sharePopupVisible, setSharePopupVisible] = React.useState(false);
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
        if (!slug || !edition) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${edition}`
        );
        const fetchedBlvckCards = response.data.data;
        setBlvckCards(fetchedBlvckCards);

        const currentCardIndex = fetchedBlvckCards.findIndex(
          (card: BlvckCard) => card.slug === content
        );
        setCurrentIndex(currentCardIndex);
        setBlvckCard(fetchedBlvckCards[currentCardIndex]);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlvckCards();
  }, [slug, edition, content, loggedUser]);

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
    router.push(`/journal/${slug}/${edition}/${blvckCards[nextIndex].slug}`);
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentIndex - 1 + blvckCards.length) % blvckCards.length;
    setCurrentIndex(prevIndex);
    router.push(`/journal/${slug}/${edition}/${blvckCards[prevIndex].slug}`);
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
    <Fragment>
      <Helmet>
        <meta property="og:title" content={blvckCard.title} />
        <meta property="og:description" content={blvckCard.description} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/${blvckCard.images[0].image_path})`} />
        <meta property="og:url" content={`${process.env.NEXT_WEBSITE_URL}/journal/${slug}/${edition}/${blvckCard.slug}`} />
        <meta property="twitter:title" content={blvckCard.title} />
        <meta property="twitter:description" content={blvckCard.description} />
        <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/${blvckCard.images[0].image_path})`} />
      </Helmet>
      <Header
        fixedNav={true}
        openEditProfile={() => {
          openSignInPopup();
          setEditProfile(true);
        }}
        handleGoBack={() => router.back()}
        openSearchPopup={() => {}}
        openSignInPopup={openSignInPopup}
        displayGoBack={true}
        showHome={true}
        invert={false}
        isProtected={true}
      />

       {
        loading || !loggedUser ? (
          <Loader />
        ) :  (
          <Fragment>
            {' '}
            {sharePopupVisible && (
              <Sharepopup onClose={() => setSharePopupVisible(false)} 
              post={{
                title: blvckCard.title,
                slug: `/journal/${slug}/${edition}/${blvckCard.slug}`,
                description: blvckCard.description,
                meta_keywords: blvckCard.meta_keywords || '',
                images: blvckCard.images.map((image) => ({
                  id: image.id,
                  image_path: image.image_path,
                  type: 'image', 
                })),
              }}
               />
            )}
            {isSignInPopupVisible && (
              <SignInPopup
                onLoggedOut={handleLogout}
                onClose={closeSignInPopup}
                onSignInSuccess={handleSignInSuccess}
                onEditProfile={editProfile}
              />
            )}

            <div className="px-[20px] md:px-[150px] pt-[100px] pb-[50px] bg-black min-h-screen !text-white flex flex-col gap-[90px]">
              <div className='container'>
                <Swiper
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                  autoplay={false}
                  speed={1000}
                  loop={true}
                  className="mySwiper1 border-[5px] border-white rounded-[30px]"
                  spaceBetween={0}
                  modules={[
                    Autoplay,
                    Pagination,
                    EffectFade,
                    Mousewheel,
                    Keyboard,
                  ]}
                  keyboard={true}
                  fadeEffect={{
                    crossFade: true,
                  }}
                  onSlideChange={(swiper) => {
                    console.log('slide change', swiper.activeIndex);
                    if (swiper.activeIndex <= 10) {
                      setIsBgDark(true);
                    } else {
                      setIsBgDark(false);
                    }
                  }}
                  effect="fade"
                >
                  {blvckCard.images && blvckCard.images.map((image, id) => (
                    <SwiperSlide key={id + image.blvckcard_id}>
                      <div
                        className="h-[50vh] w-full md:h-[65vh]"
                        style={{
                          backgroundImage: image.image_path ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/${image.image_path})` :'url(/banner.jpg)',
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat',
                        }}
                        key={image.blvckcard_id + image.id}
                      ></div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="mt-10 space-y-6">
                  <div className="flex justify-between flex-col gap-5" style={{ flexDirection: 'column' }}>
                    <div className='flex justify-between items-center'>
                      <h1 className="text-base md:text-xl font-bold">
                        {blvckCard.title}
                      </h1>
                      <button
                        className="text-sm flex items-center gap-2"
                        onClick={() => setSharePopupVisible(true)}
                      >
                        <FaShareNodes/> [ share ]
                      </button>
                    </div>

                    <Description text={blvckCard.description}/>
                  </div>
                </div>
              </div>

              <div className='blog-nav w-full flex justify-center items-center gap-[100px]'>
                <button title='Prev' className='left' onClick={handlePrevious}>
                  <SlArrowLeft/> Prev
                </button>

                <button title='Next' onClick={handleNext}>
                  <SlArrowRight/> Next
                </button>
              </div>
            </div>
          </Fragment>
        )
       }
    </Fragment>
  );
};

export default BlvckCardDetail;

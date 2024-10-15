'use client';
import Header from '@/src/partials/Header';
import React, { useEffect, useRef } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
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
import '../../../app/test.css';
import { useApp } from '@/src/context/AppProvider';
import uiStyle from '@/app/journal/[slug]/page.module.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/context/AuthProvider';
import SignInPopup from '@/src/auth/popups/SignInPopup';
import Image from 'next/image';
import axios from 'axios';
import { getFullMonth } from '@shared/home';


 // Added by brobot 
 interface ImageType {
  id: number;
  image_path: string;
}


// interface ContentCardType {
//   title: string;
//   background: string;
//   slug: string;
//   desc: string;
//   date: string;
//   images: ImageType[];
// }

interface ContentCardType {
  id: any,
  title: string,
  slug: string,
  background: string,
  description: string,
  blvckbox_id: any,
  created_at: string,
  updated_at: string
}

interface EditorialType {
  section: string;
  background_image: string;
}

interface ApiResponse {
  contentcards: ContentCardType[];
  editorial: EditorialType | null;
}

// Ended here

function JournalSharedPage({ slug }: { slug?: string }) {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const swiperRefForeword = useRef<SwiperCore | null>(null);
  const [bannerBg, setBannerBg] = React.useState('defalut.jpg');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [signInPopupVisible, setSignInPopupVisible] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const { loggedUser, loading, logout } = useAuth();
  const [hoveredCardIndex, setHoveredCardIndex] = React.useState<number | null>(null);
  const router = useRouter();

  const [journalBlackBox, setJournalBlackBox] = React.useState({});

  const scrollRef = useRef(null);
  const contentScroll = useRef(null)

  // Function to scroll up
  const scrollUp = () => {
    if (scrollRef.current) {
      // @ts-ignore
      scrollRef.current.scrollBy({
        top: -100, // Adjust this value for scroll distance
        behavior: 'smooth',
      });
    }
  };

  // Function to scroll down
  const scrollDown = () => {
    if (scrollRef.current) {
      // @ts-ignore
      scrollRef.current.scrollBy({
        top: 100, // Adjust this value for scroll distance
        behavior: 'smooth',
      });
    }
  };

   // Function to scroll up
   const contentScrollUp = () => {
    if (contentScroll.current) {
      // @ts-ignore
      contentScroll.current.scrollBy({
        top: -100, // Adjust this value for scroll distance
        behavior: 'smooth',
      });
    }
  };

  // Function to scroll down
  const contentScrollDown = () => {
    if (contentScroll.current) {
      // @ts-ignore
      contentScroll.current.scrollBy({
        top: 100, // Adjust this value for scroll distance
        behavior: 'smooth',
      });
    }
  };


  const closeSignInPopup = () => {
    setSignInPopupVisible(false);
  };

  const handleJournalClick = (link: string) => {
    if (loggedUser) {
      router.push(link);
    } else {
      setSignInPopupVisible(true);
    }
  };

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

  // Added by brobot 

  const searchies = useSearchParams();

  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const goToSpecificSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };
  const [contentcards, setContentcards] = React.useState<ContentCardType[]>([]);
  const [editorial, setEditorial] = React.useState<EditorialType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const splitContentIntoSlides = (
    content: string,
    minLength: number
  ): string[] => {
    const slides = [];
    let start = 0;

    while (start < content.length) {
      let end = start + minLength;

      if (end >= content.length) {
        end = content.length;
      } else {
        while (
          end < content.length &&
          !['.', '!', '?', '\n', '\r'].includes(content[end])
        ) {
          end++;
        }

        if (
          end >= content.length ||
          !['.', '!', '?', '\n', '\r'].includes(content[end])
        ) {
          end = Math.min(start + minLength, content.length);
          while (
            end < content.length &&
            !['.', '!', '?', '\n', '\r'].includes(content[end])
          ) {
            end++;
          }
        }

        if (
          end < content.length &&
          ['.', '!', '?', '\n', '\r'].includes(content[end])
        ) {
          end++;
        }
      }

      slides.push(content.substring(start, end).trim());
      start = end;
    }

    return slides;
  };

  const editorialSlides = editorial
    ? splitContentIntoSlides(editorial.section, 600)
    : [];

  const handleMouseEnter = () => {
    swiperRef.current?.autoplay.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.autoplay.start();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  useEffect(() => {
    const tile: any = sessionStorage.getItem('blackboxBx');
    setJournalBlackBox(JSON.parse(tile));
    
    const fint = searchies.has('bnxn');
    if (!fint) {
      goToSpecificSlide(1);
      if(searchies.has('cntnt')) {
        goToNextSlide();
      }
      return;
    }
  }, []);
  

  useEffect(() => {
    const fetchContentcards = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      try {
        //ApiResponse
        const response = await axios.get<any>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/contentcards/${slug}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
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

  // Ended here

  useEffect(() => {
    setIsBgDark(true);
    // reset bg color on unmount
    return () => {
      setIsBgDark(false);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header
        fixedNav={true}
        openEditProfile={() => {}}
        handleGoBack={() => {
          router.push('/');
        }}
        openSearchPopup={() => {}}
        openSignInPopup={() => {
          setSignInPopupVisible(true);
        }}
        displayGoBack={true}
        swiperRef={swiperRef}
        showHome={true}
        invert={false}
      />

      {signInPopupVisible && (
        <SignInPopup
          onLoggedOut={handleLogout}
          onClose={closeSignInPopup}
          onSignInSuccess={handleSignInSuccess}
          onEditProfile={editProfile}
        />
      )}

      <Swiper
        onInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={0}
        centeredSlides={true}
        slidesPerView={1}
        speed={1350}
        autoplay={false}
        effect="fade"
        freeMode={true}
        // onClick={toggleMenuPopupClose}
        fadeEffect={{
          crossFade: true,
        }}
        modules={[Autoplay, Pagination, EffectFade, Mousewheel, Keyboard]}
        className="mySwiper"
        mousewheel={{
          forceToAxis: true,
          sensitivity: 600,
          releaseOnEdges: false,
          thresholdDelta: 1,
        }}
        onSlideChange={(swiper) => {
          console.log('slide change', swiper.activeIndex);
          if (swiper.activeIndex <= 10) {
            setIsBgDark(true);
          } else {
            setIsBgDark(false);
          }
        }}
        direction={'vertical'}
        followFinger={false}
        autoHeight={true}
        // threshold={isMobile ? 15 : 2}
      >
        <SwiperSlide
          className="slide-banner banner-slider bg-overlay"
          style={{
            // @ts-ignore
            backgroundImage: journalBlackBox?.background ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/${journalBlackBox?.background})` : `url(/${bannerBg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className={`scrollanimation ${true ? '' : 'hide'}`}>
            <div className="mouse">
              <span className="wheel"></span>
            </div>
            <p>[ scroll to read ]</p>
          </div>
          <div className="banner-slider-content relative app_container" >
            {/* @ts-ignore */}
            <h3>{journalBlackBox ? journalBlackBox?.title : 'Cognitives cities'}</h3>
            {/* @ts-ignore */}
            <p>The foresight journal - Edition of {journalBlackBox ? getFullMonth(journalBlackBox?.date) : 'November'}</p>
            <p>
            {/* @ts-ignore */}
            {journalBlackBox?.description ? journalBlackBox?.description : 
              'BLVCKPIXEL is a new-age company combining human ingenuity with   machine intelligence to provide niche expertise on foresight.'}
            </p>
          </div>
        </SwiperSlide>

        {/* Editorials */}
        <SwiperSlide className='minders'>
        <section
          className={uiStyle.editorialSection}
          style={{
            backgroundImage: editorial
              ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/storage/${editorial.background_image})`
              : `url('/default-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // minHeight: '100vh',
            minHeight: '100dvh',
          }}
        >
          <div className={uiStyle.pageContainerWide} id="blvckbook">
            <div className={uiStyle.wrapper}>
              <div className={uiStyle.col}>
                <h1>[ foreword ]</h1>
                <Swiper
                  onInit={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  spaceBetween={0}
                  centeredSlides={false}  // Not centering to allow free scrolling
                  slidesPerView={'auto'}  // Allows scrolling through the entire content
                  speed={1350}
                  freeMode={true}  // Keep free mode for smooth scroll experience
                  effect="fade"
                  fadeEffect={{
                    crossFade: true,
                  }}
                  modules={[
                    Pagination,
                    EffectFade,
                    Mousewheel,
                    Keyboard,
                  ]}
                  className={uiStyle.editorialSwiper}
                  mousewheel={{
                    forceToAxis: true,
                    sensitivity: 1,
                    releaseOnEdges: false,
                    invert: false,
                  }}
                  direction={'horizontal'}  // Retain horizontal scroll
                  followFinger={true}
                  autoHeight={false}
                  threshold={15}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {editorialSlides.length > 0 ? 
                  // (
                  //   editorialSlides.map((slideContent, index) => (
                  //     <SwiperSlide key={index} className={uiStyle.swiperslide}>
                  //       <p>{slideContent}</p>
                  //     </SwiperSlide>
                  //   ))
                  // )
                  (
                    <SwiperSlide className={uiStyle.swiperslide}>
                      <button
                          onClick={scrollUp} // bg-gray-200
                          className="absolute md:hidden w-full left-0 z-50 top-0 bg-transparent text-gray-200 hover:bg-gray-200 hover:text-gray-700 px-4 py-2 rounded"
                        >
                          ↑
                        </button> 
                        
                        <button
                          onClick={scrollDown}
                          className="absolute md:hidden w-full left-0 z-50 bottom-0 bg-transparent text-gray-200 hover:bg-gray-200 hover:text-gray-700 px-4 py-2 rounded"
                        >
                          ↓
                        </button>

                      <div 
                        ref={scrollRef}
                        className='fashk relative h-full max-h-[320px] overflow-y-auto p-slide py-[20px]'
                        dangerouslySetInnerHTML={{
                          __html: `${editorial?.section}`, // Passing the variable
                        }}
                      >
                       

                        
                      </div>
                    </SwiperSlide>
                  )
                   : (
                    <SwiperSlide>
                      <p>Loading editorial content...</p>
                    </SwiperSlide>
                  )}
                </Swiper>

              </div>
              <div className={uiStyle.signature}>
                <Image
                  src="/signature.png"
                  alt="Signature Author"
                  width={250}
                  height={250}
                />
                <h3>Teddy Pahagbia</h3>
              </div>
            </div>
          </div>
        </section>
        </SwiperSlide>

        

        {/* slide 4 */}
        <SwiperSlide className="slide bg-black text-white">
          <div className="slide-content">
            <h1 className="" style={{ animationDelay: '0.01s' }}>
              [ contents ]
            </h1>

            <div className="trush grid grid-cols-1 md:grid-cols-3 gap-[20px] max-h-[60vh] overflow-y-auto md:gap-[50px]" ref={contentScroll}>
            {/* <button
              onClick={contentScrollUp} // bg-gray-200
              className="absolute md:hidden right-0 z-50 top-[15vh] bg-transparent text-gray-200 hover:bg-gray-200 hover:text-gray-700 px-4 py-2 rounded"
            >
              ↑
            </button> 
            
            <button
              onClick={contentScrollDown}
              className="absolute md:hidden right-0 z-50 bottom-[20vh] bg-transparent text-gray-200 hover:bg-gray-200 hover:text-gray-700 px-4 py-2 rounded"
            >
              ↓
            </button> */}
              {
                contentcards.length > 0 && contentcards.map((item, index) => (
                  <div
                  key={index + item.blvckbox_id}
                  onClick={() => {
                    handleJournalClick(`/journal/${slug}/${item.slug}`);
                  }}
                  className="cursor-pointer"
                >
                  <div 
                    className={`${uiStyle.vinyl} border-[3px] md:border-[8px] text-center flex items-center justify-center h-[100px] md:h-[200px] w-[100px] md:w-[300px] rounded-3xl`} 
                    style={{ 
                      backgroundImage:
                          hoveredCardIndex === index
                            ? item.background ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/${item.background})` : `url(/pixel2.png)`
                            : 'none',
                     backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', transition: 'background-size 0.5s ease, background-image 0.5s ease', 
                    }}
                    onMouseEnter={() => setHoveredCardIndex(index)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                  >
                    <p className="text-[23px] md:text-[15px] font-bold" style={{ fontSize: '25px', fontWeight: 'lighter' }}>
                      {item.title}
                    </p>
                  </div>
                </div>
                ))
              }
            </div>

            {/* <div className={`${uiStyle.signature}`}>
              <Image
                src="/signature.png"
                alt="Signature Author"
                width={250}
                height={250}
              />
              <h3>Teddy Pahagbia</h3>
            </div> */}
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default JournalSharedPage;

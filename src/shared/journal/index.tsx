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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthProvider';
import SignInPopup from '@/src/auth/popups/SignInPopup';

function JournalSharedPage() {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const swiperRefForeword = useRef<SwiperCore | null>(null);
  const [bannerBg, setBannerBg] = React.useState('banner.jpg');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [signInPopupVisible, setSignInPopupVisible] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const { loggedUser, loading, logout } = useAuth();
  const router = useRouter();

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
          router.back();
        }}
        openSearchPopup={() => {}}
        openSignInPopup={() => {
          setSignInPopupVisible(true);
        }}
        displayGoBack={true}
        swiperRef={swiperRef}
        showHome={false}
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
          if (swiper.activeIndex === 3 || swiper.activeIndex === 0) {
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
            backgroundImage: `url(/${bannerBg})`,
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
            {/* <div className="icon">
            <img src="/animation.gif" alt="scroll animation" />
          </div> */}
          </div>
          <div className="banner-slider-content relative app_container" >
            <h3>Cognitives cities</h3>
            <p>The foresight journal - Edition of November</p>
            <p>
              BLVCKPIXEL is a new-age company combining human ingenuity with
              machine intelligence to provide niche expertise on foresight.
            </p>
          </div>
        </SwiperSlide>

        {/* slide 2 */}
        <SwiperSlide className='mindes'>
          <div className="foreword flex flex-col justify-center bg-overlay text-justify" style={{ backgroundImage: `url(/${bannerBg})`  }} >
            <div className='z-10 mt-4'>
              <h1 className="text-[70px] md:text-[50px] sm:text-[30px] mt-10 mb-4" style={{ animationDelay: '0.01s', zIndex: 30 }}>
                [ foreword ]
              </h1>
              <div className="fore-text">
                {/* <pre style={{ zIndex: 100 }}>
                What if the city itself were the first citizen ?

                BLVCKPIXEL is a new-age company combining human ingenuity with machine
                    intelligence to provide niche expertise on [foresight]. The firm forms the
                    most unique combination of talents working in concert to reveal what lies
                    beyond the horizon. We aim to bring our unique perspectives to industry
                    leaders, companies, and organizations willing to anticipate, embrace, and
                    make the course of history. In the age of AI and cognitive technologies,
                    we form a reunion of unconventional and seasoned professionals charting
                    new territories, as we explore emerging prospects for new technological
                    applications and their impact on society and business.

                    Welcome to the first edition of the BLVCKBOOK, the foresight journal, our
                    magazine dedicated to future possibilities at the intersection of
                    anthropology, the study of human cultures and societies, and technology,
                    the application of scientific knowledge to achieve practical goals. The
                    journal carries our vision, identifying and analyzing the driving forces
                    reshaping our societies through various domains and industries through the
                    lens of technological novelty.


                With this journal, we aim to guide the reader through a journey of
                    innovation and prospective scenarios, while we explore [what’s after
                    next]. Our work pioneers anticipation and potential outcomes, at the edge
                    of technological development, defining the new frontiers to come.

                </pre> */}
              <Swiper
                onInit={(swiper) => {
                  swiperRefForeword.current = swiper;
                }}
                spaceBetween={0}
                centeredSlides={true}
                slidesPerView={1}
                speed={1350}
                autoplay={{ delay: 5000, disableOnInteraction: false }} // Autoplay on, but won't stop immediately on interaction
                effect="fade"
                freeMode={false} // Disable free mode for controlled scroll
                fadeEffect={{
                  crossFade: true,
                }}
                modules={[Autoplay, Pagination, EffectFade, Mousewheel, Keyboard]}
                mousewheel={{
                  forceToAxis: true, // Horizontal scroll only
                  sensitivity: 1.2,  // Increase sensitivity
                  releaseOnEdges: true, // Allows scrolling past edges, if needed
                }}
                direction={'horizontal'} // Ensure horizontal scrolling
                followFinger={true} // Scroll follows the finger/touch event
                autoHeight={false}
                threshold={10} // Increase threshold for stronger scroll resistance
                onMouseEnter={() => {
                  swiperRefForeword.current?.autoplay?.stop(); // Stop autoplay on mouse enter
                }}
                onMouseLeave={() => {
                  swiperRefForeword.current?.autoplay?.start(); // Restart autoplay on mouse leave
                }}
              >
                <SwiperSlide className={``}>
                  <p className="para wide tick" style={{ animationDelay: '0.6s' }}>
                    What if the city itself were the first citizen ?
                  </p>
                  <p className="para wide tick" style={{ animationDelay: '0.3s' }}>
                    BLVCKPIXEL is a new-age company combining human ingenuity with machine
                    intelligence to provide niche expertise on [foresight]. The firm forms the
                    most unique combination of talents working in concert to reveal what lies
                    beyond the horizon. We aim to bring our unique perspectives to industry
                    leaders, companies, and organizations willing to anticipate, embrace, and
                    make the course of history. In the age of AI and cognitive technologies,
                    we form a reunion of unconventional and seasoned professionals charting
                    new territories, as we explore emerging prospects for new technological
                    applications and their impact on society and business.
                  </p>
                </SwiperSlide>
                <SwiperSlide className={``}>
                  <p className="para wide" style={{ animationDelay: '0.6s' }}>
                    Welcome to the first edition of the BLVCKBOOK, the foresight journal, our
                    magazine dedicated to future possibilities at the intersection of
                    anthropology, the study of human cultures and societies, and technology,
                    the application of scientific knowledge to achieve practical goals. The
                    journal carries our vision, identifying and analyzing the driving forces
                    reshaping our societies through various domains and industries through the
                    lens of technological novelty.
                  </p>
                  <p className="para wide" style={{ animationDelay: '0.3s' }}>
                    With this journal, we aim to guide the reader through a journey of
                    innovation and prospective scenarios, while we explore [what’s after
                    next]. Our work pioneers anticipation and potential outcomes, at the edge
                    of technological development, defining the new frontiers to come.
                  </p>
                </SwiperSlide>
              </Swiper>
              </div>
            </div>

            <div className="fore-sign mx-auto text-center z-10">
              <img width={250} height={87} src="/signature.png" alt="Author Signature" />
              <h1 className='text-[26px]'>Teddy Pahagbia</h1>
            </div>
          </div>
        </SwiperSlide>

        {/* slide 4 */}
        <SwiperSlide className="slide bg-black text-white">
          <div className="slide-content">
            <h1 className="" style={{ animationDelay: '0.01s' }}>
              [ contents ]
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-[50px]">
              {[
                {
                  title: 'Introduction',
                  link: '/journal/cognitive-cities/introduction',
                },
                {
                  title: 'What’s now',
                  link: '/journal/cognitive-cities/whats-now',
                },
                {
                  title: 'Culture / Values / Lifestyle',
                  link: '/journal/cognitive-cities/culture-values-lifestyle',
                },
                {
                  title: 'What’s next',
                  link: '/journal/cognitive-cities/what-next',
                },
                {
                  title: 'the bridge',
                  link: '/journal/cognitive-cities/the-bridge',
                },
                {
                  title: 'What’s after next',
                  link: '/journal/cognitive-cities/last',
                },
              ].map((item, index) => (
                <div
                  // href="/journal/[slug]/[edition]"
                  // as={item.link}
                  key={index + item.title + item.link}
                  onClick={() => {
                    handleJournalClick(item.link);
                  }}
                  className="cursor-pointer"
                >
                  <div className="border-[3px] md:border-[8px] text-center flex items-center justify-center h-[100px] md:h-[200px] w-[100px] md:w-[300px]">
                    <p className="text-[12px] md:text-[15px] font-bold">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default JournalSharedPage;

'use client';
import Header from '@/src/partials/Header';
import React, { useEffect, useRef } from 'react';
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Autoplay,
  EffectFade,
  Navigation,
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

function JournalSharedPage() {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const swiperRefBanner = useRef<SwiperCore | null>(null);
  const [bannerBg, setBannerBg] = React.useState('banner.jpg');

  useEffect(() => {
    // reset bg color on unmount
    return () => {
      setIsBgDark(false);
    };
  }, []);

  return (
    <>
      <Header
        fixedNav={true}
        openEditProfile={() => {}}
        handleGoBack={() => {}}
        openSearchPopup={() => {}}
        openSignInPopup={() => {}}
        displayGoBack={true}
        swiperRef={swiperRef}
        showHome={false}
        invert={false}
      />

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
        // onSlideNextTransitionStart={(swiper) =>
        //   handleSlideChangeTransitionStart(swiper)
        // }
        // onSlideNextTransitionEnd={(swiper) =>
        //   handleSlideChangeTransitionEnd(swiper)
        // }
        // onSlidePrevTransitionStart={(swiper) =>
        //   handleSlideChangeTransitionStart(swiper)
        // }
        // onSlidePrevTransitionEnd={(swiper) =>
        //   handleSlideChangeTransitionEnd(swiper)
        // }
        onSlideChange={(swiper) => {
          console.log('slide change', swiper.activeIndex);
          if (swiper.activeIndex === 3) {
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
          className="slide-banner"
          style={{
            backgroundImage: `url(/${bannerBg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            // transition: 'background-image 0.5s ease-in-out',
          }}
        >
          <Swiper
            onInit={(swiper) => (swiperRefBanner.current = swiper)}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={true}
            speed={1000}
            loop={true}
            className="mySwiper1 banner-slider"
            spaceBetween={0}
            style={{
              width: '100%',
              height: '100%',
            }}
            modules={[Autoplay, Pagination, EffectFade, Mousewheel, Keyboard]}
            keyboard={true}
            onSlideChangeTransitionStart={(swiper) => {
              if (swiper.realIndex === 0) {
                setBannerBg('banner.jpg');
              } else if (swiper.realIndex === 1) {
                setBannerBg('banner1.jpg');
              }
            }}
            fadeEffect={{
              crossFade: true,
            }}
            effect="fade"
          >
            <SwiperSlide
              className=""
              style={{
                // paddingLeft: '70px',
                // paddingRight: '70px',
                height: '100%',
              }}
            >
              <div className="banner-slider-content">
                <h3>Cognitives cities</h3>
                <p>The foresight journal - Edition of November</p>
                <p>
                  BLVCKPIXEL is a new-age company combining human ingenuity with
                  machine intelligence to provide niche expertise on foresight.
                </p>
                <button>Click [ here ] to read the journal.</button>
              </div>
            </SwiperSlide>

            <SwiperSlide
              className=""
              style={{
                height: '100%',
              }}
            >
              <div className="banner-slider-content">
                <h3>Cognitives cities</h3>
                <p>The foresight journal - Edition of November</p>
                <p>
                  BLVCKPIXEL is a new-age company combining human ingenuity with
                  machine intelligence to provide niche expertise on foresight.
                </p>
                <button>Click [ here ] to read the journal.</button>
              </div>
            </SwiperSlide>

            <SwiperSlide
              className=""
              style={{
                height: '100%',
              }}
            >
              <div className="banner-slider-content">
                <h3>Cognitives cities</h3>
                <p>The foresight journal - Edition of November</p>
                <p>
                  BLVCKPIXEL is a new-age company combining human ingenuity with
                  machine intelligence to provide niche expertise on foresight.
                </p>
                <button>Click [ here ] to read the journal.</button>
              </div>
            </SwiperSlide>
          </Swiper>
        </SwiperSlide>

        {/* slide 2 */}
        <SwiperSlide className="slide">
          <div className="slide-content">
            <h1 className="blackColor" style={{ animationDelay: '0.01s' }}>
              [ foreword ]
            </h1>
            <p
              className="para wide blackColor"
              style={{ animationDelay: '0.6s' }}
            >
              What if the city itself were the first citizen ?
            </p>

            <p
              className="para wide blackColor"
              style={{ animationDelay: '0.3s' }}
            >
              BLVCKPIXEL is a new-age company combining human ingenuity with
              machine intelligence to provide niche expertise on [ foresight ].
              The firm forms the most unique combination of talents working in
              concert to reveal what lies beyond the horizon. We aim to bring
              our unique perspectives to industry leaders, companies, and
              organizations willing to anticipate, embrace, and make the course
              of history. In the age of AI and cognitive technologies, we form a
              reunion of unconventional and seasoned professionals charting new
              territories, as we explore emerging prospects for new
              technological applications and their impact on society and
              business.
            </p>
          </div>
        </SwiperSlide>

        {/* slide 3 */}
        <SwiperSlide className="slide">
          <div className="slide-content">
            <h1 className="blackColor" style={{ animationDelay: '0.01s' }}>
              [ foreword ]
            </h1>
            <p
              className="para wide blackColor"
              style={{ animationDelay: '0.6s' }}
            >
              Welcome to the first edition of the BLVCKBOOK, the foresight
              journal, our magazine dedicated to future possibilities at the
              intersection of anthropology, the study of human cultures and
              societies, and technology, the application of scientific knowledge
              to achieve practical goals. The journal carries our vision,
              identifying and analyzing the driving forces reshaping our
              societies through various domains and industries through the lens
              of technological novelty.
            </p>

            <p
              className="para wide blackColor"
              style={{ animationDelay: '0.3s' }}
            >
              With this journal, we aim to guide the reader through a journey of
              innovation and prospective scenarios, while we explore [ what’s
              after next ]. Our work pioneers anticipation and potential
              outcomes, at the edge of technological development, defining the
              new frontiers to come
            </p>
          </div>
        </SwiperSlide>

        {/* slide 4 */}
        <SwiperSlide className="slide bg-black text-white">
          <div className="slide-content">
            <h1 className="" style={{ animationDelay: '0.01s' }}>
              [ contents ]
            </h1>

            <div className="grid grid-cols-3 gap-[50px]">
              <Link
                href="/journal/[slug]/[edition]"
                as="/journal/cognitive-cities/november"
              >
                <div className="border-[5px] flex items-center justify-center h-[200px]">
                  <p className="text-[15px] font-bold">Introduction</p>
                </div>
              </Link>

              <Link
                href="/journal/[slug]/[edition]"
                as="/journal/cognitive-cities/november"
              >
                <div className="border-[5px] flex items-center justify-center h-[200px]">
                  <p className="text-[15px] font-bold">What’s now</p>
                </div>
              </Link>

              <Link
                href="/journal/[slug]/[edition]"
                as="/journal/cognitive-cities/november"
              >
                <div className="border-[5px] flex items-center justify-center h-[200px]">
                  <p className="text-[15px] font-bold">
                    Culture / Values / Lifestyle
                  </p>
                </div>
              </Link>

              <Link
                href="/journal/[slug]/[edition]"
                as="/journal/cognitive-cities/november"
              >
                <div className="border-[5px] flex items-center justify-center h-[200px]">
                  <p className="text-[15px] font-bold">
                    What’s next the bridge
                  </p>
                </div>
              </Link>

              <Link
                href="/journal/[slug]/[edition]"
                as="/journal/cognitive-cities/last"
              >
                <div className="border-[5px] flex items-center justify-center h-[200px]">
                  <p className="text-[15px] font-bold">What’s after next</p>
                </div>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default JournalSharedPage;

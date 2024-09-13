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

function JournalSharedPage() {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const swiperRefBanner = useRef<SwiperCore | null>(null);
  const [bannerBg, setBannerBg] = React.useState('banner.jpg');
  const router = useRouter();

  useEffect(() => {
    setIsBgDark(true);
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
        handleGoBack={() => {
          router.back();
        }}
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
          <div className="banner-slider-content relative app_container">
            <h3>Cognitives cities</h3>
            <p>The foresight journal - Edition of November</p>
            <p>
              BLVCKPIXEL is a new-age company combining human ingenuity with
              machine intelligence to provide niche expertise on foresight.
            </p>
          </div>
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
                <Link
                  href="/journal/[slug]/[edition]"
                  as={item.link}
                  key={index}
                >
                  <div className="border-[3px] md:border-[8px] text-center flex items-center justify-center h-[100px] md:h-[200px] w-[100px] md:w-[300px]">
                    <p className="text-[12px] md:text-[15px] font-bold">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default JournalSharedPage;

'use client';
import Header from '@/src/partials/Header';
import React, { Fragment, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
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
import '../../../../app/test.css';
import Description from '@components/common/description';
import Sharepopup from '@/src/popups/sharepopup';
import { useApp } from '@/src/context/AppProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthProvider';
import SignInPopup from '@/src/auth/popups/SignInPopup';
import Loader from '@/src/component/loader';

function SharedJournalEditionPage() {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const [sharePopupVisible, setSharePopupVisible] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const [signInPopupVisible, setSignInPopupVisible] = React.useState(false);
  const { loggedUser, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // get last part of path
  const path = pathname.split('/').pop();

  const closeSignInPopup = () => {
    setSignInPopupVisible(false);
  };

  const openSignInPopup = () => {
    setSignInPopupVisible(true);
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

  React.useEffect(() => {
    setIsBgDark(true);
    // reset bg color on unmount
    return () => {
      setIsBgDark(false);
    };
  }, []);

  return (
    <Fragment>
      <Header
        fixedNav={true}
        openEditProfile={() => {
          openSignInPopup();
          setEditProfile(true);
        }}
        handleGoBack={() => {
          router.back();
        }}
        openSearchPopup={() => {}}
        openSignInPopup={openSignInPopup}
        displayGoBack={true}
        showHome={false}
        invert={false}
        isProtected={true}
      />

      {loading || !loggedUser ? (
        <Loader />
      ) : (
        <Fragment>
          {' '}
          {sharePopupVisible && (
            <Sharepopup onClose={() => setSharePopupVisible(false)} />
          )}
          {signInPopupVisible && (
            <SignInPopup
              onLoggedOut={handleLogout}
              onClose={closeSignInPopup}
              onSignInSuccess={handleSignInSuccess}
              onEditProfile={editProfile}
            />
          )}
          <div className="px-[20px] md:px-[150px] pt-[100px] pb-[50px] bg-black min-h-screen !text-white">
            <div className="">
              <Swiper
                // onInit={(swiper) => (swiperRefBanner.current = swiper)}
                slidesPerView={1}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={false}
                speed={1000}
                loop={true}
                className="mySwiper1 border-[5px] border-white"
                spaceBetween={0}
                // style={{
                //   width: '100%',
                //   height: '100%',
                // }}
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
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>

                <SwiperSlide
                  className=""
                  style={{
                    height: '100%',
                  }}
                >
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner1.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>

                <SwiperSlide
                  className=""
                  style={{
                    height: '100%',
                  }}
                >
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>
              </Swiper>

              <div className="mt-10 space-y-6">
                <div className="flex justify-between">
                  <h1 className="text-base md:text-xl font-bold">
                    History and Evolution of Urban Planning
                  </h1>

                  <button
                    className="text-sm "
                    onClick={() => setSharePopupVisible(true)}
                  >
                    [ share ]
                  </button>
                </div>

                <Description text="BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight." />
              </div>
            </div>

            <div className="mt-6">
              <Swiper
                // onInit={(swiper) => (swiperRefBanner.current = swiper)}
                slidesPerView={1}
                navigation={false}
                pagination={{ clickable: true }}
                autoplay={false}
                speed={1000}
                loop={true}
                className="mySwiper1 border-[5px] border-white"
                spaceBetween={0}
                // style={{
                //   width: '100%',
                //   height: '100%',
                // }}
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
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>

                <SwiperSlide
                  className=""
                  style={{
                    height: '100%',
                  }}
                >
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner1.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>

                <SwiperSlide
                  className=""
                  style={{
                    height: '100%',
                  }}
                >
                  <div
                    className="h-[50vh] w-full"
                    style={{
                      backgroundImage: 'url(/banner.jpg)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>
                </SwiperSlide>
              </Swiper>

              <div className="mt-10 space-y-6">
                <div className="flex justify-between">
                  <h1 className="text-base md:text-xl font-bold">
                    History and Evolution of Urban Planning
                  </h1>

                  <button onClick={() => setSharePopupVisible(true)}>
                    [ share ]
                  </button>
                </div>

                <Description text="BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight. BLVCKPIXEL is a new-age company combining human ingenuity with machine intelligence to provide niche expertise on foresight." />
              </div>
            </div>

            {/* <SwiperSlide className="slide"> */}
            {path === 'last' && (
              <div className="slide-content min-h-screen flex flex-col justify-end pb-[30px]">
                <h1 className="" style={{ animationDelay: '0.01s' }}>
                  [ afterword ]
                </h1>
                <p className="para wide" style={{ animationDelay: '0.6s' }}>
                  What if the city itself were the first citizen ?
                </p>

                <p
                  className="para wide text-base md:text-[20px]"
                  style={{ animationDelay: '0.3s' }}
                >
                  BLVCKPIXEL is a new-age company combining human ingenuity with
                  machine intelligence to provide niche expertise on [ foresight
                  ]. The firm forms the most unique combination of talents
                  working in concert to reveal what lies beyond the horizon. We
                  aim to bring our unique perspectives to industry leaders,
                  companies, and organizations willing to anticipate, embrace,
                  and make the course of history. In the age of AI and cognitive
                  technologies, we form a reunion of unconventional and seasoned
                  professionals charting new territories, as we explore emerging
                  prospects for new technological applications and their impact
                  on society and business.
                </p>
              </div>
            )}
            {/* </SwiperSlide> */}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default SharedJournalEditionPage;

'use client';
import Header from '@/src/partials/Header';
import React, {useEffect, Fragment, useRef, useCallback } from 'react';
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
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/src/context/AuthProvider';
import SignInPopup from '@/src/auth/popups/SignInPopup';
import Loader from '@/src/component/loader';
import axios from 'axios';


// Added By Brobot
interface ImageType {
  id: number;
  blvckcard_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
}

interface DataType {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  blvckbox_id: number;
  contentcard_id: number;
  teaser_description: string;
  created_at: string;
  updated_at: string;
  images: ImageType[];
}

interface CardProps {
  title: string;
  slug: string;
  blvckboxSlug: string;
  contentcardSlug: string;
  date: string;
  desc: string;
  media: { type: 'image' | 'video'; src: string }[];
}

// Ended Here


function SharedJournalEditionPage({ slug, edition }: { slug?: string, edition?: string }) {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const [sharePopupVisible, setSharePopupVisible] = React.useState(false);

  // Added By Brobot
  const params = useParams<{ slug: string; newSlug: string }>();
  // const slug = params?.slug || '';
  const newSlug = params?.newSlug || '';
  const searchParams = useSearchParams();
  const index = searchParams?.get('index')
    ? parseInt(searchParams.get('index')!)
    : 0;
    const [currentIndex, setCurrentIndex] = React.useState<number>(index);

    const [data, setData] = React.useState<DataType[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);

    const { ref, inView } = useInView({
      threshold: 1.0,
      triggerOnce: false,
    });
  
    const fetchData = useCallback(
      async (page: number) => {
        if (!hasMore) return;
  
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${edition}?page=${page}`
          );
          const responseData = response.data;
  
          const newData: DataType[] = responseData.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            teaser_description: item.teaser_description,
            date: item.date,
            blvckbox_id: item.blvckbox_id,
            contentcard_id: item.contentcard_id,
            user_id: item.user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            meta_keywords: item.meta_keywords,
            images: item.images.map((img: any) => ({
              id: img.id,
              blvckcard_id: img.blvckcard_id,
              image_path: img.image_path,
              created_at: img.created_at,
              updated_at: img.updated_at,
            })),
          }));
  
          if (newData.length > 0) {
            // setData((prevData) => [...prevData, ...newData]);
            setData(newData);
            setCurrentPage(page);
          } else {
            setHasMore(false);
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to fetch data');
          setIsLoading(false);
        }
      },
      [newSlug]
    );
  
    useEffect(() => {
      fetchData(1);
    }, [fetchData]);
  
    useEffect(() => {
      if (inView && hasMore) {
        fetchData(currentPage + 1);
      }
    }, [inView, fetchData, currentPage, hasMore]);
  
  // Ended Here
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

  // Added By Brobot

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!Array.isArray(data)) {
    return <div>Error: Data is not an array</div>;
  }


  // const cardData: CardProps[] = data.map((item) => ({
  //   title: item.title,
  //   slug: slug,
  //   date: item.date,
  //   blvckboxSlug: slug,
  //   contentcardSlug: newSlug,
  //   desc: item.description,
  //   media: item.images.map((image) => ({
  //     type: 'image',
  //     src: image.image_path,
  //   })),
  // }));


  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    router.push(`/blvckbox/${slug}/${data[nextIndex].slug}?index=${nextIndex}`);
  };
  // Ended Here

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
          <div className="px-[20px] md:px-[150px] pt-[100px] pb-[50px] bg-black min-h-screen !text-white flex flex-col gap-10">
            {/* <div className="">
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
            </div> */}


            <>
            {data.map((item, inds) => (
              <div key={inds}>
                <Swiper
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                  autoplay={false}
                  speed={1000}
                  loop={true}
                  className="mySwiper1 border-[5px] border-white"
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
                  effect="fade"
                >
                  {item.images && item.images.map((image, id) => (
                    <SwiperSlide>
                      <div
                        className="h-[50vh] w-full"
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
                        {item.title}
                      </h1>
                      <button
                        className="text-sm "
                        onClick={() => setSharePopupVisible(true)}
                      >
                        [ share ]
                      </button>
                    </div>

                    <Description text={item.description}/>
                  </div>
                </div>
              </div>
            ))}
            </>

            {/* <div className="mt-6">
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
            </div> */}

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

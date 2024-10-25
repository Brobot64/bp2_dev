'use client';
import Header from '@/src/partials/Header';
import React, {useEffect, Fragment, useRef, useCallback, useState } from 'react';
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
import { FaShareNodes } from 'react-icons/fa6';
import { title } from 'process';


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
  meta_keywords?: any,
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
    const [borderColor, setBorderColor] = React.useState('#F000FF');
    const [isHovered, setIsHovered] = useState(false);

    const { ref, inView } = useInView({
      threshold: 1.0,
      triggerOnce: false,
    });
  
    // const fetchData = useCallback(
    //   async (page: number) => {
    //     if (!hasMore) return;
  
    //     try {
    //       const response = await axios.get(
    //         `${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${edition}?page=${page}`
    //       );
    //       const responseData = response.data;
  
    //       const newData: DataType[] = responseData.data.map((item: any) => ({
    //         id: item.id,
    //         title: item.title,
    //         slug: item.slug,
    //         description: item.description,
    //         teaser_description: item.teaser_description,
    //         date: item.date,
    //         blvckbox_id: item.blvckbox_id,
    //         contentcard_id: item.contentcard_id,
    //         user_id: item.user_id,
    //         created_at: item.created_at,
    //         updated_at: item.updated_at,
    //         meta_keywords: item.meta_keywords,
    //         images: item.images.map((img: any) => ({
    //           id: img.id,
    //           blvckcard_id: img.blvckcard_id,
    //           image_path: img.image_path,
    //           created_at: img.created_at,
    //           updated_at: img.updated_at,
    //         })),
    //       }));
  
    //       if (newData.length > 0) {
    //         // setData((prevData) => [...prevData, ...newData]);
    //         setData(newData);
    //         setCurrentPage(page);
    //       } else {
    //         setHasMore(false);
    //       }
    //       setIsLoading(false);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       setError('Failed to fetch data');
    //       setIsLoading(false);
    //     }
    //   },
    //   [newSlug]
    // );
  
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
            setData((prevData) => [...prevData, ...newData]);
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
      [newSlug, hasMore]
    );

    useEffect(() => {
      fetchData(currentPage);
    }, [fetchData]);
  
    useEffect(() => {
      if (inView && hasMore) {
        fetchData(currentPage + 1);
      }
    }, [inView, fetchData, currentPage, hasMore]);

    useEffect(() => { 
      const trap = JSON.stringify(localStorage.getItem('borderColor'));
      setBorderColor(trap);
    }, [])


    // Share DAta
  const [currentShareData, setCurrentShareData] = useState<{
    title: string;
    slug: string;
    description: string;
    meta_keywords: string;
    images: Array<{ id: number; image_path: string; type: string }>
  }| null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

    // const openShareModal = (e: React.MouseEvent<HTMLButtonElement>, url: string, title: string, desc: string) => {
    //   e.preventDefault()
    //   setCurrentShareData({ url, title, desc });
    //   setModalOpen(true);
    // };

  const openShareModal = (data: any) => {
    setCurrentShareData(data);
    setSharePopupVisible(true);
  }
  
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

  const ShareButton = ({item}: {item: any}) => {
    return (
      <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-sm flex items-center gap-2 text-nowrap"
      style={{
        color: isHovered
          ? borderColor
            ? borderColor.replace(/"/g, '') // Apply dynamic borderColor if provided
            : "#dd47f7" // Fallback to hoverColor from localStorage
          : '', // Default color if not hovered
        transition: 'color 0.3s ease', // Smooth color transition
      }}
      onClick={() => openShareModal({
        title: item.title,
        slug: `/journal/${slug}/${edition}/${item.slug}`,
        description: item.description,
        meta_keywords: item?.meta_keywords,
        images: item.images,
      })}
    >
      <FaShareNodes /> [ share ]
    </button>
    )
  }

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

  // const handleGOBack = () => {
  //   const previousUrl = document.referrer;
  //   const newUrl = new URL(previousUrl);
  //   newUrl.searchParams.set('cntnt', '1');
  //   router.push(newUrl.toString());
  // }

  const handleGOBack = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const paths = url.pathname.split('/');
    paths.pop();
    url.pathname = paths.join('/');
    url.searchParams.set('cntnt', '1');
    router.push(url.toString());
  };

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
        // () => {
        //   router.back();
        // }
        handleGoBack={handleGOBack}
        openSearchPopup={() => {}}
        openSignInPopup={openSignInPopup}
        displayGoBack={true}
        showHome={true}
        invert={true}
        isProtected={true}
      />

      {loading || !loggedUser ? (
        <Loader />
      ) : (
        <Fragment>
          {' '}
          {sharePopupVisible && currentShareData && (
            <Sharepopup 
              onClose={() => setSharePopupVisible(false)} 
              post={currentShareData} 
            />
          )}
          {signInPopupVisible && (
            <SignInPopup
              onLoggedOut={handleLogout}
              onClose={closeSignInPopup}
              onSignInSuccess={handleSignInSuccess}
              onEditProfile={editProfile}
            />
          )}
          <div className="px-[20px] md:px-[150px] pt-[100px] pb-[50px] bg-black min-h-screen !text-white flex flex-col gap-[90px]">

            <>
            {data.map((item, inds) => (
              <div key={inds} className='container'>
                <Swiper
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                  autoplay={false}
                  speed={1000}
                  style={{
                    borderColor: borderColor.replace(/"/g, '') || '#fff'
                  }}
                  loop={true}
                  className={`mySwiper1 border-[5px] rounded-[15px] overflow-hidden [&>*span]:!bg-black ${borderColor ? `border-[${borderColor.replace(/"/g, '')}]` : 'border-white'} [&>span.swiper-pagination-bullet-active]:bg-[${borderColor.replace(/"/g, '')}]`}  swiper-pagination-bullet-active
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
                  {item.images && item.images.map((image, id) => (
                    <SwiperSlide key={id + image.blvckcard_id}>
                      <div
                        className="h-[50vh] w-full md:h-[65vh]"
                        style={{
                          backgroundImage: image.image_path ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/${image.image_path})` :'url(/defalut-ui.jpg)',
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
                      {/* <button
                      // onMouseEnter={()=> }
                        className={`text-sm flex items-center gap-2 text-nowrap ${borderColor && `text-[${borderColor.replace(/"/g, '')}]`}  ${borderColor ? `hover:!text-[${borderColor.replace(/"/g, '')}]` : 'hover:!text-[#F000FF]'}`}
                        style={{
                          
                        }}
                        onClick={() => openShareModal({
                            title: item.title,
                            slug: `/journal/${slug}/${edition}/${item.slug}`,
                            description: item.description,
                            meta_keywords: item?.meta_keywords,
                            images: item.images
                        })}
                      >
                        <FaShareNodes/> [ share ]
                      </button> */}
                       <ShareButton item={item}/>
                    </div>

                    <Description text={item.description}/>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && <div ref={ref} className="text-center mt-4">Loading more...</div>}

            </>

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

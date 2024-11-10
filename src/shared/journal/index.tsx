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
  Navigation,
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
import { borderColors  } from '@/tribe';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';


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

function getColor(colors: any[], index: any) {
  // console.log('colors,: ', colors[index % colors.length])
  return colors[index % colors.length];
}



// Ended here

function JournalSharedPage({ slug }: { slug?: string }) {
  const { isBgDark, setIsBgDark } = useApp();
  const swiperRef = useRef<SwiperCore | null>(null);
  const swiperRefForeword = useRef<SwiperCore | null>(null);
  const swiperRefConclude = useRef<SwiperCore | null>(null);
  const [bannerBg, setBannerBg] = React.useState('defalut.jpg');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [signInPopupVisible, setSignInPopupVisible] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);
  const { loggedUser, loading, logout } = useAuth();
  const [hoveredCardIndex, setHoveredCardIndex] = React.useState<number | null>(null);
  const router = useRouter();

  const [journalBlackBox, setJournalBlackBox] = React.useState({});



  const goToSlide = (slideNumber: number) => {
    // console.log(swiperRef)
    
    if (swiperRef.current) {
      swiperRef.current.slideTo(slideNumber, 500); // 500ms transition
    }
  };
  const divRef = useRef([]);

  const scrollToActive = (index: any) => {
    if (divRef.current[index]) {
      // @ts-ignore
      divRef.current[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const [activeIndex, setActiveIndex] = React.useState(0);


const handleTPrev = () => {
  setActiveIndex((prevIndex) => {
    const newIndex = prevIndex === 0 ? contentcards.length - 1 : prevIndex - 1;
    scrollToActive(newIndex);
    return newIndex;
  });
};




const littleMod = (index: number) => {
  // @ts-ignore
  swiperRef.current.swiper.slideTo(index)
}





const handleTNext = () => {
  setActiveIndex((prevIndex) => {
    const newIndex = prevIndex === contentcards.length - 1 ? 0 : prevIndex + 1;
    scrollToActive(newIndex);
    return newIndex;
  });
};



const goToPreviousSlide = () => {
  if (swiperRef.current) swiperRef.current.slidePrev();
};

const goToNextSlide = () => {
  
  if (swiperRef.current) {
    swiperRef.current.slideNext();
  } else {
    console.error("Swiper reference is not available.");
  }
};




const goToSpecificSlide = (slideIndex: number) => {
  console.log("slide to: ", slideIndex)
  if (swiperRef.current) swiperRef.current.slideTo(slideIndex);
};

  // const goToLastSlide = () => {
  //   if (swiperRef1.current) {
  //     const lastIndex = swiperRef1.current.slides.length - 1; // Get the last slide index
  //     swiperRef1.current.slideTo(lastIndex, 500); // Move to the last slide with a smooth transition
  //   }
  // };
  

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
      swiperRef.current.activeIndex = 1;
      swiperRef.current.slidePrev();
    }
  };

  const getSlideLength = () => {
    if (swiperRef.current) {
      const totalSlides = swiperRef.current.slides.length;
      return totalSlides// Go to the last slide (zero-based index)
    }
  };
  

  // const goToNextSlide = () => {
  //   if (swiperRef.current) {
  //     swiperRef.current.slideNext();
  //   }
  // };

  // const goToSpecificSlide = (index: number) => {
  //   if (swiperRef.current) {
  //     swiperRef.current.slideTo(index);
  //   }
  // };

  const goToLastSlide = () => {
    if (swiperRef.current) {
      const totalSlides = swiperRef.current.slides.length;
      console.log(totalSlides);
      swiperRef.current.slideTo(totalSlides - 1); // Go to the last slide (zero-based index)
    }
  };
  
  const [contentcards, setContentcards] = React.useState<ContentCardType[]>([]);
  const [editorial, setEditorial] = React.useState<EditorialType | null>(null);
  const [conclusion, setConclusion] = React.useState<EditorialType | null>(null);
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
    ? splitContentIntoSlides(editorial.section, 500)
    : [];

  const conclusionSlides = conclusion
    ? splitContentIntoSlides(conclusion.section, 500)
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
    if (editorialSlides.length > 0) {
      setTuneNum(editorialSlides.length + 1);
    }
  }, [editorialSlides])


  useEffect(() => {
    // Fetch session data
    const tile: any = sessionStorage.getItem('blackboxBx');
    setJournalBlackBox(JSON.parse(tile));
    
    goToSpecificSlide(1);
    
    // Check the search parameters
    const fint = searchies.has('bnxn');
  
    if (!fint) {
      // goToSpecificSlide(1);
      //goToLastSlide();  // Go to specific slide if 'bnxn' not found
  
      if (searchies.has('cntnt')) {
        // Delay execution to allow all slides to render
        setTimeout(() => {
          goToSpecificSlide(tuneNum); // Go to the last slide after editorial slides are injected
        }, 2000); // Adjust timeout duration as necessary based on your slide injection timing
      }
      return;
    }
    // setActiveButton(2);
    // goToSpecificSlide(1);
  }, [swiperRef.current?.slides.length]); 
  
  

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
        setConclusion(response.data.conclusion);
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


  const [activeButton, setActiveButton] = React.useState(1);
  const [tuneNum, setTuneNum] = React.useState(1);

  const handleButtonClick = (buttonName: any, action: () => void) => {
    setActiveButton(buttonName);
    action();
  };

  // Added By Brobot
  
  const openSignInPopup = () => setSignInPopupVisible(true);
  const handleEditProfile = () => {
    openSignInPopup();
    setEditProfile(true);
  };


  const handleMenuClick = (index: number) => {
    console.log(swiperRef.current?.slides)
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <>
      <Header
        fixedNav={true}
        openEditProfile={handleEditProfile}
        handleGoBack={() => {
          swiperRef.current?.slidePrev();
        }}
        openSearchPopup={() => {}}
        openSignInPopup={openSignInPopup}
        displayGoBack={true}
        swiperRef={swiperRef}
        showHome={true}
        // showToggleButton={true}
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
        onInit={(swiper) => (swiperRef.current = swiper)}
        // onSwiper={(swiper) => (swiperRef.current = swiper)}
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
        modules={[Autoplay, Pagination, EffectFade, Mousewheel, Keyboard, Navigation]}
        className="mySwiper"
        mousewheel={{
          forceToAxis: true,
          sensitivity: 600,
          releaseOnEdges: false,
          thresholdDelta: 1,
        }}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex >= 1 && swiper.activeIndex < tuneNum) {
            setActiveButton(2)
          } else if (swiper.activeIndex >= tuneNum + 2) {
            setActiveButton(tuneNum + 2)
          } else {
            setActiveButton(swiper.activeIndex + 1);  
          }
          // console.log(swiper.activeIndex >= 1)
          // console.log(swiper.activeIndex < tuneNum)
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
        {
          editorialSlides.length > 0 ? 
          (
            editorialSlides.map((slidecontent, index) => (
              slidecontent !== '<p></p>' && slidecontent !== '<p> </p>' && slidecontent !== '</p>' ? (  // Check if slidecontent is not an empty paragraph
                <SwiperSlide className='minders' key={index}>
                  <section
                    className={uiStyle.editorialSection}
                    style={{
                      backgroundImage: editorial
                        ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/storage/${editorial.background_image})`
                        : `url('/default-bg.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '100dvh',
                    }}
                  >
                    <div className={uiStyle.pageContainerWide} id="blvckbook">
                      <div className={uiStyle.wrapper}>
                        <div className={uiStyle.col}>
                          { index === 0 && (<h1>[ foreword ]</h1>) }
                          
                          <div className={uiStyle.swiperslide}>
                            <div 
                              ref={scrollRef}
                              dangerouslySetInnerHTML={{
                                __html: `${slidecontent}`,
                              }}
                            >                           
                            </div>
                          </div>
                        </div>
                        
                        {
                          // @ts-ignore
                          index === (editorialSlides.length - 1) && (
                            <div className={uiStyle.signature}>
                              <Image
                                src="/signature.png"
                                alt="Signature Author"
                                width={250}
                                height={250}
                              />
                              <h3>Teddy Pahagbia</h3>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </section>
                </SwiperSlide>
              ) : null  // If slidecontent is '<p></p>', render nothing
            ))
          ) : (
            <SwiperSlide>
              <p>Loading editorial content...</p>
            </SwiperSlide>
          )
        }
       
        

        

        {/* slide 4 */}
        <SwiperSlide className="slide bg-black text-white">
          <div className="slide-content">
            <h1 className="" style={{ animationDelay: '0.01s' }}>
              [ contents ]
            </h1>

            <p className='text-[14px] md:text-[16px] lg:text-[24px]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <div className='relative kunli'>
             <button
                onClick={handleTPrev}
                className='hover:text-[#DD47F7] transition'
                style={{
                  left: '-25px'
                }}
              >
                <SlArrowLeft/>
              </button>
              <div className="trush grid relative grid-cols-1 md:grid-cols-3 gap-[20px] max-h-[60vh] overflow-y-auto md:gap-[50px]" ref={contentScroll}>
              
                {
                  contentcards.length > 0 && contentcards.map((item, index) => (
                    <div
                    key={index + item.blvckbox_id}
                    onClick={() => {
                      handleJournalClick(`/journal/${slug}/${item.slug}`);
                      localStorage.setItem('borderColor', getColor(borderColors, index));
                    }}
                    className="cursor-pointer"
                    // @ts-ignore
                    ref={(el) => (divRef.current[index] = el)}
                  >
                    <div
                      className={`${uiStyle.vinyl} border-[3px] md:border-[8px] text-center flex items-center justify-center h-[100px] md:h-[200px] w-[100px] md:w-[300px] relative overflow-hidden transition`}
                      style={{
                        borderColor:
                        (hoveredCardIndex === index || activeIndex === index)
                          ? getColor(borderColors, index) : 'white',
                        backgroundImage:
                        (hoveredCardIndex === index || activeIndex === index)
                              ? item.background ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/${item.background})` : `url(/pixel2.png)`
                              : 'none',
                       backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', transition: 'background-size 0.5s ease, background-image 0.5s ease',
                      }}
                      onMouseEnter={() => setHoveredCardIndex(index)}
                      onMouseLeave={() => setHoveredCardIndex(null)}
                    >
                      <span className='absolute w-full h-full bg-[#1c1c1c3c]'/>
                      <p className="text-[23px] max-w-[200px] md:text-[15px] font-bold" style={{ fontSize: '25px', fontWeight: 'lighter' }}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                  ))
                }
              </div>
                <button
                  onClick={handleTNext}
                  className='hover:text-[#DD47F7] transition'
                  style={{
                    right: '-25px'
                  }}
                >
                  <SlArrowRight/>
                </button>
            </div>
          </div>
        </SwiperSlide>


        {/* Added Splited ConclusionSlides */}

        {conclusionSlides.length > 0 ? 
          (
            conclusionSlides.map((slidecontent, index) => (
              slidecontent !== '<p></p>' && slidecontent !== '<p> </p>' && slidecontent !== '</p>' ? (  // Check if slidecontent is not an empty paragraph
                <SwiperSlide className='minders' key={index}>
                  <section
                    className={uiStyle.editorialSection}
                    style={{
                      backgroundImage: conclusion
                        ? `url(${process.env.NEXT_PUBLIC_BASE_URL}/storage/${conclusion.background_image})`
                        : `url('/default-bg.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minHeight: '100dvh',
                    }}
                  >
                    <div className={uiStyle.pageContainerWide} id="blvckbook">
                      <div className={uiStyle.wrapper}>
                        <div className={uiStyle.col}>
                          { index === 0 && (<h1>[ afterword ]</h1>) }
                          
                          <div className={uiStyle.swiperslide}>
                            <div 
                              ref={scrollRef}
                              dangerouslySetInnerHTML={{
                                __html: `${slidecontent}`,
                              }}
                            >                           
                            </div>
                          </div>
                        </div>
                        
                        {
                          // @ts-ignore
                          index === (conclusionSlides.length - 1) && (
                            <div className={uiStyle.signature}>
                              <Image
                                src="/signature.png"
                                alt="Signature Author"
                                width={250}
                                height={250}
                              />
                              <h3>Teddy Pahagbia</h3>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </section>
                </SwiperSlide>
              ) : null  // If slidecontent is '<p></p>', render nothing
            ))
          ) : (
            <SwiperSlide>
              <p>Loading afterword content...</p>
            </SwiperSlide>
          )
        }
        
      </Swiper>

      
       {/* Menu Item */}
      <div
        className="absolute z-[1000] right-3 top-16 flex flex-col text-right text-slate-300"
        style={{
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: '200',
          textAlign: 'right'
        }}
      >
        {/* <button onClick={() => handleButtonClick(1, () => swiperRef.current?.slideTo(0))} className={`jornbtn text-white py-1 px-2 rounded ${activeButton === 1 ? 'active' : ''}`}>
          {activeButton === 1 ? `[ home ]` : 'home'}
        </button> */}

        <button onClick={() => handleButtonClick(2, () => swiperRef.current?.slideTo(1))} className={`jornbtn text-white py-1 px-2 rounded ${activeButton === 2 ? 'active' : ''}`}>
          {activeButton === 2 ? `[ foreward ]` : 'foreward'}
        </button>

        <button onClick={() => handleButtonClick(tuneNum, () => swiperRef.current?.slideTo(tuneNum))} className={`jornbtn text-white py-1 px-2 rounded ${activeButton === tuneNum + 1 ? 'active' : ''}`}>
          {activeButton === tuneNum + 1 ? `[ content ]` : 'content'}
        </button>

        <button onClick={() => handleButtonClick(3, () => swiperRef.current?.slideTo(tuneNum + 1))} className={`jornbtn text-white py-1 px-2 rounded ${activeButton === tuneNum + 2 ? 'active' : ''}`}>
          {activeButton === tuneNum + 2 ? `[ afterword ]` : 'afterword'}
        </button>

        <button onClick={() => router.push('/')} className={`jornbtn text-white py-1 px-2 rounded ${activeButton === tuneNum + 2 ? 'active' : ''}`}>
          {activeButton === 190 ? `[ exit ]` : 'exit'}
        </button>
      </div>
      {/* Menu Items Ended */}
    </>
  );
}

export default JournalSharedPage;
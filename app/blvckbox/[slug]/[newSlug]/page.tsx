'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import style from './page.module.css';
import Header from '../../../../src/partials/Header';
import BlvckCards from '../../../../components/blvckcards/page';
import SignInPopup from '../../../../src/auth/popups/SignInPopup';
import SearchPopup from '../../../../src/popups/SearchPopup';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../../../src/context/AuthProvider';

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

const CardDetailPage: React.FC = () => {
  const params = useParams<{ slug: string; newSlug: string }>();
  const slug = params?.slug || '';
  const newSlug = params?.newSlug || '';
  const searchParams = useSearchParams();
  const index = searchParams?.get('index')
    ? parseInt(searchParams.get('index')!)
    : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isSignInPopupVisible, setSignInPopupVisible] = useState(false);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const swiperRef = useRef<any>(null);
  const { loggedUser, logout } = useAuth();

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const { ref, inView } = useInView({
    threshold: 1.0,
    triggerOnce: false,
  });

  const fetchData = useCallback(
    async (page: number) => {
      if (!hasMore) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${newSlug}?page=${page}`
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

  if (!loggedUser) {
    return (
      <>
        <Header
          fixedNav={true}
          openEditProfile={() => {
            setSignInPopupVisible(true);
            setEditProfile(true);
          }}
          handleGoBack={() => router.push('/blvckbox')}
          openSearchPopup={openSearchPopup}
          openSignInPopup={openSignInPopup}
          displayGoBack={true}
          showHome={true}
          invert={true}
        />
        <SignInPopup
          onLoggedOut={handleLogout}
          onClose={closeSignInPopup}
          onSignInSuccess={handleSignInSuccess}
          onEditProfile={editProfile}
          showCloseButton={false}
        />
      </>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!Array.isArray(data)) {
    return <div>Error: Data is not an array</div>;
  }

  const cardData: CardProps[] = data.map((item) => ({
    title: item.title,
    slug: item.slug,
    date: item.date,
    blvckboxSlug: slug,
    contentcardSlug: newSlug,
    desc: item.description,
    media: item.images.map((image) => ({
      type: 'image',
      src: image.image_path,
    })),
  }));

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    router.push(`/blvckbox/${slug}/${data[nextIndex].slug}?index=${nextIndex}`);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    router.push(`/blvckbox/${slug}/${data[prevIndex].slug}?index=${prevIndex}`);
  };

  const handleGoBack = () => {
    router.push(`/blvckbox/${slug}`);
  };

  return (
    <>
      <Header
        fixedNav={true}
        openEditProfile={() => {
          setSignInPopupVisible(true);
          setEditProfile(true);
        }}
        handleGoBack={handleGoBack}
        openSearchPopup={() => setSearchPopupVisible(true)}
        openSignInPopup={() => setSignInPopupVisible(true)}
        displayGoBack={true}
        showHome={false}
        invert={true}
      />
      <div className={style.outerSectionsWrapper}>
        <section className={style.snippetDetail}>
          <div className="container">
            {cardData.length > 0 ? (
              cardData.map((item) => <BlvckCards key={item.slug} {...item} />)
            ) : (
              <div>No data available</div>
            )}
            <div ref={ref} style={{ height: '20px' }}></div>
          </div>
        </section>

        <section
          className={style.editorialSection}
          style={{ backgroundImage: `url('/conclusion.jpg')` }}
        >
          <div className={style.pageContainerWide} id="blvckbook">
            <div className={style.wrapper}>
              <div className={style.col}>
                <h1>[Conclusion]</h1>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry...
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isSignInPopupVisible && (
        <SignInPopup
          onLoggedOut={handleLogout}
          onClose={() => setSignInPopupVisible(false)}
          onSignInSuccess={handleSignInSuccess}
          onEditProfile={editProfile}
        />
      )}
      {isSearchPopupVisible && (
        <SearchPopup onClose={() => setSearchPopupVisible(false)} />
      )}
    </>
  );
};

export default CardDetailPage;

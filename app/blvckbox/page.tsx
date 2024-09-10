'use client';
import React, { useEffect, useRef, useState } from 'react';
import style from './page.module.css';
import { useRouter } from 'next/navigation';
import Header from '../../src/partials/Header';
import SignInPopup from '../../src/auth/popups/SignInPopup';
import SearchPopup from '../../src/popups/SearchPopup';
import axios from 'axios';
import { useAuth } from '../../src/context/AuthProvider';
import Box from '../../components/blvckbox/box/page';
import Blvckout from '../../components/Blackout';

interface BoxProps {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  background: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [boxesData, setBoxesData] = useState<BoxProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [isSignInPopupVisible, setSignInPopupVisible] = useState(false);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    const fetchBoxesData = async () => {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get<BoxProps[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckboxes`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const fetchedBoxesData: BoxProps[] = Array.isArray(response.data)
          ? response.data
          : [];
        setBoxesData(fetchedBoxesData);
      } catch (error: any) {
        setError('Failed to fetch data.');
        console.error('Failed to fetch boxesData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoxesData();
  }, []);

  const handleBoxClick = (slug: string) => {
    router.push(`/blvckbox/${slug}`);
  };

  const handleEditProfile = () => {
    openSignInPopup();
    setEditProfile(true);
  };

  const handleLogout = async () => {
    logout();
    closeSignInPopup();
    setEditProfile(false);
  };

  const handleGoBack = () => {
    router.push(`/`);
  };

  const openSignInPopup = () => setSignInPopupVisible(true);
  const closeSignInPopup = () => setSignInPopupVisible(false);
  const openSearchPopup = () => setSearchPopupVisible(true);
  const closeSearchPopup = () => setSearchPopupVisible(false);

  const handleSignInSuccess = (token: string) => {
    if (token) {
      closeSignInPopup();
    }
  };

  const handleMenuClick = (index: number) => {
    // Handle menu click logic
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header
        openEditProfile={handleEditProfile}
        handleGoBack={handleGoBack}
        openSearchPopup={openSearchPopup}
        openSignInPopup={openSignInPopup}
        displayGoBack={false}
        showHome={true}
        invert={true}
        fixedNav={false}
        showToggleButton={true}
      />
      <section className={style.blvckbook}>
        <div className={style.pageContainerWide} id="blvckbook">
          <h1>
            BLVCK<span>BOX</span>
          </h1>
          <p>
            Got foresight? Read our last papers and forecasts to see [ what’s
            after next ]. You have to subscribe, but hey, it’s addictive. The
            first one is free… ;
          </p>
          <div className={style.boxes}>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              boxesData.map((box, index) => (
                <Box
                  id={box.id}
                  slug={box.slug}
                  key={index}
                  title={box.title}
                  subtitle={box.subtitle}
                  description={box.description}
                  date={formatDate(box.date)}
                  background={box.background}
                  onClick={() => handleBoxClick(box.slug)}
                />
              ))
            )}
          </div>
        </div>
      </section>
      {isSignInPopupVisible && (
        <SignInPopup
          onLoggedOut={handleLogout}
          onClose={closeSignInPopup}
          onSignInSuccess={handleSignInSuccess}
          onEditProfile={editProfile}
        />
      )}
      {isSearchPopupVisible && <SearchPopup onClose={closeSearchPopup} />}
      <Blvckout />
    </>
  );
};

export default Page;

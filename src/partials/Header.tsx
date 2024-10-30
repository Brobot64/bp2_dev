import React, { useState, RefObject, useEffect } from 'react';
import style from './Header.module.css';
import Image from 'next/image';
import { useAuth } from '../context/AuthProvider';
import { FaBars, FaArrowRight, FaSearch } from 'react-icons/fa';
import { GoSearch } from 'react-icons/go';
import { useApp } from '../context/AppProvider';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  handleGoBack: () => void;
  openSearchPopup: () => void;
  openSignInPopup: () => void;
  openEditProfile: () => void;
  swiperRef?: RefObject<{
    slideTo: (index: number, speed: number, runCallbacks: boolean) => void;
  }>;
  showHome: boolean;
  invert: boolean;
  inverter?: boolean;
  fixedNav: boolean;
  displayGoBack: boolean;
  toggleSidebar?: () => void;
  showToggleButton?: boolean;
  otherPageHeader?: boolean;
  isSidebarOpen?: boolean;
  isProtected?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  openEditProfile,
  handleGoBack,
  openSearchPopup,
  openSignInPopup,
  swiperRef,
  showHome,
  invert,
  fixedNav,
  displayGoBack,
  toggleSidebar,
  showToggleButton,
  otherPageHeader,
  inverter,
  isSidebarOpen,
  isProtected = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { loggedUser, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isBgDark } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && loggedUser) {
      if (loggedUser.role_id === 3) {
        const payment = loggedUser?.payments[0];
        console.log(loggedUser);

        // if (payment.status === 'pending') {
        //   // redirect to payment page
        //   router.push(`/payment/${loggedUser.uuid}`);
        // } else if (payment.status === 'completed') {
        //   console.log('User has an active subscription');
        // }
      }
    }
  }, [loading, loggedUser]);

  useEffect(() => {
    if (!loading && isProtected && !loggedUser) {
      router.push('/');
    }
  }, [isProtected, loggedUser, loading]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div
      className={`${style.header} ${invert ? style.invert : ''} ${
        fixedNav ? style.fixed : ''
      } ${inverter ? style.inverter : ''}`}
    >
      <a
        href="#"
        id="go-back"
        className={`
          ${style.goBack} ${isBgDark ? '!text-white' : ''}
        `}
        style={{
          display: displayGoBack ? 'block' : 'none',
          marginRight: 'auto !important',
        }}
        onClick={handleGoBack}
      >
        <span style={{ transform: 'scale(-1)' }}>← </span>Go back
      </a>

      {showToggleButton && (
        <button onClick={toggleSidebar} className={style.sidebarToggle}>
          {isSidebarOpen ? <FaBars /> : <FaArrowRight />}
          {isSidebarOpen ? (
            ''
          ) : (
            <img
              src="/logo-cube-transparent-bck.png"
              alt="Image 2"
              className="no-fade"
            />
          )}
        </button>
      )}

      <div
        id="home"
        className={`${style.homeMenu} ${
          showHome ? style.showHome : style.hideHome
        }`}
      >
        {showToggleButton ? (
          <a
            href="/dashboard/"
            className={`home ${isBgDark ? '!text-white' : ''}`}
          >
            home
          </a>
        ) : (
          <a
            href="/"
            className={`home ${isBgDark ? '!text-white' : ''}`}
            onClick={() => {
              if (swiperRef?.current) {
                swiperRef?.current.slideTo(0, 500, false);
              }
            }}
          >
            home
          </a>
        )}
        {/* <a
          href="/blvckbox/"
          style={{ display: 'block' }}
          className={`home ${isBgDark ? '!text-white' : ''}`}
        >
          Blvckbox
        </a> */}
        <a
          href="#"
          onClick={openSearchPopup}
          style={{ display: 'block' }}
          className={`home ${isBgDark ? '!text-white' : ''}`}
        >
          <GoSearch />
        </a>

        <span className={`${isBgDark ? 'text-white' : ''}`}>|</span>

        {loggedUser ? (
          <>
            <a
              href="#"
              onClick={openEditProfile}
              className={`home ${isBgDark ? '!text-white' : ''}`}
            >
              {loggedUser?.name
                ? `${loggedUser.name
                    .charAt(0)
                    .toUpperCase()}${loggedUser.name.slice(1)}`
                : ''}
            </a>
          </>
        ) : (
          <a
            href="#"
            onClick={openSignInPopup}
            className={`home ${isBgDark ? '!text-white' : ''}`}
          >
            <Image
              src="/login.png"
              alt="Sign In"
              width={20}
              height={20}
              style={{ display: 'none' }}
            />{' '}
            [ sign in ]
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;

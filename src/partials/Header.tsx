import React, { useState, RefObject } from 'react';
import style from './Header.module.css';
import Image from 'next/image';
import { useAuth } from '../context/AuthProvider';
import { FaBars, FaArrowRight } from 'react-icons/fa';
import { useApp } from '../context/AppProvider';

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
  fixedNav: boolean;
  displayGoBack: boolean;
  toggleSidebar?: () => void;
  showToggleButton?: boolean;
  otherPageHeader?: boolean;
  isSidebarOpen?: boolean;
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
  isSidebarOpen,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { loggedUser } = useAuth();
  const { isBgDark } = useApp();

  return (
    <div
      className={`${style.header} ${invert ? style.invert : ''} ${
        fixedNav ? style.fixed : ''
      }`}
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
            Home
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
            Home
          </a>
        )}
        <a
          href="/blvckbox/"
          style={{ display: 'block' }}
          className={`home ${isBgDark ? '!text-white' : ''}`}
        >
          Blvckbox
        </a>
        <a
          href="#"
          onClick={openSearchPopup}
          style={{ display: 'block' }}
          className={`home ${isBgDark ? '!text-white' : ''}`}
        >
          Search
        </a>

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
            Sign In
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;

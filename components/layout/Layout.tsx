// components/Layout/Layout.tsx
'use client';
import React, { useState } from 'react';
import styles from '../all.module.css';
import Header from '../../src/partials/Header';
import Sidebar from './sidebar/Sidebar';
import SignInPopup from '../../src/auth/popups/SignInPopup';
import SearchPopup from '../../src/popups/SearchPopup';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/context/AuthProvider';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignInPopupVisible, setSignInPopupVisible] = useState(false);
  const [isSearchPopupVisible, setSearchPopupVisible] = useState(false);
  const [isTalentsPopupVisible, setTalentsPopupVisible] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  const openSignInPopup = () => setSignInPopupVisible(true);
  const closeSignInPopup = () => setSignInPopupVisible(false);
  const openSearchPopup = () => setSearchPopupVisible(true);
  const closeSearchPopup = () => setSearchPopupVisible(false);
  const openTalentsPopup = () => setTalentsPopupVisible(true);
  const closeTalentsPopup = () => setTalentsPopupVisible(false);

  const handleEditProfile = () => {
    openSignInPopup();
    setEditProfile(true);
  };

  const handleGoBack = () => {};

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    logout();
    closeSignInPopup();
    setEditProfile(false);
  };

  const handleSignInSuccess = (token: string) => {
    if (token) {
      closeSignInPopup();
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div
        className={styles.mainContent}
        style={{
          marginLeft: isSidebarOpen ? '16rem' : '0',
          width: isSidebarOpen ? '-16rem' : 'auto',
        }}
      >
        <div className={`${styles.header} ${styles.stickyHeader}`}>
          <Header
            toggleSidebar={toggleSidebar}
            openEditProfile={handleEditProfile}
            handleGoBack={handleGoBack}
            openSearchPopup={openSearchPopup}
            openSignInPopup={openSignInPopup}
            displayGoBack={false}
            showHome={true}
            invert={true}
            fixedNav={false}
            showToggleButton={true}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        <main>{children}</main>
        {isSignInPopupVisible && (
          <SignInPopup
            onLoggedOut={handleLogout}
            onClose={closeSignInPopup}
            onSignInSuccess={handleSignInSuccess}
            onEditProfile={editProfile}
          />
        )}
        {isSearchPopupVisible && <SearchPopup onClose={closeSearchPopup} />}
      </div>
    </div>
  );
};

export default Layout;

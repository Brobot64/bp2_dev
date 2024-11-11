import React, { useRef } from 'react';
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import style from './MobileMenu.module.css';

interface MenuPopupProps {
  menus: string[];
  activeMenu: number;
  beforeActiveMenu: number;
  afterActiveMenu: number;
  isMenuPopupVisible: boolean;
  toggleMenuPopup: () => void;
  handleMenuClick: (index: number) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  shouldDisplayMenuButton: boolean;
  invert: boolean;
}

const MobileMenuPopup: React.FC<MenuPopupProps> = ({
  menus,
  activeMenu,
  beforeActiveMenu,
  afterActiveMenu,
  isMenuPopupVisible,
  toggleMenuPopup,
  handleMenuClick,
  menuRef,
  shouldDisplayMenuButton,
  invert
}) => {
  return (
    <>
      <a href='#' className={` ${style.mobileMenu} ${invert ? style.invert : style.invert}`} style={{ display: shouldDisplayMenuButton ? 'block' : 'none'}} id='mobileMenu' onClick={toggleMenuPopup}>
        {isMenuPopupVisible ? <SlArrowUp className={` ${ activeMenu === 5 ? '!text-white' : '!text-black' }`} /> : <SlArrowDown className={` ${ activeMenu === 5 ? '!text-white' : '!text-black' }`}/>}
      </a>
      {isMenuPopupVisible && (
        <div ref={menuRef} className={`${style.popupContainer} ${invert ? style.invert : ''}`}>
        <div className={` ${style.popup} ${style.talents}`}>
            <div className={`${style.menuPopup} ${style.menuItems}`} id='menu-items'>
              <ul>
                {menus.map((menu, index) => (
                 <a
                 href='#'
                 key={index}
                 id={`menu-item-${index}`}
                 onClick={() => handleMenuClick(index)}
                 className={
                   activeMenu === index
                     ? style.active
                     : beforeActiveMenu === index
                     ? style.bactive
                     : afterActiveMenu === index
                     ? style.bactive
                     : ''
                 }
               >
                 {menu}
               </a>               
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenuPopup;

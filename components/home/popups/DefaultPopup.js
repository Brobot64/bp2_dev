import React from 'react';
import './Popup.css';
import { RiTwitterXLine } from "react-icons/ri";
import { RiInstagramLine } from "react-icons/ri";
import { RiLinkedinLine } from "react-icons/ri";

const DefaultPopup = ({ title, desc, backgroundImage, onClose }) => {

  const headerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: 'center'
  };

  return (
    <div className="popup-container">
      <div className="popup default">
        <div style={headerStyle} className="header">
          <h2 style={{display: 'none'}}>{title}</h2>
        </div>
        <div className='desc'>
        <div dangerouslySetInnerHTML={{ __html: desc }} />
          <ul>
          <li>
              <a href='https://www.linkedin.com/company/blvckpixel/' target='_blank'>
              <RiLinkedinLine />

              </a>
            </li>
          <li>
              <a href='https://x.com/blvck_pixel?s=21&t=36xMYPaBwcR-VBWxhM3eqw' target='_blank'>
                <RiTwitterXLine />
              </a>
            </li>
            <li>
              <a href='https://www.instagram.com/_blvckpixel_?igsh=MzhjNno0ZGhtZDZo' target='_blank'>
                <RiInstagramLine />
              </a>
            </li>
           
          </ul>
        </div>
        <button className='close' onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default DefaultPopup;

import React from 'react';
import style from './Footer.module.css'; 

const Footer: React.FC = () => {
  return (
    <div className={style.footer}>
      {/* <a href='#'>BLVCKBOOK</a>
      <a href='#'>the foresight journal. </a> */}
      <span style={{ display: 'flex' }}>
        ©2024 by BLVCK
        <span className={style.italics} style={{ padding: 0 }}>
          PIXEL
        </span>{" "}
        . All Rights Reserved.
      </span>
    </div>
  );
};

export default Footer;

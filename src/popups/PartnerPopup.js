import React, { useEffect } from 'react';
import style from './PartnerPopup.module.css';

const PartnerPopup = ({ onClose, pic = '/banner1.jpg', details = 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' }) => {

  return (
    <div className={style.popupContainer}>
      <div className={` ${style.popup} ${style.talents} `}>
        <div className={`${style.mainhub}`}>
            <img src={pic}/>
            <div className={`${style.texties}`}>
                <span> <h2>[ partner name ]</h2> &nbsp; &nbsp; <h2 className='italic capitalize text-[#DD47F7]'>partnership type</h2> </span>
                <p>
                { details }
                </p>
            </div>
        </div>
        <button className={`${style.close}`} onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default PartnerPopup;

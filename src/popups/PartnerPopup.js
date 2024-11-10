import React, { useEffect, useRef } from 'react';
import style from './PartnerPopup.module.css';

const PartnerPopup = ({ onClose, pic}) => {
  const mainRef = useRef(null);

  useEffect(() => {
    function handleClickOut(e) {
      if (mainRef.current && !mainRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOut);

    return () => {
      document.removeEventListener('mousedown', handleClickOut);
    };
  }, [mainRef]);

// , &apos;

  return (
    <div className={style.popupContainer}>
      <div className={` ${style.popup} ${style.talents} `} ref={mainRef}>
        <div className={`${style.mainhub}`}>
            <img src={pic.src}/>
            <div className={`${style.texties}`}>
                <span> <h2> [ {pic.name} ] </h2> &nbsp; &nbsp; <h2 className='italic capitalize text-[#DD47F7]'>partnership type</h2> </span>
                <p className='demi'>
                { pic.details }
                </p>
            </div>
        </div>
        <button className={`${style.close}`} onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default PartnerPopup;

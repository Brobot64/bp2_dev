import React, { useEffect, useRef } from 'react';
import style from './PartnerPopup.module.css';


const BackgroundImageComponent = ({src}) => {
  return (
    <div
      className='tumbukh absolute'
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        top: 0,
        width: '100%',
        height: '60%',
        position: 'absolute'
      }}
    />
  );
};




const PartnerPopup = ({ onClose, pic}) => {
  const mainRef = useRef(null);

  const headerStyle = {
    backgroundImage: `url(${pic.src})`,
    top: 0,
    width: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: 'center'
  };

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
            {/* <div className='tumbukh absolute' style={{ backgroundImage:`url(/AlineReiniche(6).png)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionY: 'center', top: 0, width: '100%', height: '60%'}}/> */}
            <BackgroundImageComponent src={pic.src}/>
            <div className={`${style.texties}`}>
                <span> <h2> [ {pic.name} ] </h2> <h2 className='italic capitalize text-[#DD47F7]'>partnership type</h2> </span>
                <p className='demi' style={{ whiteSpace: 'break-spaces' }}>
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

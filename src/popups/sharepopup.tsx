import React from 'react';
import {
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
} from 'react-icons/ri';
import './Popup.css';

function Sharepopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="popup-container black">
      <div className="popup default !h-fit">
        <div className="desc">
          <h4 className="text-2xl">Interesting discovery ?</h4>
          <p>Select where you want to share ...</p>
          {/* <div dangerouslySetInnerHTML={{ __html: desc }} /> */}
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/company/blvckpixel/"
                target="_blank"
              >
                <RiLinkedinLine />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/blvck_pixel?s=21&t=36xMYPaBwcR-VBWxhM3eqw"
                target="_blank"
              >
                <RiTwitterXLine />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/_blvckpixel_?igsh=MzhjNno0ZGhtZDZo"
                target="_blank"
              >
                <RiInstagramLine />
              </a>
            </li>
          </ul>
        </div>
        <button className="close !text-black" onClick={onClose}>
          x
        </button>
      </div>
    </div>
  );
}

export default Sharepopup;

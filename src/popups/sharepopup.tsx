import React, { useEffect } from 'react';
import {
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
} from 'react-icons/ri';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import './Popup.css';

interface SharePopupProps {
  onClose: () => void;
  post: {
    title: string;
    slug: string;
    description: string;
    meta_keywords: string;
    images: Array<{ id: number; image_path: string; type: string }>;
  };
}

function Sharepopup({ onClose, post }: SharePopupProps) {

  const baseUrl = `${process.env.NEXT_WEBSITE_URL}` || 'https://bp2-dev.vercel.app/'
  const shareUrl = `${baseUrl}${post.slug}`;
  const hashtags = post.meta_keywords.split(',').map((tag) => tag.trim());
  const previewImage = post.images.length > 0 ? post.images[0].image_path : '';

  useEffect(() => {
    console.log('shareurl: ', shareUrl)
  }, [])
  


  return (
    <div className="popup-container black">
      <div className="popup default !h-fit">
        <div className="desc">
          <h4 className="text-2xl">Interesting discovery?</h4>
          <p>Select where you want to share...</p>

          <ul className="share-list">
            {/* Facebook */}
            <li>
              <FacebookShareButton url={shareUrl} hashtag={`#${hashtags[0]}`}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
            </li>

            {/* LinkedIn */}
            <li>
              <LinkedinShareButton url={shareUrl} title={post.title} summary={post.description}>
                <LinkedinIcon size={32} round={true} />
              </LinkedinShareButton>
            </li>

            {/* Twitter */}
            <li>
              <TwitterShareButton url={shareUrl} title={post.title}>
              {/* hashtags={hashtags} */}
                <XIcon size={32} round={true} />
              </TwitterShareButton>
            </li>

            <li>
              <WhatsappShareButton url={shareUrl} title={post.title} htmlTitle={post.title}>
                <WhatsappIcon size={32} round={true}/>
              </WhatsappShareButton>
            </li>

            {/* Instagram (Note: Instagram does not support direct share via web) */}
            <li>
              <a
                href="https://www.instagram.com/_blvckpixel_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiInstagramLine size={32} />
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

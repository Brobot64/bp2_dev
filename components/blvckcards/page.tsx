'use client';
import React, { useState } from 'react';
import Slider, { Settings as SliderSettings } from 'react-slick';
import Link from 'next/link';
import style from './page.module.css';
import { FaShareAlt } from 'react-icons/fa';
import ShareModal from '../../app/blvckbox/[slug]/[newSlug]/ShareModal';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface MediaProps {
  type: 'image' | 'video';
  src: string;
}

interface CardProps {
  title: string;
  blvckboxSlug: string;
  contentcardSlug: string;
  slug: string;
  date: string;
  desc: string;
  media: MediaProps[];
}

const BlvckCards: React.FC<CardProps> = ({ title, slug, blvckboxSlug, contentcardSlug, date, desc, media }) => {
  const [currentShareData, setCurrentShareData] = useState<{ url: string; title: string; desc: string } | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const settings = {
    dots: true,
    dotsClass: `slick-dots ${style['custom-dots']}`,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const openShareModal = (e: React.MouseEvent<HTMLButtonElement>, url: string, title: string, desc: string) => {
    e.preventDefault()
    setCurrentShareData({ url, title, desc });
    setModalOpen(true);
  };

  const closeShareModal = () => setModalOpen(false);

  const copyPath = `/blvckbox/${blvckboxSlug}/${contentcardSlug}/${slug}`;
  const dynamicPath = `/blvckbox/${blvckboxSlug}/${contentcardSlug}/${slug}`;


  return (
    <Link href={dynamicPath} passHref>
      <div className={style.cardsContainer}>
        <div className={`${style.snippet} ${style.wrapper}`}>
          <div className={`${style.carouselContainer}`}>
            <Slider {...settings}>
              {media.map((mediaItem, index) => (
                <div className={`item ${style.item}`} key={index}>
                  {mediaItem.type === 'image' ? (
                    <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/${mediaItem.src}`} alt={title} />
                  ) : (
                    <video
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${mediaItem.src}`}
                      controls={false}
                      autoPlay
                      loop
                      muted
                    />
                  )}
                </div>
              ))}
            </Slider>
          </div>

          <div className={`${style.textContent} ${style.snippetTextContent}`}>
            <div className={style.title}>
              <h1 className={style.snippetTitle}>{title}</h1>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openShareModal(e, dynamicPath, title, desc);
                }}
              >
                <FaShareAlt /> Share
              </button>
            </div>
            <div className={style.desc} dangerouslySetInnerHTML={{ __html: desc }} />
          </div>
        </div>

        {currentShareData && (
          <ShareModal
            isOpen={modalOpen}
            onClose={closeShareModal}
            url={copyPath}
            title={currentShareData.title}
            desc={currentShareData.desc}
          />
        )}
      </div>
    </Link>
  );
};

export default BlvckCards;

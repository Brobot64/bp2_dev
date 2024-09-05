import React from 'react';
import style from './box.module.css';

interface BoxProps {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  background?: string;
  onClick: (slug: string) => void;
}

const Page: React.FC<BoxProps> = ({ id, slug, title, subtitle, description, date, background, onClick }) => {
  const maxLength = 100;
  // const truncatedDescription = description.length > maxLength 
  //   ? `${description.substring(0, maxLength)}...` 
  //   : description;

  return (
    <div className={style.box} onClick={() => onClick(slug)}>
      {background ? (
        <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${background}`} alt={title} />
      ) : (
        <div className={style.placeholder}>No Image Available</div>
      )}
      <div className={style.boxHeader}>
        <h2>{title}</h2>
        <p className={style.subtitle}>{subtitle}</p>
      </div>
      <div className={style.boxFooter}>
        {/* <p className={style.description}>{truncatedDescription}</p> */}
        <p className={style.date}>{date}</p>
      </div>
    </div>
  );
};

export default Page;

import React from 'react';
import Link from 'next/link';
import { SwiperSlide } from 'swiper/react';

interface SwiperSlideProps {
  imageUrl: string;
  title: string;
  description: string;
}

const SwiperSlideComponent: React.FC<SwiperSlideProps> = ({ imageUrl, title, description }) => (
  <SwiperSlide className="slide">
    <div
      style={{
        backgroundImage: `url('/${imageUrl}')`,
      }}
      className="flex flex-col justify-center p-10 bg-cover object-contain h-screen w-screen"
    >
      <h1 className="">{title}</h1>
      <h3 className="">{description}</h3>
      <h5 className="">
        <Link href='/'>→ Click [here] </Link> to read the journal
      </h5>
    </div>
  </SwiperSlide>
);

export default SwiperSlideComponent;

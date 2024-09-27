import React from 'react'
import BlvckCardDetail from '@components/dashboard/contentcards/Fundz'
import { useParams } from 'next/navigation';
import { Metadata } from 'next';
import axios from 'axios';


interface MediaProps {
  id: number;
  blvckcard_id: number;
  image_path: string;
  created_at: string;
  updated_at: string;
}

interface BlvckCard {
  id: number;
  title: string;
  slug: string;
  description: string;
  teaser_description: string | null;
  date: string;
  blvckbox_id: number;
  contentcard_id: number;
  user_id: number | null;
  created_at: string;
  updated_at: string;
  meta_keywords: string | null;
  images: MediaProps[];
}

export async function generateMetadata({ params }: { params: { edition: string, content: string, slug: string } }): Promise<Metadata> {
  // const params = useParams<{
  //   slug: string;
  //   edition: string;
  //   content: string;
  // }>();
  // const edition = params?.edition || '';
  const { edition } = params;

  // Fetch the card details based on slug
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/${edition}`);
  const fashst = response.data.data;

  const indexTime = fashst.findIndex(
    (card: BlvckCard) => card.slug === params.content
  );

  const blvckCard: BlvckCard = fashst[indexTime];

  // Set up the dynamic metadata using the fetched data
  return {
    title: blvckCard.title,
    description: blvckCard.teaser_description || blvckCard.description,
    keywords: blvckCard.meta_keywords || '',
    openGraph: {
      type: 'article',
      title: blvckCard.title,
      description: blvckCard.teaser_description || blvckCard.description,
      siteName: "BLVCKPIXEL",
      images: blvckCard.images.map(image => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${image.image_path}`,
        width: 800,
        height: 600,
      })),
    },
  };
}

const page = () => {
  return (
    <BlvckCardDetail/>
  )
}

export default page
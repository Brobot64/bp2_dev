import { Metadata } from 'next';

interface Params {
  slug: string;
  newSlug: string;
  blvckcard: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { blvckcard, slug, newSlug } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/show/${blvckcard}`);
  const blvckCard = await res.json();
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${blvckCard.images[0]?.image_path}`;

  return {
    title: blvckCard.title,
    description: blvckCard.description,
    openGraph: {
      type: 'website',
      title: blvckCard.title,
      description: blvckCard.description,
      images: [imageUrl],
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blvckbox/${slug}/${newSlug}/${blvckcard}`,
      siteName: 'Blvckpixel',
    },
    twitter: {
      card: 'summary_large_image',
      title: blvckCard.title,
      description: blvckCard.description,
      images: [imageUrl],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
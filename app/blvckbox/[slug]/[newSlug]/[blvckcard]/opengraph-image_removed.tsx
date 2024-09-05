import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const contentType = 'image/jpg';

export const size = {
  width: 1200,
  height: 630,
};

export default async function OpenGraphImage({
  params,
}: {
  params: { blvckcard: string };
}) {
  const blvckcard = params.blvckcard;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blvckcards/show/${blvckcard}`);
  const blvckCard = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>{blvckCard.title}</div>
        <div style={{ fontSize: 24 }}>{blvckCard.description}</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
'use client'
import JournalSharedPage from '@shared/journal';
import { Metadata } from 'next';
import { useParams } from 'next/navigation';
import React from 'react';

// export const metadata: Metadata = {
//   title: 'Journal',
//   description: 'Journal description',
// };

export default function JournalPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  return <JournalSharedPage slug={slug}/>;
}

'use client'
import SharedJournalEditionPage from '@shared/journal/edition';
import { Metadata } from 'next';
import React from 'react';
import { useParams } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Journal Edition',
//   description: 'Journal Edition description',
// };

export default function JournalEditionPage() {
  const params = useParams<{ slug: string; edition: string }>();
  const { slug, edition } = params;
  return <SharedJournalEditionPage slug={slug} edition={edition} />;
}

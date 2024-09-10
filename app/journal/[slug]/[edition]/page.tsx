import SharedJournalEditionPage from '@shared/journal/edition';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Journal Edition',
  description: 'Journal Edition description',
};

export default function JournalEditionPage() {
  return <SharedJournalEditionPage />;
}

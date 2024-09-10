import JournalSharedPage from '@shared/journal';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Journal description',
};

export default function JournalPage() {
  return <JournalSharedPage />;
}

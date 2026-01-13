'use client';

import { useParams } from 'next/navigation';
import CommunityPageClient from './CommunityPageClient';

export default function CommunityPage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return null;
  }

  return <CommunityPageClient slug={slug} />;
}

'use client';

import { useParams } from 'next/navigation';
import CommunityPageClient from './CommunityPageClient';

// Required for Cloudflare Pages edge runtime
export const runtime = 'edge';

export default function CommunityPage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    return null;
  }

  return <CommunityPageClient slug={slug} />;
}

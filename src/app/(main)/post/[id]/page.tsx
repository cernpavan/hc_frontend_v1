'use client';

import { useParams } from 'next/navigation';
import PostDetailClient from './PostDetailClient';

// Required for Cloudflare Pages edge runtime
export const runtime = 'edge';

export default function PostDetail() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return null;
  }

  return <PostDetailClient id={id} />;
}

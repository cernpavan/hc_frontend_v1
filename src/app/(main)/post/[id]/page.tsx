'use client';

import { useParams } from 'next/navigation';
import PostDetailClient from './PostDetailClient';

export default function PostDetail() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return null;
  }

  return <PostDetailClient id={id} />;
}

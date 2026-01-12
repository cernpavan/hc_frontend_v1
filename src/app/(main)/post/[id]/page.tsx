import type { Metadata } from 'next';
import PostDetailClient from './PostDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Basic SEO metadata - in production, you could fetch post data here
  return {
    title: `Confession #${id.slice(-6)}`,
    description: 'Read this anonymous confession on Hindi Confession - a safe space for sharing secrets.',
    openGraph: {
      title: 'Anonymous Confession | Hindi Confession',
      description: 'Read this anonymous confession and share your thoughts.',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: 'Anonymous Confession | Hindi Confession',
      description: 'Read this anonymous confession and share your thoughts.',
    },
  };
}

export default async function PostDetail({ params }: PageProps) {
  const { id } = await params;
  return <PostDetailClient id={id} />;
}

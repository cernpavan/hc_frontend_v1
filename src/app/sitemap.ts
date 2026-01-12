import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hindiconfession.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // In production, you would fetch recent posts from the API
  // and add them to the sitemap dynamically
  // For now, we'll return just the static pages

  // Example of how to add dynamic posts (uncomment when API is available):
  /*
  try {
    const response = await fetch(`${process.env.API_URL}/posts/sitemap`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const posts = await response.json();

    const postPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
      url: `${BASE_URL}/post/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...postPages];
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error);
    return staticPages;
  }
  */

  return staticPages;
}

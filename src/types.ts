import { MarkdownHeading } from 'astro';
import { AstroComponentFactory } from 'astro/dist/runtime/server';

export interface Post {
  id: string;
  slug: string;

  publishDate: Date;
  title: string;
  description?: string;

  image?: string;

  canonical?: string | URL;
  permalink?: string;

  draft?: boolean;

  excerpt?: string;
  category?: string;
  tags?: Array<string>;
  author?: string;

  // Content: unknown;
  content?: string;
  minutesRead?: number;
  render?: () => Promise<{
    Content: AstroComponentFactory;
    headings: MarkdownHeading[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remarkPluginFrontmatter: Record<string, any>;
  }>;
}

export interface MetaSEO {
  title?: string;
  description?: string;
  image?: string;

  canonical?: string | URL;
  noindex?: boolean;
  nofollow?: boolean;

  ogTitle?: string;
  ogType?: string;
}

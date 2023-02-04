import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';

import AutoImport from 'astro-auto-import';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGFM from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
import { astroCodeSnippets, codeSnippetAutoImport } from './integrations/astro-code-snippets';
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs';
import { autolinkConfig } from './plugins/rehype-autolink-config';
// import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { theme } from './syntax-highlighting-theme';


import { SITE } from './src/config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  SITE.googleAnalyticsId ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    // AutoImport({
		// 	imports: [asideAutoImport, codeSnippetAutoImport],
		// }),
    tailwind({
      config: {
        applyBaseStyles: false,
        
      },
    }),
    // astroAsides(),
		// astroCodeSnippets(),
    sitemap(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    mdx(),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: false,

      logger: 1,
    }),
  ],

  markdown: {
    // both aside and code-snippet plugins doesn't work correctly, reimplement with tailwind later?
		syntaxHighlight: 'shiki',
		shikiConfig: { theme },
		remarkPlugins: [
			// These are here because setting custom plugins disables the default plugins
			remarkGFM,
			[remarkSmartypants, { dashes: false }],
      // This adds reading time to frontmatter
      readingTimeRemarkPlugin,
		],
		rehypePlugins: [
			// This adds links to headings
      rehypeSlug,
			[rehypeAutolinkHeadings, autolinkConfig],
		],
	},

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});

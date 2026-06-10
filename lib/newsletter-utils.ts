import { toHTML } from '@portabletext/to-html';
import { urlFor } from './sanity';

export function transformPortableTextToEmailHtml(portableText: any[]) {
  if (!portableText || !Array.isArray(portableText)) return '';

  return toHTML(portableText, {
    components: {
      types: {
        image: ({ value }: any) => {
          if (!value?.asset) return '';
          const imageUrl = urlFor(value).width(600).url();
          return `<div style="margin: 20px 0; text-align: center;">
            <img src="${imageUrl}" alt="${value.alt || ''}" style="max-width: 100%; height: auto; border-radius: 8px;" />
            ${value.alt ? `<p style="font-size: 12px; color: #666; margin-top: 8px;">${value.alt}</p>` : ''}
          </div>`;
        },
      },
      block: {
        h1: ({ children }) => `<h1 style="font-size: 24px; color: #1A4132; margin-top: 30px; margin-bottom: 15px; font-family: serif;">${children}</h1>`,
        h2: ({ children }) => `<h2 style="font-size: 20px; color: #1A4132; margin-top: 25px; margin-bottom: 12px; font-family: serif;">${children}</h2>`,
        h3: ({ children }) => `<h3 style="font-size: 18px; color: #1A4132; margin-top: 20px; margin-bottom: 10px; font-family: serif;">${children}</h3>`,
        normal: ({ children }) => `<p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 15px;">${children}</p>`,
        blockquote: ({ children }) => `<blockquote style="border-left: 4px solid #E8D7B5; padding-left: 15px; margin: 20px 0; font-style: italic; color: #1A4132;">${children}</blockquote>`,
      },
      marks: {
        strong: ({ children }) => `<strong>${children}</strong>`,
        em: ({ children }) => `<em>${children}</em>`,
        link: ({ children, value }) => `<a href="${value.href}" style="color: #7BA3B8; text-decoration: underline;">${children}</a>`,
      },
      list: {
        bullet: ({ children }) => `<ul style="margin-bottom: 15px; padding-left: 20px;">${children}</ul>`,
        number: ({ children }) => `<ol style="margin-bottom: 15px; padding-left: 20px;">${children}</ol>`,
      },
      listItem: {
        bullet: ({ children }) => `<li style="margin-bottom: 5px; color: #333;">${children}</li>`,
        number: ({ children }) => `<li style="margin-bottom: 5px; color: #333;">${children}</li>`,
      },
    },
  });
}

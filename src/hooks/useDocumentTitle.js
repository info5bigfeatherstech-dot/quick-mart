import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title and optional meta description
 * @param {string} title
 * @param {string} [description]
 */
export const useDocumentTitle = (title, description) => {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (metaDesc && previousDesc) {
        metaDesc.setAttribute('content', previousDesc);
      }
    };
  }, [title, description]);
};

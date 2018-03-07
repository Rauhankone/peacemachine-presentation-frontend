import nanoid from 'nanoid';
import _ from 'lodash';

export const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const capitalize = string => {
  let words = string
    .trim()
    .split(' ')
    .filter(Boolean);

  if (string == null) {
    return '';
  } else if (words.length > 1) {
    return words
      .map(s => {
        return capitalize(s);
      })
      .join(' ');
  } else {
    return (
      string
        .trim()
        .toLowerCase()
        .charAt(0)
        .toUpperCase() +
      string
        .trim()
        .slice(1)
        .toLowerCase()
    );
  }
};

/**
 *
 * @param {number} wordAmount the amount of desired words
 */
export const generateFakeChannelData = wordAmount =>
  Array.from(new Array(wordAmount), (el, i) => {
    return {
      transcript: `${nanoid()}. `,
      confidence: Math.random()
    };
  });

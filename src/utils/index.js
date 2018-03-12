import * as Sentencer from 'sentencer';
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
 * @param {number} numOfData the amount of desired words
 */
export const generateFakeChannelData = numOfData =>
  Array.from(new Array(numOfData), (el, i) => {
    return {
      transcript: Sentencer.make(
        _.sample([
          'Sometimes the {{ nouns }} act all {{ adjective }}. ',
          'In {{ an_adjective }} world the {{ nouns }} act all {{ adjective }}. ',
          'I wish I had {{ an_adjective }} {{ noun }}. ',
          "That's {{ adjective }}. ",
          'Where did all the {{ nouns }} go. ',
          '{{ an_adjective }} {{ noun }} jumped over the {{ adjective }} {{ noun }}. ',
          'This {{ adjective }} {{ noun }} is handy for very specific situations. '
        ])
      ),
      confidence: Math.random()
    };
  });

export const stringifyToneScore = score => {
  if (score >= 1) return 'very high';

  if (score > 0.8) return 'high';

  if (score > 0.75) return 'avarage';

  if (score > 0.5) return 'low';

  if (score > 0.15) return 'very low';

  return 'N/A';
};

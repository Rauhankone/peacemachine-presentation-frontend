import * as Sentencer from 'sentencer';
import KeywordExtractor from 'keyword-extractor';
import _ from 'lodash';

/* eslint-disable */
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
          "Mister and missus {{ noun }} didn't quite understand the meaning behind the {{ adjective }} message. ",
          'This {{ adjective }} {{ noun }} is handy for very specific situations. ',
          'Please fix your {{ nouns }}. ',
          'These {{ adjective }} {{ nouns }} are not meant for {{ noun }}. ',
          'Well, there is your {{ adjective }} {{ noun }}. ',
          'Take this {{ noun }}, and shove it. ',
          'Do not be so {{ adjective }}. ',
          'You claim to be {{ adjective }}, but you are {{ an_adjective }} hypocrite. ',
          'There is a fine line between {{ a_noun }} and {{ a_noun }}. ',
          'Being {{ adjective }} is very different from being {{ adjective }}. ',
          'Sometimes {{ a_noun }} is just {{ a_noun }}. ',
          'I am very scared of {{ adjective }} {{ nouns }}. ',
          'This {{ adjective }} {{ noun }} is gross. ',
          'Huzzah, I finally got my {{ adjective }} {{ noun }}. ',
          'Getting {{ a_noun }} is too difficult. ',
          'You are a rotten {{ noun }}. ',
          'Go ahead, make my {{ noun }}. ',
          'Making {{ nouns }} is harder than making {{ nouns }}. ',
          'Efforts and {{ noun }} is not enough without {{ noun }} and {{ noun }}. ',
          'I am {{ an_adjective }} {{ noun }}. ',
          'Being {{ adjective }} is {{ adjective }}. ',
          'Oh why, oh why did my {{ noun }} have to be so {{ adjective }}. ',
          "My, my, aren't you {{ an_adjective }} {{ noun }}. ",
          'Today, {{ an_adjective }} {{ noun }} went to {{ an_adjective }} {{ noun }}. ',
          'We use {{ nouns }} with {{ an_adjective }} {{ noun }}. ',
          'The {{ nouns }} create {{ an_adjective }} {{ noun }}. ',
          'We must use {{ adjective }} {{ nouns }}. ',
          'Turn off that {{ adjective }} racket right now. ',
          "We can't idle while the {{ nouns }} are attacking the {{ nouns }}. ",
          "****. "
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

export function genTopWords(transcripts) {
  const sentenceTranscripts = _.map(
    transcripts,
    sentence => sentence.transcript
  );
  const fullText = _.join(sentenceTranscripts, ' ').toLowerCase();
  const words = _.words(fullText, /[^,. ]+/g);
  const keywords = KeywordExtractor.extract(fullText, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });
  const freqs = _.map(keywords, kw =>
    _.reduce(words, (freq, w) => (w === kw ? freq + 1 : freq), 0)
  );
  const topWords = _.reverse(
    _.slice(
      _.sortBy(
        _.map(keywords, (w, i) => ({
          word: w,
          freq: freqs[i]
        })),
        'freq'
      ),
      -10
    )
  );
  return topWords;
}

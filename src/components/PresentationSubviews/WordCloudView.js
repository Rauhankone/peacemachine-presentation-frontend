import React from 'react';
import WordCloud from 'react-d3-cloud';
import * as d3 from 'd3';
import KeywordExtractor from 'keyword-extractor';

let json = JSON.parse(
  `
{
  "document_tone": {
    "tones": [
      {
        "score": 0.657094,
        "tone_id": "joy",
        "tone_name": "Joy"
      },
      {
        "score": 0.793496,
        "tone_id": "analytical",
        "tone_name": "Analytical"
      },
      {
        "score": 0.578571,
        "tone_id": "tentative",
        "tone_name": "Tentative"
      }
    ]
  },
  "sentences_tone": [
    {
      "sentence_id": 0,
      "text": "Let no one be surprised if, in speaking of entirely new principalities as I shall do, I adduce the highest examples both of prince and of state; because men, walking almost always in paths beaten by others, and following by imitation their deeds, are yet unable to keep entirely to the ways of others or attain to the power of those they imitate.",
      "tones": [

      ]
    },
    {
      "sentence_id": 1,
      "text": "A wise man ought always to follow the paths beaten by great men, and to imitate those who have been supreme, so that if his ability does not equal theirs, at least it will savour of it.",
      "tones": [
        {
          "score": 0.752031,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.724236,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 2,
      "text": "Let him act like the clever archers who, designing to hit the mark which yet appears too far distant, and knowing the limits to which the strength of their bow attains, take aim much higher than the mark, not to reach by their strength or arrow to so great a height, but to be able with the aid of so high an aim to hit the mark they wish to reach.I say, therefore, that in entirely new principalities, where there is a new prince, more or less difficulty is found in keeping them, accordingly as there is more or less ability in him who has acquired the state.",
      "tones": [
        {
          "score": 0.605092,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.56587,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 3,
      "text": "Now, as the fact of becoming a prince from a private station presupposes either ability or fortune, it is clear that one or other of these things will mitigate in some degree many difficulties.",
      "tones": [
        {
          "score": 0.726203,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 4,
      "text": "Nevertheless, he who has relied least on fortune is established the strongest.",
      "tones": [
        {
          "score": 0.587791,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.890188,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 5,
      "text": "Further, it facilitates matters when the prince, having no other state, is compelled to reside there in person.But to come to those who, by their own ability and not through fortune, have risen to be princes, I say that Moses, Cyrus, Romulus, Theseus, and such like are the most excellent examples.",
      "tones": [
        {
          "score": 0.578073,
          "tone_id": "joy",
          "tone_name": "Joy"
        }
      ]
    },
    {
      "sentence_id": 6,
      "text": "And although one may not discuss Moses, he having been a mere executor of the will of God, yet he ought to be admired, if only for that favour which made him worthy to speak with God.",
      "tones": [
        {
          "score": 0.581372,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.537979,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 7,
      "text": "But in considering Cyrus and others who have acquired or founded kingdoms, all will be found admirable; and if their particular deeds and conduct shall be considered, they will not be found inferior to those of Moses, although he had so great a preceptor.",
      "tones": [
        {
          "score": 0.598179,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.830561,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 8,
      "text": "And in examining their actions and lives one cannot see that they owed anything to fortune beyond opportunity, which brought them the material to mould into the form which seemed best to them.",
      "tones": [
        {
          "score": 0.771422,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.541591,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        },
        {
          "score": 0.599484,
          "tone_id": "tentative",
          "tone_name": "Tentative"
        }
      ]
    },
    {
      "sentence_id": 9,
      "text": "Without that opportunity their powers of mind would have been extinguished, and without those powers the opportunity would have come in vain.It was necessary, therefore, to Moses that he should find the people of Israel in Egypt enslaved and oppressed by the Egyptians, in order that they should be disposed to follow him so as to be delivered out of bondage.",
      "tones": [
        {
          "score": 0.824153,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 10,
      "text": "It was necessary that Romulus should not remain in Alba, and that he should be abandoned at his birth, in order that he should become King of Rome and founder of the fatherland.",
      "tones": [
        {
          "score": 0.78314,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 11,
      "text": "It was necessary that Cyrus should find the Persians discontented with the government of the Medes, and the Medes soft and effeminate through their long peace.",
      "tones": [
        {
          "score": 0.578669,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.509368,
          "tone_id": "confident",
          "tone_name": "Confident"
        }
      ]
    },
    {
      "sentence_id": 12,
      "text": "Theseus could not have shown his ability had he not found the Athenians dispersed.",
      "tones": [
        {
          "score": 0.560098,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        },
        {
          "score": 0.681699,
          "tone_id": "tentative",
          "tone_name": "Tentative"
        }
      ]
    },
    {
      "sentence_id": 13,
      "text": "These opportunities, therefore, made those men fortunate, and their high ability enabled them to recognize the opportunity whereby their country was ennobled and made famous.Those who by valorous ways become princes, like these men, acquire a principality with difficulty, but they keep it with ease.",
      "tones": [
        {
          "score": 0.634795,
          "tone_id": "joy",
          "tone_name": "Joy"
        },
        {
          "score": 0.716804,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 14,
      "text": "The difficulties they have in acquiring it rise in part from the new rules and methods which they are forced to introduce to establish their government and its security.",
      "tones": [
        {
          "score": 0.716569,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 15,
      "text": "And it ought to be remembered that there is nothing more difficult to take in hand, more perilous to conduct, or more uncertain in its success, than to take the lead in the introduction of a new order of things, because the innovator has for enemies all those who have done well under the old conditions, and lukewarm defenders in those who may do well under the new.",
      "tones": [
        {
          "score": 0.697651,
          "tone_id": "joy",
          "tone_name": "Joy"
        }
      ]
    },
    {
      "sentence_id": 16,
      "text": "This coolness arises partly from fear of the opponents, who have the laws on their side, and partly from the incredulity of men, who do not readily believe in new things until they have had a long experience of them.",
      "tones": [
        {
          "score": 0.755995,
          "tone_id": "fear",
          "tone_name": "Fear"
        }
      ]
    },
    {
      "sentence_id": 17,
      "text": "Thus it happens that whenever those who are hostile have the opportunity to attack they do it like partisans, whilst the others defend lukewarmly, in such wise that the prince is endangered along with them.It is necessary, therefore, if we desire to discuss this matter thoroughly, to inquire whether these innovators can rely on themselves or have to depend on others: that is to say, whether, to consummate their enterprise, have they to use prayers or can they use force?",
      "tones": [
        {
          "score": 0.759979,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 18,
      "text": "In the first instance they always succeed badly, and never compass anything; but when they can rely on themselves and use force, then they are rarely endangered.",
      "tones": [
        {
          "score": 0.724236,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 19,
      "text": "Hence it is that all armed prophets have conquered, and the unarmed ones have been destroyed.",
      "tones": [
        {
          "score": 0.704642,
          "tone_id": "confident",
          "tone_name": "Confident"
        },
        {
          "score": 0.762356,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 20,
      "text": "Besides the reasons mentioned, the nature of the people is variable, and whilst it is easy to persuade them, it is difficult to fix them in that persuasion.",
      "tones": [
        {
          "score": 0.687768,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    },
    {
      "sentence_id": 21,
      "text": "And thus it is necessary to take such measures that, when they believe no longer, it may be possible to make them believe by force.If Moses, Cyrus, Theseus, and Romulus had been unarmed they could not have enforced their constitutions for long\u2014as happened in our time to Fra Girolamo Savonarola, who was ruined with his new order of things immediately the multitude believed in him no longer, and he had no means of keeping steadfast those who believed or of making the unbelievers to believe.",
      "tones": [
        {
          "score": 0.765702,
          "tone_id": "tentative",
          "tone_name": "Tentative"
        }
      ]
    },
    {
      "sentence_id": 22,
      "text": "Therefore such as these have great difficulties in consummating their enterprise, for all their dangers are in the ascent, yet with ability they will overcome them; but when these are overcome, and those who envied them their success are exterminated, they will begin to be respected, and they will continue afterwards powerful, secure, honoured, and happy.To these great examples I wish to add a lesser one; still it bears some resemblance to them, and I wish it to suffice me for all of a like kind: it is Hiero the Syracusan.(*)",
      "tones": [
        {
          "score": 0.794081,
          "tone_id": "joy",
          "tone_name": "Joy"
        }
      ]
    },
    {
      "sentence_id": 23,
      "text": "This man rose from a private station to be Prince of Syracuse, nor did he, either, owe anything to fortune but opportunity; for the Syracusans, being oppressed, chose him for their captain, afterwards he was rewarded by being made their prince.",
      "tones": [

      ]
    },
    {
      "sentence_id": 24,
      "text": "He was of so great ability, even as a private citizen, that one who writes of him says he wanted nothing but a kingdom to be a king.",
      "tones": [
        {
          "score": 0.694922,
          "tone_id": "joy",
          "tone_name": "Joy"
        }
      ]
    },
    {
      "sentence_id": 25,
      "text": "This man abolished the old soldiery, organized the new, gave up old alliances, made new ones; and as he had his own soldiers and allies, on such foundations he was able to build any edifice: thus, whilst he had endured much trouble in acquiring, he had but little in keeping.",
      "tones": [
        {
          "score": 0.632275,
          "tone_id": "analytical",
          "tone_name": "Analytical"
        }
      ]
    }
  ]
}
`
);

let fullText = json.sentences_tone.map(w => w.text).join(` `);
let words = fullText.match(/[a-z]+/gi).map(w => w.toLowerCase());
let keywords = KeywordExtractor.extract(fullText, {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: true
});
let freqs = keywords.map(kw =>
  words.reduce((freq, w) => (w === kw ? freq + 1 : freq), 0)
);
let totalEvents = freqs.reduce((total, freq) => total + freq, 0);
let relFreqs = freqs.map(f => f / totalEvents);
let scale = d3
  .scalePow()
  .exponent(1.75)
  .domain([1e-6, Math.max(...relFreqs)])
  .range([10, 200]);
let data = keywords
  .map((w, i) => ({
    text: w,
    value: Math.trunc(scale(relFreqs[i]))
  }))
  .sort((a, b) => a.value - b.value)
  .slice(-60);

export default props => (
  <div className="word-cloud-container">
    <WordCloud data={data} width={1600} height={900} />
  </div>
);

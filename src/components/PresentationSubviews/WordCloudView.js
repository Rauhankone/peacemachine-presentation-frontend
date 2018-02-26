import React from 'react';
import WordCloud from 'react-d3-cloud';
import * as d3 from 'd3';
import KeywordExtractor from 'keyword-extractor';

let json = JSON.parse(
  `
{
  "utterances": [
    {"user":"user-2","text":"Hello! Nice to meet me! Technological advancements have a positive effect on humanity and will take us to our glorious future. Technology is a blessing!",
      "tones":[{"score":0.939105,"tone_id":"joy","tone_name":"Joy"},{"score":0.788671,"tone_id":"analytical","tone_name":"Analytical"},{"score":0.906441,"tone_id":"confident","tone_name":"Confident"}]},
    {"user":"user-1","text":"Huh. Technology has so far allowed us to destroy our planet and kill each others more efficiently. Next it will make us redundant and soon enough, extinct.",
      "tones":[{"score":0.707603,"tone_id":"anger","tone_name":"Anger"},{"score":0.846224,"tone_id":"analytical","tone_name":"Analytical"}]},
    {"user":"user-2","text":"You can’t be serious. Eighty years ago our life expectancy was just under 50 years. In Finland one out of ten children died before reaching the age five. How was that better?",
      "tones":[{"score":0.533467,"tone_id":"sadness","tone_name":"Sadness"},{"score":0.865672,"tone_id":"tentative","tone_name":"Tentative"}]},
    {"user":"user-1","text":"Eighty years ago there were two billion people in the world, now there are seven and a half. That is too many by half! Technology allows us to survive and live long, but we should adapt to that by population planning, minimising our ecological footprint, and expanding the human habitat. Sadly, we fail at all three.",
      "tones":[{"score":0.702096,"tone_id":"sadness","tone_name":"Sadness"},{"score":0.752665,"tone_id":"confident","tone_name":"Confident"}]},
    {"user":"user-2","text":"The number of children in developed countries is quite low. We are doing a transition to solar power as we speak. Technological advancement is required to get us to other planets and establish bases there, and ultimately terraform, or otherwise adapt to them in large scale. Aren’t these signs promising?",
      "tones":[{"score":0.83664,"tone_id":"analytical","tone_name":"Analytical"},{"score":0.776674,"tone_id":"tentative","tone_name":"Tentative"}]},
    {"user":"user-1","text":"Ultimately yes, but sadly we do too little, too late. This development will soon lead into a systemic crisis and a global collapse of our civilisation.",
      "tones":[{"score":0.56826,"tone_id":"sadness","tone_name":"Sadness"},{"score":0.73796,"tone_id":"analytical","tone_name":"Analytical"}]},
    {"user":"user-2","text":"The progress of technological advancement is growing exponentially. We may not have a lot of time, but it should be enough!",
      "tones":[{"score":0.613993,"tone_id":"joy","tone_name":"Joy"},{"score":0.952443,"tone_id":"tentative","tone_name":"Tentative"}]},
    {"user":"user-1","text":"We’ll see about that. It seems to me that a huge part of this technical development effort is expended on developing social media platforms that really only cater to the narcissism in us, giving us a lot of acquaintances, but no real friends. We are a lonely people, broadcasting our lives into the ether, with less and less people to care about it.",
      "tones":[{"score":0.63376,"tone_id":"sadness","tone_name":"Sadness"},{"score":0.882072,"tone_id":"tentative","tone_name":"Tentative"}]},
    {"user":"user-2","text":"It is true, social media is not without issues. However it is not without value either. Loneliness existed since before we descended from trees as a species. Now you can find like-minded people across the world!",
      "tones":[{"score":0.597027,"tone_id":"sadness","tone_name":"Sadness"},{"score":0.802429,"tone_id":"analytical","tone_name":"Analytical"},{"score":0.686032,"tone_id":"confident","tone_name":"Confident"}]},
    {"user":"user-1","text":"The damage done outweighs the benefits by a huge margin. We have established a corporate controlled communication system with serious flaws in the world. A system that divides people. As Neil Postman wrote, we are transforming into ‘a culture without moral foundation’.",
      "tones":[]},
    {"user":"user-2","text":"It is too difficult for me to defend social media, the state it is in today. I still see potential there, but it may require moderation mechanisms that are not yet-",
      "tones":[]},
    {"user":"user-1","text":"You mean the scary censorship mechanisms that are used to take away the only truly valuable aspect there is for us, the free speech?",
      "tones":[]},
    {"user":"user-2","text":"Crap. Ok. But social media is just one tiny, if highly visible, piece of technological advancement. What about the breakthroughs in healthcare and medical science? We’re on brink to find a cure to Alzheimer. There are plenty of devastating diseases that machine learning can find the cause for, if not a cure.",
      "tones":[]},
    {"user":"user-1","text":"You are right. This is positive. However–",
      "tones":[]},
    {"user":"user-2","text":"Not however! The so called circle of life is a vicious spiral of misery and death. We can beat that, and evolve beyond! No more death. No more suffering. Lives are going to be better for so many.",
      "tones":[]},
    {"user":"user-1","text":"Transhumanism will just make a tiny portion of us super rich, and the rest will live in twice the misery, aware of what they are missing. There’s this new show called Altered Carbon, you should see it.",
      "tones":[]},
    {"user":"user-2","text":"I have seen it, we are the same goddamn person. Progressive technology that comes with real benefits has always been adapted first by the privileged minority with superior means, but it has always become available to a larger number of people.",
      "tones":[]},
    {"user":"user-1","text":"The impact of the development is growing larger and larger. Think cyborgs. Processing and memory capability linked directly to your brain. Physical enhancements. Parallel processing. Additional senses. The power gap will widen and widen, and as death will no longer even things out…",
      "tones":[]},
    {"user":"user-2","text":"The adaptation and market penetration of new tech has become faster and faster. Electricity, TV, and Internet took decades. We move much faster now. Looking at Africa, the lack of existing digital infrastructure may allow them to leapfrog forward and gain a previously unseen advantage. We wasted a lot of resources digging wires in the ground.",
      "tones":[]},
    {"user":"user-1","text":"Can’t argue with that, but I remain sceptical. I guess we have a decent chance to live long enough to see how this plays out. Meanwhile we can try to promote openness in technology and science, to provide for better opportunities to all.",
      "tones":[]},
    {"user":"user-2","text":"Yes, we should do certainly do that. The risks are real.",
      "tones":[]}
  ]
}
`
);

let fullText = json.utterances.map(w => w.text).join(` `);
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

export default props => <WordCloud data={data} width={1600} height={900} />;

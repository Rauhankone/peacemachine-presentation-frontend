import React from 'react';
import { stringifyToneScore } from '../utils/';

export default props => {
  const tone_categories = props.analyzeObj.tone_categories;

  console.log(props.analyzeObj);

  let styleObj = {
    position: 'absolute',
    padding: '25px',
    background: '#333',
    color: '#ddf',
    top: '25px',
    left: '15px',
    minWidth: '400px'
  };
  let subHeadings = {
    fontWeight: 'bold'
  };
  let subGroups = {
    padding: '10px'
  };

  return (
    <div style={styleObj}>
      <h3>{props.analyzeObj.text}</h3>
      <p style={subHeadings}>Emotion tone</p>
      <div style={subGroups}>
        <p>Anger: {stringifyToneScore(tone_categories[0].tones[0].score)}</p>
        <p>Disgust: {stringifyToneScore(tone_categories[0].tones[1].score)}</p>
        <p>Fear: {stringifyToneScore(tone_categories[0].tones[2].score)}</p>
        <p>Joy: {stringifyToneScore(tone_categories[0].tones[3].score)}</p>
        <p>Sadness: {stringifyToneScore(tone_categories[0].tones[4].score)}</p>
      </div>
      <p style={subHeadings}>Language tone</p>
      <div style={subGroups}>
        <p>
          Analytical: {stringifyToneScore(tone_categories[1].tones[0].score)}
        </p>
        <p>
          Confident: {stringifyToneScore(tone_categories[1].tones[1].score)}
        </p>
        <p>
          Tentative: {stringifyToneScore(tone_categories[1].tones[2].score)}
        </p>
      </div>
      <p style={subHeadings}>Social tone</p>
      <div style={subGroups}>
        <p>Openness: {stringifyToneScore(tone_categories[2].tones[0].score)}</p>
        <p>
          Conscientiousness:{' '}
          {stringifyToneScore(tone_categories[2].tones[1].score)}
        </p>
        <p>
          Extraversion: {stringifyToneScore(tone_categories[2].tones[2].score)}
        </p>
        <p>
          Agreeableness: {stringifyToneScore(tone_categories[2].tones[3].score)}
        </p>
        <p>
          Emotional range:{' '}
          {stringifyToneScore(tone_categories[2].tones[4].score)}
        </p>
      </div>
    </div>
  );
};

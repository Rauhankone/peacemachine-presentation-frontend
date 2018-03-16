import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';

export function scoreToCubehelix(score) {
  let cubehelix = [
    'rgba(0,0,0,1)','rgba(19,13,34,1)','rgba(44,24,64,1)','rgba(72,34,89,1)',
    'rgba(103,44,106,1)','rgba(133,56,117,1)','rgba(161,69,123,1)','rgba(183,85,126,1)',
    'rgba(202,103,129,1)','rgba(214,125,131,1)','rgba(223,148,138,1)','rgba(228,172,149,1)',
    'rgba(231,196,166,1)','rgba(236,219,191,1)','rgba(242,238,220,1)','rgba(255,255,255,1)'
  ];
  let index = Math.round(cubehelix.length * score);
  return cubehelix[index];
}

// Expects an array of tones
// [ { tone_id: '', score: 0.0 }, ... ]
export function tonesToColor(tones) {
  const factorTable = {
    anger: 0.75,
    joy: 0.75,
    fear: 0.37,
    disgust: 0.37,
    sadness: -0.25
  };
  let filtered = tones.filter(tone => !!factorTable[tone.tone_id]);
  let sum = filtered
    .map(tone => factorTable[tone.tone_id] * tone.score)
    .reduce((acc, curr) => acc + curr, 0.25);
  return scoreToCubehelix(_.clamp(sum,0,1));
}

export function extractEmotionTones(data) {
  return data.tones.tone_categories.filter((c) => c.category_id === "emotion_tone")[0].tones;
}

class Sentiment extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderChanges();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.renderChanges();
    }
  }

  render() {
    return <div>{this.props.chart}</div>;
  }

  renderChanges() {
    let data = this.props.data;

    // TODO: REMOVE THIS CLASS IF IT'S NOT NEEDED IN THE END!
  }

}

Sentiment.defaultProps = {
  chart: ''
};

Sentiment.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Sentiment;

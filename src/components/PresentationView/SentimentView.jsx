import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class Sentiment extends React.Component {
  scoreToCubehelix(score, domain) {
    /*const cubehelix = d3.scaleLinear()
      .range([d3.hsl(300, .5, 0), d3.hsl(-240, -5, 1)])
      .interpolate(d3.interpolateCubehelix).domain(domain);
    return cubehelix(score);*/
    return 'rgb(0,0,' + parseInt(score * 255) + ')';
  }

  // Expects an array of tones
  // [ { tone_id: '', score: 0.0 }, ... ]
  tonesToColor(tones) {
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
      .reduce((acc, curr) => acc + curr, 0.0);
    let avg = filtered.length > 0 ? sum / filtered.length : 0;
    return this.scoreToCubehelix(avg, [-0.25, 0.75]);
  }

  componentDidMount() {
    this.renderD3();
  }

  componentDidUpdate(prevProps, prevState) {
    this.renderD3();
  }

  render() {
    return '';
  }

  renderD3() {
    d3
      .selectAll('.sentence-span')
      .style(
        'text-shadow',
        () => '0 0 5px ' + this.scoreToCubehelix(Math.random(), [0, 1])
      ); //.style('box-shadow', () => '0 0 5px '+this.scoreToCubehelix(Math.random(), [0,1]));
  }
}

Sentiment.defaultProps = {
  chart: 'loading...'
};

Sentiment.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};

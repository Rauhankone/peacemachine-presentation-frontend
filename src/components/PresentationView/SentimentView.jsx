import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';

<<<<<<< HEAD
export default class Sentiment extends React.Component {
  scoreToCubehelix(score, domain) {
    /*const cubehelix = d3.scaleLinear()
      .range([d3.hsl(300, .5, 0), d3.hsl(-240, -5, 1)])
      .interpolate(d3.interpolateCubehelix).domain(domain);
    return cubehelix(score);*/
    return 'rgb(0,0,' + parseInt(score * 255) + ')';
=======
class Sentiment extends React.Component {
  constructor(props) {
    super(props);
  }

  scoreToCubehelix(score) {
    let cubehelix = [
      'rgb(0,0,0)','rgb(19,13,34)','rgb(44,24,64)','rgb(72,34,89)',
      'rgb(103,44,106)','rgb(133,56,117)','rgb(161,69,123)','rgb(183,85,126)',
      'rgb(202,103,129)','rgb(214,125,131)','rgb(223,148,138)','rgb(228,172,149)',
      'rgb(231,196,166)','rgb(236,219,191)','rgb(242,238,220)','rgb(255,255,255)'
    ];
    let index = Math.round(cubehelix.length * score);
    return cubehelix[index];
>>>>>>> Re-add redux-faux-dom
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
    return this.scoreToCubehelix(avg);
  }

  componentDidMount() {
    this.renderD3();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.renderChanges();
    }
  }

  render() {
    return <div>{this.props.chart}</div>;
  }

  renderD3() {
    var faux = this.props.connectFauxDOM('div', 'chart');
    this.renderChanges();
  }

  renderChanges() {
    let data = this.props.data;

    d3
      .selectAll('.sentence-span')
      .style(
        'color',
        () =>  this.scoreToCubehelix(Math.random())
      );

    this.props.animateFauxDOM(1500);
  }

}

Sentiment.defaultProps = {
  chart: 'loading...'
};

Sentiment.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};

const FauxSentiment = withFauxDOM(Sentiment);
export default FauxSentiment;

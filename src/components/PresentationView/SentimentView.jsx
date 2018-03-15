import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';

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

  extractEmotionTones(data) {
    return data.tones.tone_categories.filter((c) => c.category_id === "emotion_tone")[0].tones;
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
    
    data
        .map((d) => ({
          mess_id: d.id,
          color: (!!d.tones) ? this.tonesToColor(this.extractEmotionTones(d)) : 'rgb(255, 100, 100)'
        }))
        .forEach((d) => {
          d3.select('#'+d.mess_id)
              .style('color', (element) => {
                return d.color;
              });
        });

    this.props.animateFauxDOM(1500);
  }

}

Sentiment.defaultProps = {
  chart: 'loading...'
};

Sentiment.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

const FauxSentiment = withFauxDOM(Sentiment);
export default FauxSentiment;

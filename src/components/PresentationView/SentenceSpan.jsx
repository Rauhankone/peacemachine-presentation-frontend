import React from 'react';
import _ from 'lodash';
import { tonesToColor, extractEmotionTones } from './SentimentView';

export default class SentenceSpan extends React.Component {

  static OPACITY_TRANSITION_SECONDS = 1;
  static BACKGROUND_TRANSITION_SECONDS = 1;

  state = {
    letterIndex: 0,
    finished: false
  };

  componentDidMount() {
    this.accumulateLetters();
  }

  accumulateLetters = () => {
    let intervalId = setInterval(() => {
      this.props.onLetterIndexIncrement();
      if (this.state.letterIndex < this.props.data.transcript.length) {
        this.setState({ letterIndex: this.state.letterIndex + 1 });
      } else {
        this.props.onSentenceFinish();
        this.setState({ finished: true });
        clearInterval(intervalId);
      }
    }, 1000 / 60);
  };

  getBackgroundColor(data) {
    return (!!data.tones) ? tonesToColor(extractEmotionTones(data)) : 'rgb(100,100,100)';
  }

  getOpacity() {
    let opacity = 1;
    if (this.props.showConfidence) {
      opacity = _.clamp(Math.pow(this.props.data.confidence, 5), 0.0, 1);
    } else if (this.props.searchTopWord) {
      opacity = this.props.data.transcript.includes(this.props.topWord) ? 1 : 0.1;
    }
    return opacity;
  }

  render() {
    return (
      <span id={this.props.data.id+'-wrapper'}
        className='sentence-span-wrapper'
        style={{
          transition: `opacity ${SentenceSpan.OPACITY_TRANSITION_SECONDS}s, background ${SentenceSpan.BACKGROUND_TRANSITION_SECONDS}s`,
          opacity: this.getOpacity(),
          background: this.props.showIntensity ? this.getBackgroundColor(this.props.data) : 'none'
        }}
        >
          <span
            id={this.props.data.id}
            className={`sentence-span ${
              this.state.finished ? 'sentence-finished' : null
            }`}
          >
            {this.props.data.transcript.substring(0, this.state.letterIndex)}
          </span>
      </span>
    );
  }
}
//

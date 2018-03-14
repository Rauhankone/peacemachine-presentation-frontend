import React from 'react';
import _ from 'lodash';

export default class SentenceSpan extends React.Component {

  static OPACITY_TRANSITION_SECONDS = 1;

  state = {
    letterIndex: 0,
    finished: false,
    confidence: _.clamp(Math.pow(this.props.data.confidence, 5), 0.0, 1)
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

  render() {
    return (
      <span
        className={`sentence-span ${
          this.state.finished ? 'sentence-finished' : null
        }`}
        style={{
          transition: `opacity ${SentenceSpan.OPACITY_TRANSITION_SECONDS}s`,
          opacity: this.props.showConfidence ? this.state.confidence : 1
        }}
      >
        {this.props.data.transcript.substring(0, this.state.letterIndex)}
      </span>
    );
  }
}
//

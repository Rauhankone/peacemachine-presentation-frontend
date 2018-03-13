import React from 'react';
import _ from 'lodash';
import { NodeGroup } from 'react-move';

export default class SentenceSpan extends React.Component {
  state = {
    letterIndex: 0,
    finished: false
  };

  componentDidMount() {
    this.accumulateLetters();
  }

  accumulateLetters = () => {
    let INT_ID = null;
    let accIndex = 0;

    INT_ID = setInterval(() => {
      if (this.props.data.transcript.length > accIndex) {
        accIndex++;
        return this.setState({ letterIndex: accIndex });
      }

      this.props.onSentenceFinish();

      this.setState({ finished: true });

      return clearInterval(INT_ID);
    }, 1000 / 60);
  };

  render() {
    return (
      <span
        className={`sentence-span ${
          this.state.finished ? 'sentence-finished' : null
        }`}
        style={{
          // opacity: _.clamp(Math.pow(this.props.data.confidence, 5), 0.0, 1)
          opacity: this.props.data.confidence * 0.6 + 0.4 // Original value transformed so that it's between 0.4-1.0
        }}
      >
        {this.props.data.transcript.substring(0, this.state.letterIndex)}
      </span>
    );
  }
}
//

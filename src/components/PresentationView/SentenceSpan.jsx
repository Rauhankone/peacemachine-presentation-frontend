import React from 'react';

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

    INT_ID = setInterval(() => {
      this.props.onLetterIndexIncrement();
      if (this.state.letterIndex < this.props.data.transcript.length) {
        this.setState({ letterIndex: this.state.letterIndex + 1 });
      } else {
        this.props.onSentenceFinish();
        this.setState({ finished: true });
        clearInterval(INT_ID);
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
          // opacity: _.clamp(Math.pow(this.props.data.confidence, 5), 0.0, 1)
          opacity: Math.pow(this.props.data.confidence, 5) // Original value transformed so that it's between 0.4-1.0
        }}
      >
        {this.props.data.transcript.substring(0, this.state.letterIndex)}
      </span>
    );
  }
}
//

import React, { Fragment } from 'react';
import SentenceSpan from './SentenceSpan';
import '../../styles/LiveTextView.css';

class LiveTextView extends React.Component {

  static DEFAULT_FONT_SIZE_PIXELS = 1000;

  state = {
    fontDivisor: 1,
    sentenceIndex: 1,
  };

  incrementFontDivisor = () => {
    if (this.isTextOverflowing()) {
      this.setState(prevState => ({
        fontDivisor: prevState.fontDivisor + 1,
      }));
    }
  };

  incrementSentenceIndex = () => {
    this.setState(prevState => ({
      sentenceIndex: prevState.sentenceIndex + 1,
    }));
  };

  isTextOverflowing = () => {
    const { clientHeight, scrollHeight } = this.sentencesContainerElement;
    return clientHeight < scrollHeight;
  };

  render() {
    const { fontDivisor, sentenceIndex } = this.state;
    const fontSizePixels = LiveTextView.DEFAULT_FONT_SIZE_PIXELS / fontDivisor;
    return (
      <section className="live-text-view">
        <div
          className="sentences-container"
          style={{ fontSize: `${fontSizePixels}px` }}
          ref={ element => { this.sentencesContainerElement = element; } }
        >
          {this.props.mess.slice(0, sentenceIndex).map((channel, index) => (
            <SentenceSpan
              key={index}
              data={channel}
              onLetterIndexIncrement={this.incrementFontDivisor}
              onSentenceFinish={this.incrementSentenceIndex}
            />
          ))}
        </div>
      </section>
    );
  }
}

export default LiveTextView;

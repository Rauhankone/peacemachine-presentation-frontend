import React from 'react';
import SentenceSpan from './SentenceSpan';
import _ from 'lodash';
import '../../styles/LiveTextView.css';

class LiveTextView extends React.Component {
  static DEFAULT_FONT_SIZE_PIXELS = 1000;

  state = {
    fontDivisor: 1,
    sentenceIndex: 1
  };

  incrementFontDivisor = () => {
    if (this.isTextOverflowing()) {
      this.setState(prevState => ({
        fontDivisor: prevState.fontDivisor + 1
      }));
    }
  };

  incrementSentenceIndex = () => {
    this.setState(prevState => ({
      sentenceIndex: prevState.sentenceIndex + 1
    }));
  };

  isTextOverflowing = () => {
    const { clientHeight, scrollHeight } = this.sentencesContainerElement;
    return clientHeight < scrollHeight;
  };

  render() {
    const { fontDivisor, sentenceIndex } = this.state;
    const fontSizePixels = LiveTextView.DEFAULT_FONT_SIZE_PIXELS / fontDivisor;
    const color = () => {
      const alpha = _.clamp(Math.pow(this.props.me.confidence, 5), 0.0, 1);
      return [255, 255, 255, alpha];
    };
    return (
      <section className="live-text-view">
        <div
          className="sentences-container"
          style={{ fontSize: `${fontSizePixels}px` }}
          ref={element => {
            this.sentencesContainerElement = element;
          }}
        >
          {this.props.mess
            .slice(0, sentenceIndex)
            .map((channel, index) => (
              <SentenceSpan
                data={channel}
                onLetterIndexIncrement={this.incrementFontDivisor}
                onSentenceFinish={this.incrementSentenceIndex}
                color={color}
              />
            ))}
        </div>
      </section>
    );
  }
}

export default LiveTextView;

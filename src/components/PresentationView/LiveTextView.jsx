import React from 'react';
import SentenceSpan from './SentenceSpan';
import '../../styles/LiveTextView.css';

class LiveTextView extends React.Component {

  static DEFAULT_FONT_SIZE_PIXELS = 1000;

  static initialState = {
    fontDivisor: 1,
    sentenceIndex: 1
  };

  state = {
    ...this.constructor.initialState
  };

  resetState = () => {
    this.setState((prevState, props) => ({
      ...this.constructor.initialState
    }));
  }

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.mess.length === 0) {
      this.resetState();
    }
  }

  render() {
    const { fontDivisor, sentenceIndex } = this.state;
    const fontSizePixels = (
      this.constructor.DEFAULT_FONT_SIZE_PIXELS / fontDivisor
    );
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
                key={index}
                data={channel}
                onLetterIndexIncrement={this.incrementFontDivisor}
                onSentenceFinish={this.incrementSentenceIndex}
                showConfidence={this.props.activeSlide === 'confidence' || this.props.activeSlide === 'intensity'}
                showIntensity={this.props.activeSlide === 'intensity' || this.props.activeSlide.includes('topword')}
                searchTopWord={this.props.activeSlide.includes('topword')}
                topWord={this.props.topWord}
              />
            ))}
        </div>
      </section>
    );
  }
}

export default LiveTextView;

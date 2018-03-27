import React from 'react';
import _ from 'lodash';
import Color from 'color';
import { tonesToColor, extractEmotionTones } from './SentimentView';

export default class SentenceSpan extends React.Component {
  static OPACITY_TRANSITION_SECONDS = 1;
  static BACKGROUND_TRANSITION_SECONDS = 1;

  static initialState = {
    letterIndex: 0,
    finished: false
  };

  state = {
    ...this.constructor.initialState
  };

  resetState = () => {
    this.setState((prevState, props) => ({
      ...this.constructor.initialState
    }));
  };

  componentDidMount() {
    this.accumulateLetters();
  }

  componentDidUpdate() {
    if (this.props.runAccumulation && this.state.finished) {
      this.resetState();
      this.accumulateLetters();
    }
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
    return !!data.tones
      ? tonesToColor(extractEmotionTones(data))
      : 'rgb(100,100,100)';
  }

  getTextColor(color) {
    const bgColor = Color(color);
    const luminosity = bgColor.luminosity();
    const contrastTreshold = t => luminosity >= t;

    if (contrastTreshold(0.6)) {
      return bgColor.darken(luminosity);
    } else {
      return luminosity < 0.2
        ? bgColor.lighten(_.clamp(luminosity, 0.2, 0.4))
        : bgColor.lighten(_.clamp(luminosity, 0.4, 1));
    }
    // return isBright ? '#853875' : '#EEFFFF';
  }

  getOpacity() {
    let opacity = 1;
    if (this.props.showConfidence) {
      opacity = _.clamp(Math.pow(this.props.data.confidence, 5), 0.0, 1);
    } else if (this.props.searchTopWord) {
      opacity = _.includes(
        _.toLower(this.props.data.transcript),
        this.props.topWord
      )
        ? 1
        : 0.1;
    }
    return opacity;
  }

  render() {
    return (
      <span
        id={this.props.data.id + '-wrapper'}
        className="sentence-span-wrapper"
        style={{
          transition: `opacity ${
            SentenceSpan.OPACITY_TRANSITION_SECONDS
          }s, background ${SentenceSpan.BACKGROUND_TRANSITION_SECONDS}s`,
          opacity: this.getOpacity(),
          background: this.props.showIntensity
            ? this.getBackgroundColor(this.props.data)
            : 'none'
        }}
      >
        <span
          id={this.props.data.id}
          className={`sentence-span ${
            this.state.finished ? 'sentence-finished' : null
          }`}
          style={{
            color: this.props.showIntensity
              ? this.getTextColor(this.getBackgroundColor(this.props.data))
              : '#EEFFFF'
          }}
        >
          {this.props.data.transcript.substring(0, this.state.letterIndex)}
        </span>
      </span>
    );
  }
}
//

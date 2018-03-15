import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import _ from 'lodash';
import '../../styles/LiveTextView.css';

class LiveTextView extends React.Component {
  static DEFAULT_FONT_SIZE_PIXELS = 1000;

  constructor(props) {
    super(props);
    this.state = {
      fontDivisor: 1,
      curChars: 0
    };
    this.maxChars = 0;
  }

  incrementFontDivisor() {
    if (this.isTextOverflowing()) {
      this.setState(prevState => ({
        fontDivisor: prevState.fontDivisor + 1
      }));
    }
  }

  isTextOverflowing() {
    const { clientHeight, scrollHeight } = this.sentencesContainerElement;
    return clientHeight < scrollHeight;
  }

  accumulateLetters() {
    setInterval(() => {
      if (this.state.curChars < this.maxChars) this.state.curChars++;
    }, 1000 / 60);
  }

  componentDidMount() {
    this.accumulateLetters();
    this.updateD3();
  }

  componentDidUpdate(prevProps, prevState) {
    this.maxChars = _.sumBy(this.props.transcripts, 'length');
    this.updateD3();
  }

  updateD3() {
    const update = d3
      .select(this.elem)
      .selectAll('span')
      .data(this.props.transcripts);
    update.exit().remove();
    update
      .enter()
      .append('span')
      .attr('class', 'sentence-span')
      .merge(update)
      .text((d, i) => {
        const datumMaxChars = _.sumBy(
          _.slice(this.props.transcripts, 0, i + 1),
          'length'
        );
        if (this.state.curChars < datumMaxChars) return '';
        const end = Math.min(d.length, this.maxChars - datumMaxChars);
        return d.substring(0, end);
      })
      .style('color', (d, i) => `rgba(${this.props.colorizer(i).join()})`);
    // .transition()
    // .duration(500)

    // const { fontDivisor, sentenceIndex } = this.state;
    // const fontSizePixels = LiveTextView.DEFAULT_FONT_SIZE_PIXELS / fontDivisor;
  }

  render() {
    const { fontDivisor } = this.state;
    const fontSizePixels = LiveTextView.DEFAULT_FONT_SIZE_PIXELS / fontDivisor;
    return (
      <section className="live-text-view">
        <div className="sentences-container" ref={elem => (this.elem = elem)} />
      </section>
    );
  }
}
//style={{ fontSize: `${fontSizePixels}px` }}
export default LiveTextView;

//           style={{ fontSize: `${fontSizePixels}px` }}
// ref={element => {
//   this.sentencesContainerElement = element;
// }}

//           {this.props.mess
//   .slice(0, sentenceIndex)
//   .map((channel, index) => (
//     <SentenceSpan
//       data={channel}
//       onCharIndexIncrement={this.incrementFontDivisor}
//       onSentenceFinish={this.incrementSentenceIndex}
//       color={color}
//     />
//     ))}

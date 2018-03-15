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
  }

  incrementFontDivisor() {
    if (this.isTextOverflowing()) {
      this.setState(prevState => ({
        fontDivisor: prevState.fontDivisor + 1
      }));
    }
  }

  isTextOverflowing() {
    const { clientHeight, scrollHeight } = this.elem;
    return clientHeight < scrollHeight;
  }

  accumulateLetters() {
    setInterval(() => {
      if (this.state.curChars < _.sumBy(this.props.sentences, 'length'))
        this.setState(prevState => ({
          curChars: prevState.curChars + 1
        }));
      this.incrementFontDivisor();
    }, 10);
  }

  componentDidMount() {
    this.accumulateLetters();
    this.updateD3();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateD3();
  }

  updateD3() {
    const update = d3
      .select(this.elem)
      .selectAll('span')
      .data(this.props.sentences);
    update.exit().remove();
    update
      .enter()
      .append('span')
      .attr('class', 'sentence-span')
      .merge(update)
      .text((d, i) => {
        const untilDatumMaxChars = _.sumBy(
          _.slice(this.props.sentences, 0, i + 1),
          'length'
        );
        if (this.state.curChars + d.length < untilDatumMaxChars) return '';
        if (untilDatumMaxChars < this.state.curChars) return d;
        const end = Math.min(
          d.length,
          this.state.curChars - untilDatumMaxChars + d.length
        );
        return d.substring(0, end);
      })
      .style('color', (d, i) => `rgba(${this.props.colorizer((d, i)).join()})`)
      .transition()
      .duration(500);
  }

  render() {
    const { fontDivisor } = this.state;
    const fontSizePixels = LiveTextView.DEFAULT_FONT_SIZE_PIXELS / fontDivisor;
    return (
      <section className="live-text-view">
        <div
          className="sentences-container"
          ref={elem => (this.elem = elem)}
          style={{ fontSize: `${fontSizePixels}px` }}
        />
      </section>
    );
  }
}

export default LiveTextView;

import React from 'react';
import _ from 'lodash';

export default class SentenceSpan extends React.Component {
  render() {
    const {
      opacity,
      scaleY,
      scaleX,
      translateY,
      ...rest
    } = this.props.nodeState;

    return (
      <span
        className="sentence-span"
        style={{
          opacity: _.clamp(this.props.data.confidence, 0.25, 1),
          transform: `scale(${scaleX}, ${scaleY}) `
        }}
      >
        {this.props.data.transcript}&nbsp;
      </span>
    );
  }
}

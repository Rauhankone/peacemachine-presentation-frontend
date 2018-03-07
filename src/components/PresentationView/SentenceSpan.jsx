import React from 'react';
import _ from 'lodash';

export default class SentenceSpan extends React.Component {
  render() {
    return (
      <span
        className="sentence-span"
        style={{
          opacity: _.clamp(this.props.data.confidence, 0.25, 1)
        }}
      >
        {this.props.data.transcript}&nbsp;
      </span>
    );
  }
}

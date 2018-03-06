import React from 'react';

export default class SentenceSpan extends React.Component {
  render() {
    const { opacity, scale, ...rest } = this.props.nodeState;

    return (
      <span
        className="sentence-span"
        style={{ opacity, transform: `scale(1, ${scale})` }}
      >
        {this.props.data.transcript}&nbsp;
      </span>
    );
  }
}

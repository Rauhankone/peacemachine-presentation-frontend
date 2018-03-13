import React from 'react';

export default class TopWord extends React.Component {
  render() {
    return (
      <div style={{ fontSize: 20, color: 'white' }}>{this.props.word}</div>
    );
  }
}

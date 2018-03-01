import React from 'react';
import '../../styles/LiveTextView.css';

export default class LiveTextCol extends React.Component {
  render() {
    return (
      <div className="live-text-col">
        <p>{this.props.channel.id}</p>
      </div>
    );
  }
}
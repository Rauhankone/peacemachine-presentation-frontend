import React from 'react';
import * as d3 from 'd3';
import '../../styles/LiveTextView.css';
import LiveTextCol from './LiveTextCol';

class LiveTextView extends React.Component {
  componentDidMount() {
    this.createLiveTextView();
  }

  componentDidUpdate() {
    this.createLiveTextView();
  }

  createLiveTextView() {}

  render() {
    return (
      <div className="live-text-view" ref={elem => (this.elem = elem)}>
        {this.props.channels.map(channel => <LiveTextCol channel={channel} />)}
      </div>
    );
  }
}

export default LiveTextView;

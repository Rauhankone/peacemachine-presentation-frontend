import React from 'react';
import * as d3 from 'd3';
import '../../styles/LiveTextView.css';
import LiveTextCol from './LiveTextCol';

class LiveTextView extends React.Component {

  componentDidUpdate() {
    console.log('LiveTextView props:');
    console.log(this.props);
  }

  render() {
    return (
      <div className="live-text-view" ref={elem => (this.elem = elem)}>
        {this.props.channels.map(channel => <LiveTextCol channel={channel} />)}
      </div>
    );
  }
}

export default LiveTextView;

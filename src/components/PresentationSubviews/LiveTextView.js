import React from 'react';
import * as d3 from 'd3';
import './LiveTextView.css';

class LiveTextView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelCols: []
    };
  }

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
        <div className="col">moi</div>
        <div className="col">moi</div>
        <div className="col">moi</div>
      </div>
    );
  }
}

export default LiveTextView;

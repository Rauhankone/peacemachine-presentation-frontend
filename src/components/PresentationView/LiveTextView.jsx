import React from 'react';
import { easeExpInOut } from 'd3-ease';
import _ from 'lodash';
import { NodeGroup } from 'react-move';
import '../../styles/LiveTextView.css';
import SentenceSpan from './SentenceSpan';

class LiveTextView extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <section className="live-text-view">
        <div className="sentences-container">
          {this.props.mess.map((channel, index) => (
            <SentenceSpan key={index} data={channel} />
          ))}
        </div>
      </section>
    );
  }
}

export default LiveTextView;

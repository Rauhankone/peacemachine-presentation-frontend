import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { NodeGroup } from 'react-move';
import '../../styles/LiveTextView.css';
import SentenceSpan from './SentenceSpan';

class LiveTextView extends React.Component {
  componentDidUpdate() {}

  componentDidMount() {
    console.log();
  }

  state = {
    sentences: [
      { transcript: 'Testing 1 2 3.', confidence: 0.5 },
      { transcript: 'Hi.', confidence: 0.3 }
    ]
  };

  render() {
    return (
      <NodeGroup
        data={this.state.sentences}
        keyAccessor={sentence => sentence.transcript}
        start={(data, index) => ({
          opacity: [0]
        })}
        enter={(data, index) => ({
          opacity: [0, 1],
          scale: [0, 1],
          timing: {
            duration: 150,
            timing: d3.easeCircleInOut
          }
        })}
      >
        {nodes => {
          return (
            <div class="sentences-container">
              {nodes.map(({ key, data, state }) => {
                return <SentenceSpan key={key} nodeState={state} data={data} />;
              })}
            </div>
          );
        }}
      </NodeGroup>
    );
  }
}

export default LiveTextView;

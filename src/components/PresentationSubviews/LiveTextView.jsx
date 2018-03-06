import React from 'react';
import { easeExpInOut } from 'd3-ease';

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
      { transcript: 'Hi.', confidence: 0.3 },
      { transcript: 'Humor. ', confidence: 1 },
      { transcript: 'La Li Lu Le Lo.', confidence: 1 },
      { transcript: 'Hello darkness my old friend', confidence: 0.8 }
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
          scaleY: [0, 1],
          scaleX: [1.5, 1],
          translateY: [20, 0],
          timing: {
            duration: 250,
            ease: easeExpInOut,
            delay: 300 * index
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

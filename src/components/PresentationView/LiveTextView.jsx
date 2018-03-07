import React from 'react';
import { easeExpInOut } from 'd3-ease';

import { NodeGroup } from 'react-move';
import '../../styles/LiveTextView.css';
import SentenceSpan from './SentenceSpan';

const dummySentences = [
  { transcript: 'Testing 1 2 3.', confidence: 0.5 },
  { transcript: 'Hi.', confidence: 0.3 },
  { transcript: 'Humor. ', confidence: 1 },
  { transcript: 'La Li Lu Le Lo.', confidence: 1 },
  { transcript: 'Hello darkness my old friend', confidence: 0.8 }
];

class LiveTextView extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <section className="live-text-view">
        <div className="sentences-container">
          {this.props.mess.map(channel => (
            <SentenceSpan key={channel.id} data={channel} />
          ))}
        </div>
        {/* <NodeGroup
          data={this.props.mess}
          keyAccessor={channel => channel.timestamp}
          start={(data, index) => ({
            opacity: [0]
          })}
          enter={(data, index) => ({
            scaleY: [0, 1],
            scaleX: [1.5, 1],
            translateY: [20, 0],
            backgroundColor: ['white', 'transparent'],
            timing: {
              duration: 250,
              ease: easeExpInOut,
              delay: 300 * index
            }
          })}
          update={data => ({
            scaleY: [0, 1],
            scaleX: [1.5, 1],
            translateY: [20, 0],
            backgroundColor: ['white', 'transparent'],
            timing: {
              duration: 250,
              ease: easeExpInOut
            }
          })}
        >
          {nodes => {
            return (
              <div className="sentences-container">
                {nodes.map(({ key, data, state }) => {
                  console.log(key, data, state);
                  return (
                    <SentenceSpan key={key} nodeState={state} data={data} />
                  );
                })}
              </div>
            );
          }}
        </NodeGroup> */}
      </section>
    );
  }
}

export default LiveTextView;

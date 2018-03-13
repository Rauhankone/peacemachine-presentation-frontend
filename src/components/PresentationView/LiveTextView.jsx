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
        <div
          className="sentences-container"
          style={{
            fontSize: _.clamp(1000 / this.props.mess.length, 15, 60)
          }}
        >
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

import React from 'react';
import _ from 'lodash';
import { NodeGroup } from 'react-move';

export default class SentenceSpan extends React.Component {
  componentDidMount() {
    console.log('mo');
  }
  render() {
    return (
      <span
        className="sentence-span"
        style={{
          opacity: _.clamp(this.props.data.confidence, 0.25, 1)
        }}
      >
        {this.props.data.transcript}
        &nbsp;
      </span>
    );
  }
}
//

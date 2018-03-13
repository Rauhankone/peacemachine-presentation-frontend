import React from 'react';
// import * as d3 from 'd3';

export default class TopWord extends React.Component {
  // componentDidMount() {
  //   this.renderD3();
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   this.renderD3();
  // }

  render() {
    return (
      <div style={{ fontSize: 50, color: 'white', textAlign: 'center' }}>
        {this.props.word}
      </div>
    );
  }

  // renderD3() {
  //   d3.selectAll('.sentence-span').style('color', d => `rgba(0,0,0,0}`);
  // }
}

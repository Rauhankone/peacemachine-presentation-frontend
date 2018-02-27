import React from 'react';
import * as d3 from 'd3';
import './LiveTextView.css';

class LiveTextView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.createLiveTextView();
  }

  componentDidUpdate() {
    this.createLiveTextView();
  }

  createLiveTextView() {
    const elem = this.elem;

    let update = d3
      .select(elem)
      .select('.col')
      .selectAll('.sentence')
      .data(this.props.data);

    update.exit().remove();

    update
      .enter()
      .insert('div', ':first-child')
      .attr('class', 'sentence')
      .style('top', 0)
      .text(d => d.transcript);

    update
      .transition()
      .duration(500)
      .style('top', (_, i) => `${(i + 1) * 90}px`);
  }

  render() {
    return (
      <div className="live-text-view" ref={elem => (this.elem = elem)}>
        <div className="col" />
        <div className="col" />
        <div className="col" />
      </div>
    );
  }
}

export default LiveTextView;

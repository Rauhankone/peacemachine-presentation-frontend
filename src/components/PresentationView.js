import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import LiveTextView from './PresentationSubviews/LiveTextView';
import WordZoomView from './PresentationSubviews/WordZoomView';
import WordCloudView from './PresentationSubviews/WordCloudView';
import SentimentView from './PresentationSubviews/SentimentView';

class Circles extends React.Component {
  constructor(props) {
    super(props);
    this.renderCircles = this.renderCircles.bind(this);
  }

  componentDidMount() {
    this.renderCircles();
  }

  componentDidUpdate() {
    this.renderCircles();
  }

  renderCircles() {
    let node = this.node;
    let circle = d3
      .select(node)
      .selectAll(`circle`)
      .data([33, 55, 77]);

    circle
      .enter()
      .append('circle')
      .attr('cy', 60)
      .attr('cx', function(d, i) {
        return i * 100 + 30;
      })
      .attr('r', function(d) {
        return Math.sqrt(d);
      });

    circle.exit().remove();
  }

  render() {
    return <svg ref={node => (this.node = node)} width={500} height={500} />;

// export default class PresentationView extends React.Component {
//   render() {
//     return (
//       <div className="presentation-view">
//         <div>Nothing here yet!</div>
//         <div>
//           <Circles data={[32, 64, 128]} />
//         </div>
//         <div>Nothing here yet!</div>
//       </div>
//     );
//   }
// }

export default class PresentationView extends React.Component {

  render() {
    return (
      <div className="presentation-view"><LiveTextView /></div>
    )
  }
}

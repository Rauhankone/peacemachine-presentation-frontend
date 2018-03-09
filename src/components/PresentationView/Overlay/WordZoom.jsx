import React from 'react';

export default class WordZoom extends React.Component {
  componentDidMount() {
    console.log(this.wordZoom);
  }
  render() {
    return (
      <div className="word-zoom overlay">
        <canvas ref={wordZoom => (this.wordZoom = wordZoom)} />
      </div>
    );
  }
}

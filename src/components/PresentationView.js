import React from 'react';
import ReactDOM from 'react-dom';

import LiveTextView from './PresentationSubviews/LiveTextView';
import WordZoomView from './PresentationSubviews/WordZoomView';
import WordCloudView from './PresentationSubviews/WordCloudView';
import SentimentView from './PresentationSubviews/SentimentView';

export default class PresentationView extends React.Component {

  render() {
    return (
      <div className="presentation-view"><LiveTextView /></div>
    )
  }

};
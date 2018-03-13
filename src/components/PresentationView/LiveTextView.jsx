import React, { Fragment } from 'react';
import SentenceSpan from './SentenceSpan';
import '../../styles/LiveTextView.css';

class LiveTextView extends React.Component {
  state = {
    sentenceIndex: 1
  };

  accumulateSentenceIndex = () => {
    this.setState(prevState => ({
      sentenceIndex: prevState.sentenceIndex + 1
    }));
  };

  render() {
    const { sentenceIndex } = this.state;
    return (
      <section className="live-text-view">
        <div className="sentences-container">
          {this.props.mess.slice(0, sentenceIndex).map((channel, index) => (
            <SentenceSpan
              key={index}
              data={channel}
              onSentenceFinish={this.accumulateSentenceIndex}
            />
          ))}
        </div>
      </section>
    );
  }
}

export default LiveTextView;

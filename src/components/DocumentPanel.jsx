import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/markdown.css';

export default class DocumentPanel extends React.Component {
  render() {
    return (
      <article className="markdown-body">
        <ReactMarkdown source={this.props.input} />
      </article>
    );
  }
}

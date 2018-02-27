import React from 'react';

import { socket } from '../socket.config';

export default class DirectorView extends React.Component {
  constructor(props) {
    super(props);
    this.socket = socket;
    if (this.socket) {
      socket.emit('connected', { viewName: 'director' }); // View identification on server
    }
  }

  render() {
    return (
      <div className="director-view">
        <div className="director-view-main-grid">
          <p>Testing :)</p>
        </div>
      </div>
    );
  }
}

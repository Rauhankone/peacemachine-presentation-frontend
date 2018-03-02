import React from 'react';
import '../styles/NotFound.css';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="notFound">
        <h1>
          <span>
            <FontAwesomeIcon icon={['far', 'exclamation-circle']} />
          </span>
          Nothing here
        </h1>

        <div className="go-to">
          <h2>Go to...</h2>
          <ul>
            <li>
              <Link to="/input">Input</Link>
            </li>
            <li>
              <Link to="/director">Director</Link>
            </li>
            <li>
              <Link to="/presentation">Presentation</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

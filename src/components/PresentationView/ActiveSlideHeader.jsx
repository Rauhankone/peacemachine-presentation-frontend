import React from 'react';
import { capitalize } from '../../utils';

export default props => (
  <header
    className="active-slider-header"
    style={{
      backgroundColor: 'rgba(0,0,0,.3)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      color: '#eeffff',
      padding: '1rem'
    }}
  >
    {capitalize(props.slideName)}
  </header>
);

import React from 'react';
//        {props.text0}
export default props => {
  return (
    <div style={{ width: `500px`, height: `500px`, float: `left` }}>
      {props.data.map(a => {
        return <span>{a.transcript}</span>;
      })}
    </div>
  );
};

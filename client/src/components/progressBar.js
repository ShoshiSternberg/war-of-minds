import React from 'react';

const ProgressBar=(props)=> {
  const { completed } = props;

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "red",
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: 'green',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out',
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}> 
        <span style={labelStyles}>{`${completed}%`} right answers</span>
      </div>
    </div>
  );
}

export default ProgressBar;
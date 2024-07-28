import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ seconds, size, strokeBgColor, strokeColor, strokeWidth }) => {
  const milliseconds = seconds * 1000;
  const radius = size / 2;
  const circumference = size * Math.PI;

  const [countdown, setCountdown] = useState(milliseconds);
  const [isPlaying, setIsPlaying] = useState(false);

  const strokeDashoffset = () => {
    return circumference - (countdown / milliseconds) * circumference;
  };

  useEffect(() => {
    let interval;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (isPlaying) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 10);

        if (countdown <= 0) {
          clearInterval(interval);
          setCountdown(milliseconds);
          setIsPlaying(false);
        }
      }, 10);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [countdown, isPlaying, milliseconds]);

  const countdownSizeStyles = {
    height: size,
    width: size,
  };

  const textStyles = {
    color: strokeColor,
    fontSize: size * 0.3,
  };

  const secondsRemaining = (countdown / 1000).toFixed();

  return (
    <div>
      <div
        style={{
          pointerEvents: isPlaying ? 'none' : 'all',
          opacity: isPlaying ? 0.4 : 1,
        }}
      >
        {/* Start button */}
      </div>
      <div style={{ ...styles.countdownContainer, ...countdownSizeStyles }}>
        <p style={textStyles}>{secondsRemaining}s</p>
        <svg style={styles.svg}>
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="none"
            stroke={strokeBgColor}
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
        <svg style={styles.svg}>
          <circle
            strokeDasharray={circumference}
            strokeDashoffset={isPlaying ? strokeDashoffset() : 0}
            r={radius}
            cx={radius}
            cy={radius}
            fill="none"
            strokeLinecap="round"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
      </div>
    </div>
  );
};


const styles = {
  countdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 'auto',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: 'rotateY(-180deg) rotateZ(-90deg)',
    overflow: 'visible',
  },
  button: {
    fontSize: 16,
    padding: '15px 40px',
    margin: '10px auto 30px',
    display: 'block',
    backgroundColor: '#4d4d4d',
    color: 'lightgray',
    border: 'none',
    cursor: 'pointer',
    outline: 0,
  },
};

export default CountdownTimer;
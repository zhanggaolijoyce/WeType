import React from 'react';


function TextSample(props) {
  const characterStyle = {
    backgroundColor: props.backgroundColor || 'transparent',
  };

  
  const text = props.text.split('').map((char, index) => (
    <span key={index} style={characterStyle}>
      {char}
    </span>
  ));

  return <div className="text-sample">{text}</div>;
}

export default TextSample;

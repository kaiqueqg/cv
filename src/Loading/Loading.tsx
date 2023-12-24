import React from 'react'
import './Loading.scss'

const Loading: React.FC = () => {
  return(
    <img src={process.env.PUBLIC_URL + '/refresh.png'} className="loading-image rotate-icon" alt='a'></img>
  );
}

export default Loading
import React from 'react'
import './Loading.scss'

interface LoadingProps{
  IsBlack?: boolean
}

const Loading: React.FC<LoadingProps> = ({ IsBlack = false }) => {
  return(
    <React.Fragment>
      {IsBlack?
        <img src={process.env.PUBLIC_URL + '/refresh-white.png'} className="loading-image rotate-icon" alt='a'></img>
        :
        <img src={process.env.PUBLIC_URL + '/refresh-white.png'} className="loading-image rotate-icon" alt='a'></img>
      }
    </React.Fragment>
  );
}

export default Loading
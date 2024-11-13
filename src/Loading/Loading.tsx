import React from 'react'
import './Loading.scss'
import { ReactComponent as Icon } from '../assets/refresh.svg';

interface LoadingProps{
  IsBlack?: boolean,
}

const Loading: React.FC<LoadingProps> = ({ IsBlack = false }) => {
  return(
    <React.Fragment>
      {IsBlack && <Icon id='normalBlack' width="30px" height="30px"/>}
      {!IsBlack && <Icon id='normalBeige' width="30px" height="30px"/>}
    </React.Fragment>
  );
}

export default Loading
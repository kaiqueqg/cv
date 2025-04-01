import React from 'react'
import './Loading.scss'
import { ReactComponent as Icon } from '../assets/refresh.svg';
import PressImage from '../PressImage/PressImage';

interface LoadingProps{
  IsBlack?: boolean,
}

const Loading: React.FC<LoadingProps> = ({ IsBlack = false }) => {
  return(
    IsBlack?
      <img className={'loading-image normalBeige'} src={process.env.PUBLIC_URL + '/refresh-black.png'}/>
      :
      <img className={'loading-image normalBeige'} src={process.env.PUBLIC_URL + '/refresh.png'}/>
  );
}

export default Loading
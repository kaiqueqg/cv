import React from 'react'
import './loading.scss'
import { ReactComponent as Icon } from '../assets/refresh.svg';
import PressImage from '../press-image/press-image';
import { useThemeContext } from '../contexts/theme-context';

interface LoadingProps{
  text?: string,
  IsBlack?: boolean,
}

const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  const { globalTheme } = useThemeContext();
  return(
    <div className={'loadingContainer'}>
      {props.IsBlack?
        <img className={'loading-image normalBeige'} src={process.env.PUBLIC_URL + '/refresh-black.png'}/>
        :
        (globalTheme === 'Dark'?
          <img className={'loading-image normalBeige'} src={process.env.PUBLIC_URL + '/refresh.png'}/>
          :
          <img className={'loading-image normalBeige'} src={process.env.PUBLIC_URL + '/refresh-black.png'}/>
        )
      }
      {props.text && <div className={'loading-text'}>{props.text}</div>}
    </div>
  );
}

export default Loading
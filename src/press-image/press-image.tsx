import React, { useEffect, useState } from "react";
import { useLogContext } from "../contexts/log-context";
import './press-image.scss';
import Loading from "../loading/loading";
import { useThemeContext } from "../contexts/theme-context";
import { MessageType } from "../Types";

export interface PressImageProps{
  id?: string,
  src?: string,

  changeToSecondImage?: boolean,

  onClick?: () => void,
  hide?: boolean,
  
  disable?: boolean,
  disableSrc?: string,
  disableMsg?: string,
  
  confirm?: boolean,
  isLoading?: boolean,
  hideHoverEffect?: boolean,
  badgeText?: string,
  wasOk?: ()=>void,
  wasWrong?: ()=>void,

  isSelected?: boolean,
  isBlack: boolean,
  size?: 'big'|'bigger',
}

const PressImage = (props: PressImageProps) => {
  const { popMessage } = useLogContext();
  const { scss } = useThemeContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [text, setText] = useState<number>(2000);
  const [imageClass, setImageClass] = useState<string>('spin fade-in');

  const getHideImage = () => {
    return(
      <div id={props.id} className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')}>
        <div className={'pressImageImage'}></div>
      </div>
    )
  }

  const normalTouchEnd = () => {
    if(!props.disable) {
      if(props.confirm){
        setText(2000);
        confirm();
      }
      else if(props.onClick) props.onClick();
    }
    else if(props.disableMsg){
      popMessage(props.disableMsg);
    }
  }

  const getNormalImage = () => {
    const imageSrc = (props.disable&&props.disableSrc)?props.disableSrc:props.src;
    let classnameImageContainer = 'pressImageContainer ' + (props.isSelected && ' pressImageContainerSelected ');
    if(props.size){
      if(props.size === 'big') classnameImageContainer += 'pressImageContainerBig ';
      if(props.size === 'bigger') classnameImageContainer += 'pressImageContainerBigger ';
    }

    return(
      <div
        id={props.id}
        className={classnameImageContainer + (props.hideHoverEffect?' pressImageContainerHover':'')}
        onClick={normalTouchEnd}>
        {props.src && <img className={'pressImageImage ' } src={imageSrc}></img>}
        {props.badgeText && props.badgeText !== '' && <div className={'pressImageText'}>{props.badgeText}</div>}
      </div>
    )
  }

  const getConfirmingImage = () => {
    return(
      <div id={props.id} className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')} onClick={props.onClick}>
        <img className={'pressImageImage '} src={process.env.PUBLIC_URL + '/done.png'}></img>
      </div>
    )
  }

  const confirm = async () => {
    setIsConfirming(true);

    setTimeout(()=>{
      setIsConfirming(false);
    }, 2000);
  }
  
  return(
    props.isLoading?
    <Loading IsBlack={props.isBlack} text={props.badgeText}></Loading>
    :
    (props.hide ?
      getHideImage()
      :
      (props.confirm?
        (isConfirming?
          getConfirmingImage()
          :
          getNormalImage()
        )
      :
      getNormalImage()
      )
    )
  )
}

export default PressImage
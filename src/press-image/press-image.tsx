import React, { useEffect, useState } from "react";
import { useLogContext } from "../contexts/log-context";
import './press-image.scss';
import Loading from "../loading/loading";
import { useThemeContext } from "../contexts/theme-context";

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
  hideHoverEffect?: boolean,
  badgeText?: string,
  wasOk?: ()=>void,
  wasWrong?: ()=>void,
  
  isLoading?: boolean,
  isLoadingBlack?: boolean,
  isSelected?: boolean,
  rawImage?: boolean,

  size?: 'big'|'bigger',

  children?: React.ReactNode;
}

const PressImage = (props: PressImageProps) => {
  const { popMessage } = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [text, setText] = useState<number>(2000);

  const getHideImage = () => {
    return(
      <div id={props.id} className={'press-image-container ' + (props.hideHoverEffect?' press-image-container-hover':'')}>
        <div className={'press-image-image'}></div>
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
    let classnameImageContainer = 'press-image-container ' + (props.isSelected && ' press-image-container-selected ');
    if(props.size){
      if(props.size === 'big') classnameImageContainer += 'press-image-container-big ';
      if(props.size === 'bigger') classnameImageContainer += 'press-image-container-bigger ';
    }

    return(
      <div
        id={props.id}
        className={classnameImageContainer + (props.hideHoverEffect?'':' press-image-container-hover ')}
        onClick={normalTouchEnd}>
        {props.src && <img className={'press-image-image ' + (props.rawImage?'':' g-img-dark ')} src={imageSrc}></img>}
        {props.badgeText && props.badgeText !== '' && <div className={'press-image-text'}>{props.badgeText}</div>}
        {props.children}
      </div>
    )
  }

  const getConfirmingImage = () => {
    return(
      <div id={props.id} className={'press-image-container ' + (props.hideHoverEffect?' press-image-container-hover':'')} onClick={props.onClick}>
        <img className={'press-image-image '} src={process.env.PUBLIC_URL + '/done.png'}></img>
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
    <Loading IsBlack={props.isLoadingBlack} text={props.badgeText}></Loading>
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
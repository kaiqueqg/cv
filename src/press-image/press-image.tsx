import React, { useEffect, useState } from "react";
import { useLogContext } from "../contexts/log-context";
import './press-image.scss';
import Loading from "../loading/loading";
import { useThemeContext } from "../contexts/theme-context";

export interface PressImageProps{
  id?: string,
  src?: string,
  src2?: string,

  changeToSecondImage?: boolean,

  onClick?: () => void,
  hide?: boolean,

  onRightClick?: () => void,
  
  disable?: boolean,
  disableSrc?: string,
  disableMsg?: string,
  
  confirm?: boolean,
  hideHoverEffect?: boolean,
  holdHoverEffect?: boolean,
  badgeText?: string,
  wasOk?: ()=>void,
  wasWrong?: ()=>void,
  
  isLoading?: boolean,
  isLoadingBlack?: boolean,
  isSelected?: boolean,
  rawImage?: boolean,
  wasSelected?: boolean,

  fadeWhenNotSelected?: boolean,

  size?: 'big'|'bigger',

  children?: JSX.Element;

  /**Title */
  t?: string,
}

const PressImage = (props: PressImageProps) => {
  const { popMessage, log } = useLogContext();
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
      else if(props.onClick) {
        props.onClick();
      }
    }
    else if(props.disableMsg){
      popMessage(props.disableMsg);
    }
  }

  const contextMenuClick = (e: any) => {
    e.preventDefault();

    if(props.onRightClick) props.onRightClick();
  }

  const getNormalImage = () => {
    const imageSrc = (props.disable&&props.disableSrc)?props.disableSrc:(props.changeToSecondImage?props.src2:props.src);

    let classnameImageContainer = 'press-image-container ' + (props.isSelected && ' press-image-container-selected ') + (props.wasSelected && ' press-image-container-was-selected ');
    if(props.size){
      if(props.size === 'big') classnameImageContainer += ' press-image-container-big ';
      if(props.size === 'bigger') classnameImageContainer += ' press-image-container-bigger ';
    }

    let hoverClass = (props.hideHoverEffect || props.isSelected || props.disable?'':' press-image-container-hover ');
    hoverClass += (props.holdHoverEffect? ' press-image-container-hover-hold ':'');

    return(
      <div
        id={props.id}
        className={classnameImageContainer + hoverClass}
        onClick={normalTouchEnd}
        onContextMenu={contextMenuClick}>
        {props.src && 
        <img
          className={'press-image-image ' + 
            (props.rawImage?'':' g-img-dark ') +
            ((props.fadeWhenNotSelected && !props.isSelected)?' g-img-fade ':'') +
            (props.wasSelected? ' g-img-blur ' : '')}
          src={imageSrc}
          title={props.t}
          
        />
        }
        {props.badgeText && props.badgeText !== '' && <div className={'press-image-text no-select '}>{props.badgeText}</div>}
        {props.children}
      </div> 
    )
  }

  const onClickConfirm = () => {
    if(props.onClick) props.onClick();
    setIsConfirming(false);
  }

  const getConfirmingImage = () => {
    return(
      <div id={props.id} className={'press-image-container ' + (props.hideHoverEffect || props.isSelected ?' press-image-container-hover':'')} onClick={onClickConfirm}>
        <img className={'press-image-image '} src={process.env.PUBLIC_URL + '/done.png'} title='Confim'/>
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
import React, { useEffect, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import './PressImage.scss';
import Loading from "../Loading/Loading";

export interface PressImageProps{
  id?: string,
  src?: string,
  onClick?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  hide?: boolean,
  disable?: boolean,
  confirm?: boolean,
  isLoading?: boolean,
  hideHoverEffect?: boolean,
  text?: string,
  wasOk?: ()=>void,
  wasWrong?: ()=>void,
}

const PressImage = (props: PressImageProps) => {
  const {log} = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const [text, setText] = useState<number>(2000);

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
      else if(props.onPressOut) props.onPressOut();
    }
  }

  const getNormalImage = () => {
    return(
      <div
        id={props.id}
        className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')}
        onClick={normalTouchEnd}
        onTouchEnd={normalTouchEnd}
        onTouchStart={props.onPressIn}>
        {props.src && <img className={'pressImageImage'} src={props.src}></img>}
        {props.text && <div className={'pressImageText'}>{props.text}</div>}
      </div>
    )
  }

  const getConfirmingImage = () => {
    return(
      <div id={props.id} className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')} onClick={props.onClick} onTouchEnd={props.onPressOut} onTouchStart={props.onPressIn}>
        <img className={'pressImageImage'} src={process.env.PUBLIC_URL + '/done.png'}></img>
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
    <Loading></Loading>
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
      ))
  )
}

export default PressImage
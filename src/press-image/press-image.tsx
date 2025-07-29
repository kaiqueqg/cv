import React, { useEffect, useState } from "react";
import { useLogContext } from "../contexts/log-context";
import './press-image.scss';
import Loading from "../loading/loading";

export interface PressImageProps{
  id?: string,
  src?: string,

  changeToSecondImage?: boolean,

  onClick?: () => void,
  hide?: boolean,
  disable?: boolean,
  disableSrc?:string,
  confirm?: boolean,
  isLoading?: boolean,
  hideHoverEffect?: boolean,
  text?: string,
  wasOk?: ()=>void,
  wasWrong?: ()=>void,

  isBlack: boolean,
}

const PressImage = (props: PressImageProps) => {
  const {log} = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [text, setText] = useState<number>(2000);
  const [imageClass, setImageClass] = useState<string>('spin fade-in');

  // useEffect(() => {
  //   if (props.changeToSecondImage) {
  //   }
  // }, [props.changeToSecondImage]);

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
  }

  const getNormalImage = () => {
    const imageSrc = (props.disable&&props.disableSrc)?props.disableSrc:props.src;
    return(
      <div
        id={props.id}
        className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')}
        onClick={normalTouchEnd}>
        {props.src && <img className={'pressImageImage ' } src={imageSrc}></img>}
        {props.text && <div className={'pressImageText'}>{props.text}</div>}
      </div>
    )
  }

  const getConfirmingImage = () => {
    return(
      <div id={props.id} className={'pressImageContainer ' + (props.hideHoverEffect?' pressImageContainerHover':'')} onClick={props.onClick}>
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
    <Loading IsBlack={props.isBlack}></Loading>
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
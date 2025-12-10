import React, { useEffect, useState } from "react";
import { useLogContext } from "../contexts/log-context";
import './win95-btn.scss';
import Loading from "../loading/loading";
import { useThemeContext } from "../contexts/theme-context";
import { MessageType } from "../Types";

export interface Win95BtnProps{
  text?: string,
  imageSrc?: string,

  onClick?: ()=>void,

  disabled?: boolean,
}

const Win95Btn = (props: Win95BtnProps) => {
  const [isPresing, setIsPresing] = useState<boolean>(false);
  return(
    <div className={'win95btn-outter-container ' + (isPresing?' win95btn-color-outer-dark ':' win95btn-color-outer-bright ')}
      onMouseDown={()=> {setIsPresing(true)}}
      onMouseUp={()=> {setIsPresing(false)}}>
      <div className={'win95btn-inner-container ' + (isPresing?' win95btn-color-inner-dark ':' win95btn-color-inner-bright ')}>
        {props.text}
        {props.imageSrc && <img className={'win95btn-image'} src={process.env.PUBLIC_URL + props.imageSrc}></img>}
      </div>
    </div>
  )
}

export default Win95Btn;
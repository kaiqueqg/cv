import { useEffect, useState } from "react";
import './site-message-view.scss';
import { useLogContext } from "../../contexts/log-context";
import { MessageType, PopMessage } from "../../Types";
import log from "../../log/log";
import PressImage from "../../press-image/press-image";
import Button, { ButtonColor } from "../../button/button";

export interface SiteMessageViewProps {
  message: PopMessage, 
}

const SiteMessageView = (props: SiteMessageViewProps) => {
  const { removeMessage } = useLogContext();
  const { message } = props;

  useEffect(()=>{
    setTimeout(()=>{
      removeMessage(message.id);
    }, message.timeout);
  }
  ,[]);

  const getMessageClassname = () => {
    switch (message.type) {
      case MessageType.Alert:
        return 'messageBase messageAlert';       
      case MessageType.Error:
        return 'messageBase messageError';
      case MessageType.Normal:
        return 'messageBase messageNormal';
    }
  }

  const getMessageView = () => {
    let type = ButtonColor.NEUTRAL;

    switch(message.type){
      case MessageType.Alert:
        type = ButtonColor.YELLOW;
        break;
      case MessageType.Error:
        type = ButtonColor.RED;
        break;
      case MessageType.Normal:
        type = ButtonColor.GREEN;
        break;
    }

    return <Button key={message.id} color={type} text={message.text} onClick={() => {removeMessage(message.id);}}/>
  }

  return (
    getMessageView()
    // <div key={message.id} className={getMessageClassname()} onClick={}>
    //   {message.text}
    //   {/* <PressImage isBlack src={process.env.PUBLIC_URL + '/cancel.png'} onClick={() => {removeMessage(message.id);}}/> */}
    // </div>
  );
};

export default SiteMessageView;
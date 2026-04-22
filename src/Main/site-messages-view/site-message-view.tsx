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
    if(message.timeout !== Infinity) {
      setTimeout(()=>{
        removeMessage(message.id);
      }, message.timeout);
    }
  }
  ,[]);

  const getMessageView = () => {
    let type = ButtonColor.GREEN;

    switch(message.type){
      case MessageType.NEUTRAL:
        type = ButtonColor.NEUTRAL;
        break;
      case MessageType.ALERT:
        type = ButtonColor.YELLOW;
        break;
      case MessageType.ERROR:
        type = ButtonColor.RED;
        break;
      case MessageType.NORMAL:
        type = ButtonColor.GREEN;
        break;
    }

    return (
        <Button key={message.id} color={type} text={message.text} onClick={() => {removeMessage(message.id);}}/>
    )
  }

  return (
    getMessageView()
  );
};

export default SiteMessageView;
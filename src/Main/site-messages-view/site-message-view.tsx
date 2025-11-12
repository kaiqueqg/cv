import { useEffect, useState } from "react";
import './site-message-view.scss';
import { useLogContext } from "../../contexts/log-context";
import { MessageType, PopMessage } from "../../Types";
import log from "../../log/log";

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

  return (
    <div key={message.id} className={getMessageClassname()}>
      {message.text}
    </div>
  );
};

export default SiteMessageView;
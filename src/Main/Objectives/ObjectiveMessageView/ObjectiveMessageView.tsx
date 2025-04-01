import { useEffect, useState } from "react";
import './ObjectiveMessageView.scss';
import { useLogContext } from "../../../Contexts/LogContext";
import { MessageType, PopMessage } from "../../../Types";
import log from "../../../Log/Log";

export interface ObjectiveMessagesViewProps {
  message: PopMessage, 
}

const ObjectiveMessagesView = (props: ObjectiveMessagesViewProps) => {
  const { removeMessage } = useLogContext();
  const { message } = props;

  useEffect(()=>{
    setTimeout(()=>{
      removeMessage(message.id);
      log.w(message.timeout);
    }, message.timeout);
  },[]);

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
    <div className={getMessageClassname()}>
      {message.text}
    </div>
  );
};

export default ObjectiveMessagesView;
import { useEffect, useState } from "react";
import './site-messages-view.scss';
import { useLogContext } from "../../contexts/log-context";
import SiteMessageView from "./site-message-view";
import PressImage from "../../press-image/press-image";
import Button, { ButtonColor } from "../../button/button";
import { PopMessage } from "../../Types";

export interface SiteMessagesViewProps {
}
const SiteMessagesView = (props: SiteMessagesViewProps) => {
  const { messageList, clearMessages } = useLogContext();

  useEffect(()=>{
  },[messageList]);

  const getMessageList = () => {
    return messageList.map(item => (
      <SiteMessageView key={item.id} message={item} />
    ));
  };

  return (
    messageList.length === 0?
    <></>
    :
    <div className={'objectiveMessagesContainer'}>
      {messageList.length > 1 && <Button text="Clear all" color={ButtonColor.WHITE} onClick={clearMessages} src={process.env.PUBLIC_URL + '/trash.png'}/>}
      {getMessageList()}
    </div>
  );
};

export default SiteMessagesView;
import { useEffect, useState } from "react";
import './site-messages-view.scss';
import { useLogContext } from "../../contexts/log-context";
import SiteMessageView from "./site-message-view";

export interface SiteMessagesViewProps {
}
const SiteMessagesView = (props: SiteMessagesViewProps) => {
  const { messageList } = useLogContext();

  useEffect(()=>{
  },[messageList]);

  const getMessageList = () => {
    return(
      messageList.map((item)=>{
        return <SiteMessageView message={item}></SiteMessageView>
      })
    )
  }

  return (
    <div className={'objectiveMessagesContainer'}>
      {getMessageList()}
    </div>
  );
};

export default SiteMessagesView;
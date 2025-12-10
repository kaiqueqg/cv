import { useEffect, useState } from "react";
import './site-messages-view.scss';
import { useLogContext } from "../../contexts/log-context";
import SiteMessageView from "./site-message-view";
import PressImage from "../../press-image/press-image";

export interface SiteMessagesViewProps {
}
const SiteMessagesView = (props: SiteMessagesViewProps) => {
  const { messageList, clearMessages } = useLogContext();

  useEffect(()=>{
  },[messageList]);

  const getMessageList = () => {
    return(
      messageList.map((item)=>{
        return <SiteMessageView key={item.id} message={item}></SiteMessageView>
      })
    )
  }

  return (
    messageList.length === 0?
    <></>
    :
    <div className={'objectiveMessagesContainer'}>
      <div className='site-messages-top-menu' onClick={clearMessages}>
        Clear all
        {/* <PressImage isBlack onClick={clearMessages} src={process.env.PUBLIC_URL + '/trash-red.png'}/> */}
      </div>
      {getMessageList()}
    </div>
  );
};

export default SiteMessagesView;
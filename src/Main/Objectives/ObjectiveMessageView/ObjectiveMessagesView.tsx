import { useEffect, useState } from "react";
import './ObjectiveMessagesView.scss';
import { useLogContext } from "../../../Contexts/LogContext";
import ObjectiveMessageView from "./ObjectiveMessageView";

export interface ObjectiveMessagesViewProps {
}
const ObjectiveMessagesView = (props: ObjectiveMessagesViewProps) => {
  const { messageList } = useLogContext();

  useEffect(()=>{
  },[messageList]);

  const getMessageList = () => {
    return(
      messageList.map((item)=>{
        return <ObjectiveMessageView message={item}></ObjectiveMessageView>
      })
    )
  }

  return (
    <div className={'objectiveMessagesContainer'}>
      {getMessageList()}
    </div>
  );
};

export default ObjectiveMessagesView;
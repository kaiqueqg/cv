import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../../contexts/user-context";
import {local} from "../../../storage/storage";
import './objective-backup-side-view.scss';
import Loading from "../../../loading/loading";
// import { objectiveslistApi } from "../../../requests-sdk/requests-sdk";
import { useLogContext } from "../../../contexts/log-context";
import { useRequestContext } from "../../../contexts/request-context";

interface ObjectiveBackupSideViewProps{
}

const ObjectiveBackSideView: React.FC<ObjectiveBackupSideViewProps> = (props) => {
  const { identityApi, objectiveslistApi } = useRequestContext();
  const [backupDataList, setBackupDataList] = useState<string[]>([]);
  const [isGettingBackupData, setIsGettingBackupData] = useState<boolean>(false);

  const { log } = useLogContext();

  useEffect(()=>{
    getBackupData();
  }, []);

  const getBackupData = async () => {
    setIsGettingBackupData(true);
    const data = await objectiveslistApi.getBackupDataList();
    if(data){
      setBackupDataList(data);
      log.g(data);
    }

    setIsGettingBackupData(false);
  }

  const getBackupList = () => {
    let rtnView: JSX.Element[] = [<></>];

    return rtnView;
  }

  return(
    <div className='backupViewContainer'>asd</div>
  );
}

export default ObjectiveBackSideView;
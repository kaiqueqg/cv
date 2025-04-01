import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../../Contexts/UserContext";
import storage from "../../../Storage/Storage";
import './ObjectiveBackupSideView.scss';
import Loading from "../../../Loading/Loading";
import { objectiveslistApi } from "../../../Requests/RequestFactory";
import { useLogContext } from "../../../Contexts/LogContext";

interface ObjectiveBackupSideViewProps{
}

const ObjectiveBackSideView: React.FC<ObjectiveBackupSideViewProps> = (props) => {
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
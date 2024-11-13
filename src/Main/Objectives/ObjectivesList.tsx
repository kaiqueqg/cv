import { useEffect, useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import storage from "../../Storage/Storage";
import './ObjectivesList.scss';
import { objectiveslistApi } from "../../Requests/RequestFactory";
import log from "../../Log/Log";
import { Item, Objective, Question, Step, Wait } from "../../TypesObjectives";
import ObjectiveView from "./ObjectiveView/ObjectiveView";
import Loading from "../../Loading/Loading";
import ObjectiveClosedView from "./ObjectiveClosedView/ObjectiveClosedView";

import { ReactComponent as Checked} from '../../assets/checked.svg';

interface ObjectivesListProps{}

const ObjectivesList: React.FC<ObjectivesListProps> = (props) => {
  const { user, setUser, testServer } = useUserContext();

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isAddingNewObjective, setIsAddingNewObjective] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(true);
  const [isRequestingObjectives, setIsRequestingObjectives] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [objsSelected, setObjsSelected] = useState<Objective[]>([]);
  const [isEndingPos, setIsEndingPos] = useState<any>(false);

  useEffect(() => {
    verifyLogin();
    getObjectives();
  }, []);

  let objsToChangePos:Objective[] = [];

  const parseJwt = (token :string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const verifyLogin = async () => {
    const token = await storage.getToken();
    const user = await storage.getUser();

    if(token && user){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(parsedToken.exp === undefined || tokenDate > now){
        setUser(await storage.getUser());
      }
    }
  }

  const getObjectives = async () => {

    const data = await objectiveslistApi.syncObjectivesList({});
    if(data && data.Objectives){
      const sorted = data.Objectives.sort((a: Objective, b: Objective) => a.Pos-b.Pos);
      setObjectives(sorted);
    }
  }

  const addNewObjective = async () => {
    setIsAddingNewObjective(true);
    
    try {
      const emptyObjective: Objective = {
        ObjectiveId: '',
        IsOpen: true,
        IsShowing: true,
        Title: '',
        Theme: 'darkBlue',
        UserId: '',
        Done: false,
        Pos: objectives.length,
        LastModified: new Date().toISOString(),
        IsShowingCheckedGrocery: true,
        IsShowingCheckedStep: true,
      }
      
      const data = await objectiveslistApi.putObjective(emptyObjective, () => {testServer();});
      if(data){
        await getObjectives();
        setIsAddingNewObjective(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsAddingNewObjective(false);
  }

  const putObjectiveInDisplay = async (obj?: Objective, remove?: boolean) => {
    if (obj) {
      setObjectives((prevObjectives) => {
        let newObjs = [];
        if (remove) {
          newObjs = prevObjectives.filter((o: Objective) => o.ObjectiveId !== obj.ObjectiveId);
        } else {
          const itemInList = prevObjectives.find((o: Objective) => o.ObjectiveId === obj.ObjectiveId);
          if (itemInList) {
            newObjs = prevObjectives.map((o: Objective) => o.ObjectiveId === obj.ObjectiveId ? obj : o);
          } else {
            newObjs = [...prevObjectives, obj];
          }
        }
        const sorted = newObjs.sort((a, b) => a.Pos - b.Pos);
        return sorted;
      });
    } else {
      await getObjectives();
    }
  }

  const startEditingPos = () => {
    setIsEditingPos(!isEditingPos);
  }

  const cancelEditingPos = () => {
    setObjsSelected([]);
    objsToChangePos = [];
    setIsEditingPos(false);
    setIsEndingPos(false);
  }

  const addingRemovingItem = (obj: Objective) => {
    const filteredList = objsSelected.filter((i) => i.ObjectiveId !== obj.ObjectiveId);

    if(filteredList.length !== objsSelected.length){
      setObjsSelected(filteredList);
    }
    else{
      setObjsSelected([...objsSelected, obj]);
    }
  }

  const onEditingPosTo = () => {
    objsToChangePos = objsSelected
    setIsEndingPos(true);
  }

  const endEnditingPos = async (objTo: Objective) => {
    const newList = objectives.filter((o: Objective) => !objsSelected.includes(o));
    const index = newList.indexOf(objTo);
    const before = newList.slice(0, index+1);
    const after = newList.slice(index+1);

    let itemsToUpdate: Objective[] = [];
    let finalList = [...before, ...objsSelected, ...after];
    for(let i = 0; i < finalList.length; i++){
      if(finalList[i].Pos !== i) itemsToUpdate.push(finalList[i]);
      finalList[i].Pos = i;
    }

    try{
      setIsRequestingObjectives(true);
      const data = await objectiveslistApi.putObjectives(finalList, () => {testServer();});
      if(data) {
        setObjectives(data);
      }
      else{
        // add warning
      }
    }
    catch(err){}

    setIsRequestingObjectives(false);
    cancelEditingPos();
  }

  const getSideObjective = (objective: Objective) => {
    return (
      <ObjectiveClosedView objective={objective} putObjectiveInDisplay={putObjectiveInDisplay}></ObjectiveClosedView>
    )
  };

  const getObjectiveList = () => {
    let rtnView: JSX.Element[] = [];

    for(let i = 0; i < objectives.length; i++){
      if(objectives[i].IsOpen) {
        const isSelected = objsSelected.includes(objectives[i]);
        rtnView.push(
          <div className={'objectiveRow ' + (isEditingPos ? 'isEditing' : '') + (isSelected?' objectiveRowSelected':'') + (isEndingPos&&isSelected?' objectiveRowSelectedEnding':'')} onClick={() => {isEditingPos && (isEndingPos? endEnditingPos(objectives[i]) : addingRemovingItem(objectives[i]))}}>
            <ObjectiveView 
              key={objectives[i].ObjectiveId}
              objective={objectives[i]}
              putObjective={putObjectiveInDisplay}
              isObjsEditingPos={isEditingPos}
            ></ObjectiveView>
          </div>
        )
      }
    }

    return rtnView;
  }
  
  return (
    <div className='objectivesContainer'>
      {user && user.Status==='Active' ?
        isRequestingObjectives?
        <div className='loadingListContainer'>
          <Loading></Loading>
        </div>
        :
        (<div className='objectivesListContainer'>
          <div className='objectivesListSideContainer'> 
            {isSidePanelOpen ? 
              <div className='objectivesSidePanelOpened'>
                <img className='objectivesImage' onClick={()=>{setIsSidePanelOpen(false)}} src={process.env.PUBLIC_URL + '/arrow-left-filled.png'}></img>
                {!isEditingPos && <img className='objectivesImage' onClick={startEditingPos} src={process.env.PUBLIC_URL + '/updown.png'}></img>}
                {isEditingPos && <img className='objectivesImage' onClick={cancelEditingPos} src={process.env.PUBLIC_URL + '/cancel.png'}></img>}
                {(isEditingPos && !isEndingPos) && 
                  ((objsSelected.length !== objectives.length && objsSelected.length > 0)?
                  <img className='objectivesImage' onClick={onEditingPosTo} src={process.env.PUBLIC_URL + '/move.png'}></img>
                  :
                  <div className='objectivesImage'></div>)
                }
                {!isEditingPos &&
                  (isAddingNewObjective?
                    <Loading></Loading>
                    :
                    <img className="objectivesImage" src={process.env.PUBLIC_URL + '/add.png'} alt='meaningfull text' onClick={addNewObjective}></img>
                  )
                }
                {objectives.map((objective: Objective)=>(
                  !objective.IsOpen && getSideObjective(objective)
                ))}
              </div>
              :
              <div className='objectivesSidePanelClosed'>
                <img className='objectivesImage' onClick={()=>{setIsSidePanelOpen(true)}} src={process.env.PUBLIC_URL + '/arrow-right-filled.png'}></img>
                {!isEditingPos && <img className='objectivesImage' onClick={startEditingPos} src={process.env.PUBLIC_URL + '/updown.png'}></img>}
                {isEditingPos && <img className='objectivesImage' onClick={cancelEditingPos} src={process.env.PUBLIC_URL + '/cancel.png'}></img>}
                {(isEditingPos && !isEndingPos) && 
                  ((objsSelected.length !== objectives.length && objsSelected.length > 0)?
                  <img className='objectivesImage' onClick={onEditingPosTo} src={process.env.PUBLIC_URL + '/move.png'}></img>
                  :
                  <div className='objectivesImage'></div>)
                }
                {!isEditingPos &&
                  (isAddingNewObjective?
                    <Loading></Loading>
                    :
                    <img className="objectivesImage" src={process.env.PUBLIC_URL + '/add.png'} alt='meaningfull text' onClick={addNewObjective}></img>
                  )
                }
              </div>
            }
          </div>
          <div className='objectivesListMainContainer'>
            {getObjectiveList()}
            <div style={{height: '700px'}}></div>
          </div>
        </div>)
       :
        <div className='needLogin'>
          Need login
        </div>
      }
    </div>
  );
}

export default ObjectivesList;
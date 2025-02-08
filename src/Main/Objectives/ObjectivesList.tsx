import { useEffect, useState } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import storage from "../../Storage/Storage";
import './ObjectivesList.scss';
import { objectiveslistApi } from "../../Requests/RequestFactory";
import log from "../../Log/Log";
import { Item, Objective, Question, Step, Wait } from "../../TypesObjectives";
import ObjectiveView from "./ObjectiveView/ObjectiveView";
import Loading from "../../Loading/Loading";
import ObjectiveHideView from "./ObjectiveHideView/ObjectiveHideView";
import { writeFile } from "fs";
import ObjectiveArchivedView from "./ObjectiveArchivedView/ObjectiveArchivedView";

interface ObjectivesListProps{}

enum SidePanelView {Archived, Closed};

const ObjectivesList: React.FC<ObjectivesListProps> = (props) => {
  const { user, setUser, testServer, 
    availableTags, writeAvailableTags, removeAvailableTags,
    selectedTags, writeSelectedTags, putSelectedTags, removeSelectedTags
  } = useUserContext();

  const [isBelow700px, setIsBelow700px] = useState(window.innerWidth < 700);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isUpdatingObjectives, setIsUpdatingObjectives] = useState<boolean>(false);
  const [isAddingNewObjective, setIsAddingNewObjective] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
  const [currentSidePanelView, setCurrentSidePanelView] = useState<SidePanelView>(SidePanelView.Closed);

  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [objsSelected, setObjsSelected] = useState<Objective[]>([]);
  const [isEndingPos, setIsEndingPos] = useState<any>(false);
  
  useEffect(() => {
    verifyLogin();
    updateObjectives(true);

    const handleResize = () => {
      setIsBelow700px(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const updateObjectives = async (updateSelectedTags?:boolean) => {
    setIsUpdatingObjectives(true);

    const data = await objectiveslistApi.syncObjectivesList({});
    if(data && data.Objectives){
      const sorted = data.Objectives.sort((a: Objective, b: Objective) => a.Pos-b.Pos);
      setObjectives(sorted);

      //updating available tags and selected tags
      if(sorted) {
        const tags = [];
        for(let i = 0; i < sorted.length; i++){
          tags.push(...sorted[i].Tags);
        }
        const uniqueTags = Array.from(new Set(tags));
        writeAvailableTags(uniqueTags);
      }
    }

    setIsUpdatingObjectives(false);
  }

  const addNewObjective = async () => {
    setIsAddingNewObjective(true);
    
    try {
      const emptyObjective: Objective = {
        ObjectiveId: '',
        IsShowing: true,
        IsArchived: false,
        Title: 'Title',
        Theme: 'noTheme',
        UserId: '',
        Done: false,
        Pos: objectives.length,
        LastModified: new Date().toISOString(),
        IsShowingCheckedGrocery: true,
        IsShowingCheckedStep: true,
        IsShowingCheckedExercise: true,
        IsShowingCheckedMedicine: true,
        Tags: [],
      }
      
      const data = await objectiveslistApi.putObjective(emptyObjective, () => {testServer();});
      if(data){
        await updateObjectives();
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

        const tagSet = new Set<string>();
        for (const obj of sorted) {
          for (const tag of obj.Tags) {
            tagSet.add(tag);
          }
        }
        writeAvailableTags(Array.from(tagSet))

        return sorted;
      });
    } else {
      await updateObjectives();
    }
  }

  const startEditingPos = () => {
    setIsEditingPos(!isEditingPos);
  }

  const cancelEditingPos = () => {
    setObjsSelected([]);
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
      setIsUpdatingObjectives(true);
      const data = await objectiveslistApi.putObjectives(finalList, () => {testServer();});
      if(data) {
        setObjectives(data);
      }
      else{
        // add warning
      }
    }
    catch(err){}

    setIsUpdatingObjectives(false);
    cancelEditingPos();
  }

  const getObjectiveList = () => {
    let rtnView: JSX.Element[] = [];

    for(let i = 0; i < objectives.length; i++){
      const hasTagSelected = objectives[i].Tags.length>0? selectedTags.some((item)=>objectives[i].Tags.includes(item)): true;

      const shouldBeDisplayed = !objectives[i].IsArchived && objectives[i].IsShowing && hasTagSelected;
      if(shouldBeDisplayed) {
        const isSelected = objsSelected.includes(objectives[i]);
        rtnView.push(
          <div 
            key={objectives[i].ObjectiveId}
            className={'objectiveRow ' + (isEditingPos ? 'isEditing' : '') + (isSelected?' objectiveRowSelected':'') + (isEndingPos&&isSelected?' objectiveRowSelectedEnding':'')}
            onClick={() => {isEditingPos && (isEndingPos? endEnditingPos(objectives[i]) : addingRemovingItem(objectives[i]))}}>
            <ObjectiveView 
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

  const getObjectiveArchivedList = () => {
    let rtnView: JSX.Element[] = [];

    for(let i = 0; i < objectives.length; i++){
      const hasTagSelected = objectives[i].Tags.length>0? selectedTags.some((item)=>objectives[i].Tags.includes(item)): true;
      if(objectives[i].IsArchived && hasTagSelected) {

        const isSelected = objsSelected.includes(objectives[i]);
        rtnView.push( 
          <div 
            key={objectives[i].ObjectiveId}
            className={'objectiveSideRow ' + (isEditingPos ? 'isEditing' : '') + (isSelected?' objectiveSideRowSelected':'') + (isEndingPos&&isSelected?' objectiveSideRowSelectedEnding':'')}
            onClick={() => {isEditingPos && (isEndingPos? endEnditingPos(objectives[i]) : addingRemovingItem(objectives[i]))}}>
            <ObjectiveArchivedView key={objectives[i].ObjectiveId} objective={objectives[i]} putObjectiveInDisplay={putObjectiveInDisplay} isObjsEditingPos={isEditingPos}></ObjectiveArchivedView>
          </div>
        )
      }
    }

    return rtnView;
  }

  const getObjectiveClosedList = () => {
    let rtnView: JSX.Element[] = [];

    for(let i = 0; i < objectives.length; i++){
      const hasTagSelected = objectives[i].Tags.length>0? selectedTags.some((item)=>objectives[i].Tags.includes(item)): true;
      if(!objectives[i].IsArchived && !objectives[i].IsShowing && hasTagSelected) {
        
        const isSelected = objsSelected.includes(objectives[i]);
        rtnView.push( 
          <div 
            key={objectives[i].ObjectiveId}
            className={'objectiveSideRow ' + (isEditingPos ? 'isEditing' : '') + (isSelected?' objectiveSideRowSelected':'') + (isEndingPos&&isSelected?' objectiveSideRowSelectedEnding':'')}
            onClick={() => {isEditingPos && (isEndingPos? endEnditingPos(objectives[i]) : addingRemovingItem(objectives[i]))}}>
            <ObjectiveHideView key={objectives[i].ObjectiveId} objective={objectives[i]} putObjectiveInDisplay={putObjectiveInDisplay} isObjsEditingPos={isEditingPos}></ObjectiveHideView>
          </div>
        )
      }
    }

    return rtnView;
  }

  const changeToNoneTag = () => {
    writeSelectedTags([]);
  }

  const changeToAllTag = () => {
    writeSelectedTags([...availableTags]);
  }
  
  const changeSelectedTag = (tag:string, event: React.MouseEvent) => {
    if(event.shiftKey && event.button === 0){
      event.preventDefault();
      if(selectedTags.includes(tag)){
        removeSelectedTags([tag]);
      }
      else{
        putSelectedTags([tag]);
      }
    }
    else if(event.ctrlKey && event.button === 0){
      event.preventDefault();
      changeToAllTag();
    }
    else{
      writeSelectedTags([tag]);
    }
  }

  const getTagList = () => {
    let list:JSX.Element[] = [
      <div key={'tagall'} className={'objectivesListMainTag objectivesListMainTagSpecial'} onMouseDown={(e) => changeToAllTag()}>All</div>,
      <div key={'tagnone'} className={'objectivesListMainTag objectivesListMainTagSpecial'} onMouseDown={(e) => changeToNoneTag()}>None</div>,
    ]
    list = [...list, ...availableTags.map((tag:string) => getTagView(tag))];

    return list;
  }

  const getTagView = (tag:string) => {
    let classname = 'objectivesListMainTag';
    if(selectedTags.includes(tag)){ 
      classname += ' objectivesListMainTagSelected';
    }

    return <div key={'tag'+tag} className={classname} onMouseDown={(e) => changeSelectedTag(tag, e)}>{tag}</div>;
  }

  const getSideMenu = () => {
    return(
      <div className='objectivesSidePanelOpened'>
        <div className='objectivesSidePanelOpenedButtons'>
          {isSidePanelOpen && !isEditingPos && <img className='objectivesImage' onClick={startEditingPos} src={process.env.PUBLIC_URL + '/updown.png'}></img>}
          {isSidePanelOpen && isEditingPos && <img className='objectivesImage' onClick={cancelEditingPos} src={process.env.PUBLIC_URL + '/cancel.png'}></img>}
          {(isSidePanelOpen && isEditingPos && !isEndingPos) && 
            ((objsSelected.length !== objectives.length && objsSelected.length > 0)?
            <img className='objectivesImage' onClick={onEditingPosTo} src={process.env.PUBLIC_URL + '/move.png'}></img>
            :
            <div className='objectivesImage'></div>)
          }
          {isSidePanelOpen && !isEditingPos && currentSidePanelView === SidePanelView.Archived && 
            <img className="objectivesImage" src={process.env.PUBLIC_URL + '/archived.png'} alt='meaningfull text' onClick={()=>setCurrentSidePanelView(SidePanelView.Closed)}></img>
          }
          {isSidePanelOpen && !isEditingPos && currentSidePanelView === SidePanelView.Closed && 
            <img className="objectivesImage" src={process.env.PUBLIC_URL + '/hide.png'} alt='meaningfull text' onClick={()=>setCurrentSidePanelView(SidePanelView.Archived)}></img>
          }
          {isSidePanelOpen && !isEditingPos &&
            (isAddingNewObjective?
              <Loading></Loading>
              :
              <img className="objectivesImage" src={process.env.PUBLIC_URL + '/add.png'} alt='meaningfull text' onClick={addNewObjective}></img>
            )
          }
          {isSidePanelOpen?
            <img 
              className='objectivesImage'
              onClick={()=>{setIsSidePanelOpen(false)}}
              src={process.env.PUBLIC_URL + (isBelow700px?'/up-chevron.png':'/arrow-left-filled.png')}></img>
            :
            <img
              className='objectivesImage'
              onClick={()=>{setIsSidePanelOpen(true)}}
              src={process.env.PUBLIC_URL + (isBelow700px?'/down-chevron.png':'/arrow-right-filled.png')}></img>
          }
        </div>
        {isSidePanelOpen && currentSidePanelView === SidePanelView.Archived && getObjectiveArchivedList()}
        {isSidePanelOpen && currentSidePanelView === SidePanelView.Closed && getObjectiveClosedList()}
      </div>
    )
  }
  
  return (
    <div className='objectivesContainer'>
      {user && user.Status==='Active' ?
        isUpdatingObjectives?
        <div className='loadingListContainer'>
          <Loading></Loading>
        </div>
        :
        (<div className='objectivesListContainer'>
          <div className={isSidePanelOpen?'objectivesListSideContainer':'objectivesListSideContainerClosed'}> 
            {getSideMenu()}
          </div>
          <div className='objectivesListMainAndTagsContainer'>
            <div className='objectivesListMainTags'>{ getTagList() }</div>
            <div className='objectivesListMainContainer'>
              {getObjectiveList()}
            </div>
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
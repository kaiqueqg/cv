import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/user-context";
import {local} from "../../storage/storage";
import './objectives-list.scss';
// import { objectiveslistApi } from "../../requests-sdk/requests-sdk";
import log from "../../log/log";
import { Item, Objective, ObjectivesList as ObjectivesListType, Question, Step, Wait } from "../../TypesObjectives";
import { ObjectiveView } from "./objective-view/objective-view";
import Loading from "../../loading/loading";
import ObjectiveHideView from "./objective-hide-view/objective-hide-view";
import ObjectiveArchivedView from "./objective-archived-view/objective-archived-view";
import { useLogContext } from "../../contexts/log-context";
import { MessageType, Theme } from "../../Types";
import PressImage from "../../press-image/press-image";
import ObjectiveBackSideView from "./objective-backup-side-view/objective-backup-side-view";
import { useRequestContext } from "../../contexts/request-context";
import { useNavigate } from 'react-router-dom';
import Button, { ButtonColor } from "../../button/button";

interface ObjectivesListProps{}

enum SidePanelView {Archived, Closed, Backup};

const ObjectivesList: React.FC<ObjectivesListProps> = (props) => {
  const { user, setUser,
    // firstLogin, writeFirstLogin,
    availableTags, writeAvailableTags, removeAvailableTags,
    selectedTags, writeSelectedTags, putSelectedTags, removeSelectedTags
  } = useUserContext();
  const { popMessage } = useLogContext();
  const { identityApi, objectiveslistApi } = useRequestContext();
  const navigate = useNavigate();

  const [isBelow700px, setIsBelow700px] = useState(window.innerWidth < 700);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isUpdatingObjectives, setIsUpdatingObjectives] = useState<boolean>(false);
  const [isAddingNewObjective, setIsAddingNewObjective] = useState<boolean>(false);
  const [isUploadingBackupData, setIsUploadingBackupData] = useState<boolean>(false);
  const [isBackingUpData, setIsBackingUpData] = useState<boolean>(false);
  const [currentSidePanelView, setCurrentSidePanelView] = useState<SidePanelView>(SidePanelView.Closed);

  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [objsSelected, setObjsSelected] = useState<Objective[]>([]);
  const [isEndingPos, setIsEndingPos] = useState<any>(false);

  const [isShowingObjsList, setIsShowingObjsList] = useState<boolean>(false);
  
  useEffect(() => {
    verifyLogin();
    updateObjectives();

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
    const token = await local.getToken();
    const user = await local.getUser();

    if(token && user){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(parsedToken.exp === undefined || tokenDate > now){
        setUser(await local.getUser());
      }
    }
  }

  ///TODO too heavy
  const updateObjectives = async () => {
    setIsUpdatingObjectives(true);

    const data = await objectiveslistApi.getObjectiveList();
    if(data){
      const sorted = data.sort((a: Objective, b: Objective) => a.Pos-b.Pos);
      setObjectives(sorted);

      //updating available tags and selected tags
      if(sorted) {
        const tags = [];
        for(let i = 0; i < sorted.length; i++){
          tags.push(...sorted[i].Tags);
        }
        const uniqueTags = Array.from(new Set(tags));
        writeAvailableTags(uniqueTags);
        
        const v = local.getFirstLogin(); //I need a better solution
        if(v) {
          writeSelectedTags(uniqueTags);
          local.setFirstLogin(false);
        }
      }
    }

    setIsUpdatingObjectives(false);
  }

  const addNewObjective = async () => {
    setIsAddingNewObjective(true);

    const tag = selectedTags.find((t: string) => t !== 'Pin');
    
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
        Tags: selectedTags.length === 2 && tag?[tag]:[],
      }
      
      const data = await objectiveslistApi.putObjectives([emptyObjective], (error:any) => popMessage(error.Message, MessageType.Error, 10));
      if(data){
        putObjectiveInDisplay(data[0]);
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
          if(obj.Tags) {
            for (const tag of obj.Tags) {
              tagSet.add(tag);
            }
          }
          else{
            log.r(obj.Title + ' has no tags')
          }
        }
        writeAvailableTags(['Pin', ...Array.from(tagSet)])

        return sorted;
      });
    } else {
      await updateObjectives();
    }
  }

  //! Dangerous
  const deleteObjectiveItemsInDisplay = (objectiveId: string, items: Item[]) => {
    objectiveRefs.current[objectiveId].deleteItems(items);
  }

  const startEditingPos = () => {
    popMessage("Select items to change position.");
    setIsEditingPos(true);
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
    popMessage("Select position to put the items AFTER.");
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
      setObjectives(finalList);
      const data = await objectiveslistApi.putObjectives(finalList, (error:any) => popMessage(error.Message, MessageType.Error, 10));
      if(data) {
      }
      else{
      }
    }
    catch(err){}

    setIsUpdatingObjectives(false);
    cancelEditingPos();
  }

  const objectiveRefs = useRef<Record<string, any>>({});
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
              ref={el => objectiveRefs.current[objectives[i].ObjectiveId] = el}
              objective={objectives[i]}
              putObjective={putObjectiveInDisplay}
              deleteObjectiveItemsInDisplay={deleteObjectiveItemsInDisplay}
              isObjsEditingPos={isEditingPos}
            ></ObjectiveView>
          </div>
        )
      }
    }

    return rtnView;
  }

  const getObjectiveArchivedListView = () => {
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

  const getObjectiveClosedListView = () => {
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

    return <div className={'objectiveSideSroll'}>{rtnView}</div>;
  }

  const changeToNoneTag = () => {
    writeSelectedTags([]);
  }

  const changeToAllTag = () => {
    writeSelectedTags([...availableTags]);
  }
  
  const changeSelectedTag = (tag:string, event: React.MouseEvent) => {
    
    if(event.shiftKey && event.button === 0){
      if(tag === 'Pin') return;
      event.preventDefault();
      if(selectedTags.includes(tag)){
        removeSelectedTags([tag]);
      }
      else{
        putSelectedTags(['Pin', tag]);
      }
    }
    else if(event.ctrlKey && event.button === 0){
      event.preventDefault();
      changeToAllTag();
    }
    else{
      writeSelectedTags(['Pin', tag]);
    }
  }

  const getTagList = () => {

    let list:JSX.Element[] = [
      <div key={'tagall'} className={'objectivesListMainTagSpecial'} onMouseDown={(e) => changeToAllTag()}>All</div>,
      <div key={'tagnone'} className={'objectivesListMainTagSpecial'} onMouseDown={(e) => changeToNoneTag()}>None</div>,
    ]
    const availableTagsSorted = availableTags.sort((a, b) => {
      if (a === "Pin") return -1;
      if (b === "Pin") return 1;
      return a.localeCompare(b);
    });
    list = [...list, ...availableTagsSorted.map((tag:string) => getTagView(tag))];

    return (
      <div className='objectivesListMainTags'>{list}</div>
    );
  }

  const getTagView = (tag:string) => {
    let classname = 'objectivesListMainTag';
    if(selectedTags.includes(tag)){ 
      classname += ' objectivesListMainTagSelected';
    }

    return <div key={'tag'+tag} className={classname} onMouseDown={(e) => changeSelectedTag(tag, e)}>{tag}</div>;
  }

  const backupData = async () => {
    setIsBackingUpData(true);
    const data:{success: boolean} = await objectiveslistApi.backupData((error:any) => popMessage(error.Message, MessageType.Error, 10));
    console.log(data);
    if(data && data.success){
      popMessage('Backup done: ' + data.success);
    }
    else{
      popMessage('Some unknown error...');
    }
    setIsBackingUpData(false);
  }

  const getSideMenuTitle = () => {
    if(currentSidePanelView === SidePanelView.Archived){
      return <div className='objectivesSidePanelTitleText'>ARCHIVED OBJECTIVES</div>;
    }
    else{
      return <div className='objectivesSidePanelTitleText'>HIDDEN OBJECTIVES</div>;
    }
  }

  const getSideMenu = () => {
    return(
      <div className={'objectivesListSideContainer '}>
        <div className={'objectivesSidePanel ' + ((currentSidePanelView === SidePanelView.Archived)?'objectivesSidePanelArchived':'')}>
          <div className={'objectivesSidePanelTitle ' + ((currentSidePanelView === SidePanelView.Archived)?'objectivesSidePanelTitleArchived':'')}>
            <PressImage />
            {getSideMenuTitle()}
            {isShowingObjsList && <PressImage onClick={() => {setIsShowingObjsList(!isShowingObjsList)}} src={process.env.PUBLIC_URL + '/down-chevron.png'}/>}
            {!isShowingObjsList && <PressImage onClick={() => {setIsShowingObjsList(!isShowingObjsList)}} src={process.env.PUBLIC_URL + '/up-chevron.png'}/>}
          </div>
          <div className='objectivesSidePanelButtons'>
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <PressImage onClick={()=>{backupData()}} src={process.env.PUBLIC_URL + '/backup.png'} isLoading={isBackingUpData} isLoadingBlack={false}/>
            <PressImage onClick={()=>{triggerFileInput()}} src={process.env.PUBLIC_URL + '/upload.png'} isLoading={isUploadingBackupData} isLoadingBlack={false}/>
            {!isEditingPos && <PressImage onClick={startEditingPos} src={process.env.PUBLIC_URL + '/change.png'} disable={objectives.length < 2} disableSrc={process.env.PUBLIC_URL + '/change-grey.png'} isLoadingBlack={false}/>}
            {isEditingPos && <PressImage onClick={cancelEditingPos} src={process.env.PUBLIC_URL + '/cancel.png'} isLoadingBlack={false}/>}
            {(isEditingPos && !isEndingPos) && 
              ((objsSelected.length !== objectives.length && objsSelected.length > 0)?
                <PressImage onClick={onEditingPosTo} src={process.env.PUBLIC_URL + '/move.png'} isLoadingBlack={false}/>
                :
                <div className='objectivesImage'></div>
              )
            }
            {!isEditingPos && currentSidePanelView === SidePanelView.Closed &&  <PressImage src={process.env.PUBLIC_URL + '/hide.png'} onClick={()=>setCurrentSidePanelView(SidePanelView.Archived)} isLoadingBlack={false}/>}
            {!isEditingPos && currentSidePanelView === SidePanelView.Archived &&  <PressImage src={process.env.PUBLIC_URL + '/archived.png'} onClick={()=>setCurrentSidePanelView(SidePanelView.Closed)} isLoadingBlack={false} isSelected/>}
            {!isEditingPos && <PressImage src={process.env.PUBLIC_URL + '/newfile.png'} onClick={addNewObjective} isLoading={isAddingNewObjective} isLoadingBlack={false}/>}
          </div>
          {/* {currentSidePanelView === SidePanelView.Backup && <ObjectiveBackSideView></ObjectiveBackSideView>} */}
          {isShowingObjsList && currentSidePanelView === SidePanelView.Closed && getObjectiveClosedListView()}
          {isShowingObjsList && currentSidePanelView === SidePanelView.Archived && getObjectiveArchivedListView()}
        </div>
      </div>
    )
  }

  const getObjectivesTagsList = () => {
    return(
      <div className='objectivesListMainAndTagsContainer'>
        {!isBelow700px && getTagList()}
        <div className='objectivesListMainContainer'>
          {isThereANonArchivedShowingObjetive()?
            getObjectiveList()
            :
            <div className={'objectivesListFirstOneContainer g-txt'} onClick={addNewObjective}>
              Create a new objective
              <PressImage src={process.env.PUBLIC_URL + '/newfile.png'} isLoadingBlack={false} isLoading={isAddingNewObjective}/>
            </div>
          }
        </div>
        <div style={{height: '700px'}}></div>
      </div>
    )
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
      for(let i = 0; i < event.target.files.length;i++){
        const file = event.target.files[i];
        if (file && file.type === "application/json") {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const text = e.target?.result as string; // Força para string
              const newObjectiveList:ObjectivesListType = JSON.parse(text) as ObjectivesListType;
              uploadBackupData(newObjectiveList, file.name);
            } catch (error) {
              console.error("Erro ao parsear JSON:", error);
            }
          };
          reader.readAsText(file);
        } else {
          alert("Por favor, selecione um arquivo JSON válido.");
        }
      }
    }
  };

  const uploadBackupData = async (data: ObjectivesListType, fileName: string) => {
    setIsUpdatingObjectives(true);
    await objectiveslistApi.syncObjectivesList(data, (error:any) => popMessage(error.Message, MessageType.Error, 10));
    setIsUpdatingObjectives(false);

    if(data){
      log.g('ok ' + fileName);
    }
    else{
      log.r('not' + fileName);
    }
  }

  const isThereANonArchivedShowingObjetive = ():boolean => {
    return  objectives.some((o: Objective) => o.IsShowing && !o.IsArchived);
  }
  
  return (
    <div className='objectivesContainer'>
      {user && user.Status==='Active' ?
        isUpdatingObjectives?
        <div className='loadingListContainer'>
          <Loading/>
        </div>
        :
        (<div className='objectivesListContainer'>
          {isBelow700px && getTagList()}
          {getSideMenu()}
          <div className='objectivesListMainAndTagsContainer'>
            <div className='objectivesListMainContainer'>
              {isThereANonArchivedShowingObjetive()?
                getObjectiveList()
                :
                <div className={'objectivesListFirstOneContainer g-txt'} onClick={addNewObjective}>
                  Create a new objective
                  <PressImage src={process.env.PUBLIC_URL + '/newfile.png'} isLoadingBlack={false} isLoading={isAddingNewObjective}/>
                </div>
              }
            </div>
          </div>
          <div style={{height: '700px'}}></div>
        </div>)
       :
        <div className='needLogin'>
          <Button color={ButtonColor.WHITE} text='Need to login' onClick={()=>{navigate('/login')}}></Button>
        </div>
      }
    </div>
  );
}

export default ObjectivesList;
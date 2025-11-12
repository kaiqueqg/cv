import { useEffect, useState } from "react";
import './step-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Step, StepImportance } from "../../../../TypesObjectives";
import log from "../../../../log/log";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import { useLogContext } from "../../../../contexts/log-context";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { SCSSItemType, useThemeContext } from "../../../../contexts/theme-context";

export function stepNew(){
  return {
    Title: '',
    Done: false,
    Importance: StepImportance.None,
  }
}

interface StepViewProps extends ItemViewProps{
  step: Step,
}

export const StepView: React.FC<StepViewProps> = (props) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { popMessage } = useLogContext();
  const { getItemScssColor } = useThemeContext();
  const { step, theme, putItemsInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingDone, setIsSavingDone] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(step.Title);
  const [newImportance, setNewImportance] = useState<StepImportance>(step.Importance??StepImportance.None);
  const [newAutoDestroy, setNewAutoDestroy] = useState<boolean>(step.AutoDestroy??false);

  useEffect(() => {
    setNewTitle(step.Title);
    setNewImportance(step.Importance??StepImportance.None);
  }, [step]);

  const onChangeDone = async () => {
    setIsSavingDone(true);

    if(step.AutoDestroy && !step.Done) {
      await deleteItem();
      return;
    }

    try {
      const newItem: Step = { ...step, Done: !step.Done, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItems([newItem]);
      
      if(data){
        putItemsInDisplay([newItem]);
        setIsSavingDone(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingDone(false);
    }, 200); 
  }

  const onChangeEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  }

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const deleteItem = async () => {
    setIsDeleting(true);
    const data = await objectiveslistApi.deleteObjectiveItems([step]);

    if(data){
      setIsEditingTitle(false);
      putItemsInDisplay([step], true);
    }
    setIsDeleting(false);
  }

  const doneEdit = async (newImp?: StepImportance) => {
    const newStep: Step = {
      ...step,
      Title: newTitle.trim(),
      Importance: newImp??newImportance, 
      LastModified: new Date().toISOString(),
      AutoDestroy: newAutoDestroy,
    };

    if(newStep.Title !== step.Title || newStep.Done !== step.Done || newStep.Pos !== step.Pos || newStep.Importance !== step.Importance || newStep.AutoDestroy !== step.AutoDestroy) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItems([newStep]);

      if(data){
        setIsEditingTitle(false);
        putItemsInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingTitle(false);
      setNewTitle(step.Title);
      setNewImportance(step.Importance??StepImportance.None);
      setNewAutoDestroy(step.AutoDestroy);
    }
  }

  const cancelEdit = () => {
    setNewTitle(step.Title);
    setNewImportance(step.Importance??StepImportance.None);
    setIsEditingTitle(false);
    setNewAutoDestroy(step.AutoDestroy);
  }

  const getImportanceImage = () => {
    if(newImportance === StepImportance.Low){
      return <PressImage src={process.env.PUBLIC_URL + '/low.png'} isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.Medium){
      return <PressImage src={process.env.PUBLIC_URL + '/med.png'} isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.High){
      return <PressImage src={process.env.PUBLIC_URL + '/high.png'} isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.Ladybug){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybug.png'}  isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.LadybugYellow){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybugyellow.png'}  isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.LadybugGreen){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybuggreen.png'}  isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.Question){
      return <PressImage src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'} isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.Waiting){
      return <PressImage src={process.env.PUBLIC_URL + '/wait'+itemTintColor(theme)+'.png'} isBlack={props.isLoadingBlack}/>
    }
    else if(newImportance === StepImportance.InProgress){
      return <PressImage src={process.env.PUBLIC_URL + '/inprogress'+itemTintColor(theme)+'.png'} isBlack={props.isLoadingBlack}/>
    }
    else{
      return <></>
    }
  }

  const getStepIconView = () => {
    if(isEditingTitle) return;

    if(step.Done)
      return <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'} isLoading={isSavingDone}/>;
    else{
      return <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + itemTintColor(theme) + '.png'} isLoading={isSavingDone} confirm={step.AutoDestroy}/>
    }
  }

  const getAutodestroyView = () => {
    if(newAutoDestroy){
      return(
        <div className={'stepAutoDestroyContainer' + getItemScssColor(theme, SCSSItemType.BORDERCOLOR)} onClick={() => {setNewAutoDestroy(!newAutoDestroy)}}>
          <PressImage isBlack={props.isLoadingBlack} onClick={() => {setNewAutoDestroy(!newAutoDestroy)}} src={process.env.PUBLIC_URL + '/explode'+itemTintColor(theme)+'.png'}/>
        </div>
      )
    }
    else{
      return(
        <div className={'stepAutoDestroyContainer' + getItemScssColor(theme, SCSSItemType.BORDERCOLOR)} onClick={() => {setNewAutoDestroy(!newAutoDestroy)}}>
          <PressImage isBlack={props.isLoadingBlack} onClick={() => {setNewAutoDestroy(!newAutoDestroy)}} src={process.env.PUBLIC_URL + '/explode-grey.png'}/>
        </div>
      )
    }
  }

  return (
    <div className={'stepContainer'+itemGetTheme(theme, isSelected, isEndingPos, step.Done)}>
      {isSavingTitle?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingTitle?
          <div className='stepTitleContainer'>
            <div className='stepTitleRowContainer'>
              {getImportanceImage()}
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
              <input
                className={itemInputColor(theme)}
                type='text'
                placeholder='Step text'
                value={newTitle}
                onChange={handleTextInputChange}
                onKeyDown={handleKeyDown} autoFocus></input>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} isBlack={props.isLoadingBlack}/>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} isBlack={props.isLoadingBlack}/>
            </div>
            <div className='stepIconRowContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.None);}} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.Low);}} src={process.env.PUBLIC_URL + '/low.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.Medium);}} src={process.env.PUBLIC_URL + '/med.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.High);}} src={process.env.PUBLIC_URL + '/high.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.Ladybug);}} src={process.env.PUBLIC_URL + '/ladybug.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.LadybugYellow);}} src={process.env.PUBLIC_URL + '/ladybugyellow.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.LadybugGreen);}} src={process.env.PUBLIC_URL + '/ladybuggreen.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.Question);}} src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.Waiting);}} src={process.env.PUBLIC_URL + '/wait'+itemTintColor(theme)+'.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)doneEdit(StepImportance.InProgress);}} src={process.env.PUBLIC_URL + '/inprogress'+itemTintColor(theme)+'.png'}/>
              {getAutodestroyView()}
            </div>

          </div>
          :
          <>
            {getImportanceImage()}
            <div className={'stepTitle ' + itemTextColor(theme, step.Done) + ((step.Importance === StepImportance.None)? '':' stepTitleWithImportance')} onClick={() => {if(!isEditingPos)onChangeEditTitle();}}>{step.Title}</div>
          </>
        )
      }
      {getStepIconView()}
    </div>
  );
}

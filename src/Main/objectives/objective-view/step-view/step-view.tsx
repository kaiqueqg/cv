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
import { SCSS, useThemeContext } from "../../../../contexts/theme-context";
import Button, { ButtonColor } from "../../../../button/button";

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
  const { scss } = useThemeContext();
  const { step, theme, putItemsInDisplay, removeItemsInDisplay, isSelecting, isSelected, isDisabled, itemTintColor } = props;

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
      removeItemsInDisplay([step]);
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
      Done: (newAutoDestroy!==step.AutoDestroy&&step.Done)? false:step.Done,
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

  const getDisplayImportanceImage = () => {
    if(newImportance === StepImportance.Low){
      return <PressImage src={process.env.PUBLIC_URL + '/low.png'} isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.Medium){
      return <PressImage src={process.env.PUBLIC_URL + '/med.png'} isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.High){
      return <PressImage src={process.env.PUBLIC_URL + '/high.png'} isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.Ladybug){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybug.png'}  isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.LadybugYellow){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybugyellow.png'}  isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.LadybugGreen){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybuggreen.png'}  isLoadingBlack={props.isLoadingBlack} rawImage hideHoverEffect/>
    }
    else if(newImportance === StepImportance.Question){
      return <PressImage src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'} isLoadingBlack={props.isLoadingBlack} hideHoverEffect/>
    }
    else if(newImportance === StepImportance.Waiting){
      return <PressImage src={process.env.PUBLIC_URL + '/wait'+itemTintColor(theme)+'.png'} isLoadingBlack={props.isLoadingBlack} hideHoverEffect/>
    }
    else if(newImportance === StepImportance.InProgress){
      return <PressImage src={process.env.PUBLIC_URL + '/inprogress'+itemTintColor(theme)+'.png'} isLoadingBlack={props.isLoadingBlack} hideHoverEffect/>
    }
    else{
      return <></>
    }
  }

  const getStepIconView = () => {
    if(isEditingTitle) return;

    if(step.Done)
      return <PressImage t='step' isLoadingBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'} isLoading={isSavingDone}/>;
    else{
      return <PressImage t='step' isLoadingBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + itemTintColor(theme) + '.png'} isLoading={isSavingDone} confirm={step.AutoDestroy}/>
    }
  }

  const getAutodestroyView = () => {
    return(
      <Button color={ButtonColor.TRANSPARENT} onClick={() => {setNewAutoDestroy(!newAutoDestroy)}} isSelected={newAutoDestroy}>
        {newAutoDestroy? 'Delete after done.':'Check after done.'}
      </Button>
    )
  }

  const onChangeImportante = (imp: StepImportance) => {
    setNewImportance(imp);
  }

  const getEditingImportanceView = (title: string, type: StepImportance, ) => {
    let src = '';
    switch(type){
      case StepImportance.None:
        src = process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png';
        break;
      case StepImportance.Low:
        src = process.env.PUBLIC_URL + '/low.png';
        break;
      case StepImportance.Medium:
        src = process.env.PUBLIC_URL + '/med.png';
        break;
      case StepImportance.High:
        src = process.env.PUBLIC_URL + '/high.png';
        break;
      case StepImportance.LadybugGreen:
        src = process.env.PUBLIC_URL + '/ladybuggreen.png';
        break;
      case StepImportance.LadybugYellow:
        src = process.env.PUBLIC_URL + '/ladybugyellow.png';
        break;
      case StepImportance.Ladybug:
        src = process.env.PUBLIC_URL + '/ladybug.png';
        break;
      case StepImportance.Question:
        src = process.env.PUBLIC_URL + '/questionmark' + itemTintColor(theme) + '.png';
        break;
      case StepImportance.Waiting:
        src = process.env.PUBLIC_URL + '/wait' + itemTintColor(theme) + '.png';
        break;
      case StepImportance.InProgress:
        src = process.env.PUBLIC_URL + '/inprogress' + itemTintColor(theme) + '.png';
        break;
    }
    return(
      <PressImage 
        t={title}
        isSelected={newImportance===type}
        isLoadingBlack={props.isLoadingBlack}
        onClick={() => {onChangeImportante(type)}}
        src={src}
        rawImage={type !== StepImportance.Question && type !== StepImportance.Waiting && type !== StepImportance.InProgress} //bad solution
        wasSelected={step.Importance===type && newImportance!==type}
      />
    )
  }

  return (
    <div className={'stepContainer '+scss(theme, [SCSS.ITEM_BG], step.Done, isSelecting, isSelected)}>
      {isSavingTitle?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingTitle?
          <div className='stepTitleContainer'>
            <div className='stepTitleRowContainer'>
              {getDisplayImportanceImage()}
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage isLoading={isDeleting}/>
              <input
                className={'input-simple-base ' + scss(theme, [SCSS.INPUT, SCSS.BORDERCOLOR])}
                type='text'
                placeholder='Step text'
                value={newTitle}
                onChange={handleTextInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck></input>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} isLoadingBlack={props.isLoadingBlack} rawImage/>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} isLoadingBlack={props.isLoadingBlack} rawImage/>
            </div>
            <div className='stepIconRowContainer'>
              {getEditingImportanceView('No icon', StepImportance.None)}
              {getEditingImportanceView('Minor', StepImportance.Low)}
              {getEditingImportanceView('Moderate', StepImportance.Medium)}
              {getEditingImportanceView('Critical', StepImportance.High)}
              {getEditingImportanceView('Minor bug', StepImportance.LadybugGreen)}
              {getEditingImportanceView('Moderate bug', StepImportance.LadybugYellow)}
              {getEditingImportanceView('Critical bug', StepImportance.Ladybug)}
              {getEditingImportanceView('Question', StepImportance.Question)}
              {getEditingImportanceView('Waiting', StepImportance.Waiting)}
              {getEditingImportanceView('In progress', StepImportance.InProgress)}
            </div>
            {getAutodestroyView()}
          </div>
          :
          <>
            {getDisplayImportanceImage()}
            <div className={'stepTitle ' + scss(theme, [SCSS.TEXT], step.Done) + ((step.Importance === StepImportance.None)? '':' stepTitleWithImportance')} onClick={() => {if(!isDisabled)onChangeEditTitle();}}>{step.Title}</div>
          </>
        )
      }
      {getStepIconView()}
    </div>
  );
}

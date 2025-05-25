import { useEffect, useState } from "react";
import './StepView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Step, StepImportance } from "../../../../TypesObjectives";
import log from "../../../../Log/Log";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import { useLogContext } from "../../../../Contexts/LogContext";
import { MessageType } from "../../../../Types";
import PressImage from "../../../../PressImage/PressImage";
import { Console } from "console";

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
  const { popMessage } = useLogContext();
  const { step, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingDone, setIsSavingDone] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(step.Title);
  const [newImportance, setNewImportance] = useState<StepImportance>(step.Importance??StepImportance.None);

  useEffect(() => {
    setNewTitle(step.Title);
    setNewImportance(step.Importance??StepImportance.None);
  }, [step]);

  const onChangeDone = async () => {
    setIsSavingDone(true);

    try {
      const newItem: Step = { ...step, Done: !step.Done, LastModified: new Date().toISOString()};
      putItemInDisplay(newItem);
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsSavingDone(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingDone(false);
    }, 200); 
  }

  const onChangeImportance = async (newImportance: StepImportance) => {
    setNewImportance(newImportance);
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
    const data = await objectiveslistApi.deleteObjectiveItem(step);

    if(data){
      setIsEditingTitle(false);
      putItemInDisplay(step, true);
    }
    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newStep: Step = {
      ...step,
      Title: newTitle.trim(),
      Importance: newImportance, 
      LastModified: new Date().toISOString()
    };

    if(newStep.Title !== step.Title || newStep.Done !== step.Done || newStep.Pos !== step.Pos || newStep.Importance !== step.Importance) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItem(newStep);

      if(data){
        setIsEditingTitle(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingTitle(false);
      setNewTitle(step.Title);
      setNewImportance(step.Importance??StepImportance.None);
    }
  }

  const cancelEdit = () => {
    setNewTitle(step.Title);
    setNewImportance(step.Importance??StepImportance.None);
    setIsEditingTitle(false);
  }

  const getImportanceImage = () => {
    if(newImportance === StepImportance.Low){
      return <PressImage src={process.env.PUBLIC_URL + '/low.png'}/>
    }
    else if(newImportance === StepImportance.Medium){
      return <PressImage src={process.env.PUBLIC_URL + '/med.png'}/>
    }
    else if(newImportance === StepImportance.High){
      return <PressImage src={process.env.PUBLIC_URL + '/high.png'}/>
    }
    else if(newImportance === StepImportance.Ladybug){
      return <PressImage src={process.env.PUBLIC_URL + '/ladybug.png'}/>
    }
    else if(newImportance === StepImportance.Question){
      return <PressImage src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'}/>
    }
    else if(newImportance === StepImportance.Waiting){
      return <PressImage src={process.env.PUBLIC_URL + '/wait'+itemTintColor(theme)+'.png'}/>
    }
    else if(newImportance === StepImportance.InProgress){
      return <PressImage src={process.env.PUBLIC_URL + '/inprogress'+itemTintColor(theme)+'.png'}/>
    }
    else{
      return <></>//<img className='stepImage' onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'}></img>;
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
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
              <input
                className={itemInputColor(theme)}
                type='text'
                placeholder='Step text'
                value={newTitle}
                onChange={handleTextInputChange}
                onKeyDown={handleKeyDown} autoFocus></input>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
            </div>
            <div className='stepIconRowContainer'>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.None);}} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.Low);}} src={process.env.PUBLIC_URL + '/low.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.Medium);}} src={process.env.PUBLIC_URL + '/med.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.High);}} src={process.env.PUBLIC_URL + '/high.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.Ladybug);}} src={process.env.PUBLIC_URL + '/ladybug.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.Question);}} src={process.env.PUBLIC_URL + '/questionmark'+itemTintColor(theme)+'.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.Waiting);}} src={process.env.PUBLIC_URL + '/wait'+itemTintColor(theme)+'.png'}/>
              <PressImage onClick={() => {if(!isEditingPos)onChangeImportance(StepImportance.InProgress);}} src={process.env.PUBLIC_URL + '/inprogress'+itemTintColor(theme)+'.png'}/>
            </div>
          </div>
          :
          <>
            {getImportanceImage()}
            <div className={'stepTitle ' + itemTextColor(theme, step.Done) + ((step.Importance === StepImportance.None)? '':' stepTitleWithImportance')} onClick={() => {if(!isEditingPos)onChangeEditTitle();}}>{step.Title}</div>
          </>
        )
      }
      {!isEditingTitle &&
      <>
        {step.Done?
          <PressImage onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'} isLoading={isSavingDone}/>
          :
          <PressImage onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + itemTintColor(theme) + '.png'} isLoading={isSavingDone}/>
        }
      </>
      }
    </div>
  );
}

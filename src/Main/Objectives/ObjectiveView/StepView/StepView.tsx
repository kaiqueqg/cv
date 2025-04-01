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

export const New = () => {
  return(
    {
      Title: '',
      Done: false,
      Importance: StepImportance.None,
    }
  )
}

interface StepViewProps extends ItemViewProps{
  step: Step,
}

const StepView: React.FC<StepViewProps> = (props) => {
  const { popMessage } = useLogContext();
  const { step, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingImportance, setIsSavingImportance] = useState<boolean>(false);
  const [isSavingDone, setIsSavingDone] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(step.Title);
  const [newImportance, setNewImportance] = useState<StepImportance>(step.Importance??StepImportance.None);

  useEffect(() => {
    setNewTitle(step.Title);
    setNewImportance(step.Importance??StepImportance.None);
  }, [step]);

  //to test
  useEffect(()=>{
    if(!isEditingTitle) return;

    const timeout = setTimeout(()=>{
      if(step.Title === newTitle){
        setIsEditingTitle(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isEditingTitle, newTitle]);

  const onChangeDone = async () => {
    setIsSavingDone(true);

    try {
      const newItem: Step = { ...step, Done: !step.Done, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        putItemInDisplay(data);
        setIsSavingDone(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingDone(false);
    }, 200); 
  }

  const onChangeNewImportance = () => {
    let newImp = StepImportance.None;
    switch (newImportance) {
      case StepImportance.None:
        newImp = StepImportance.Low;
        break;
      case StepImportance.Low:
        newImp = StepImportance.Medium;
        break;
      case StepImportance.Medium:
        newImp = StepImportance.High;
        break;
      case StepImportance.High:
        newImp = StepImportance.Question;
        break;
      case StepImportance.Question:
        newImp = StepImportance.Waiting;
        break;
      case StepImportance.Waiting:
        newImp = StepImportance.InProgress;
        break;
      case StepImportance.InProgress:
        newImp = StepImportance.None;
        break;
    }
    setNewImportance(newImp);
  }

  const onChangeImportance = async () => {
    setIsSavingImportance(true);

    let newImp = StepImportance.None;
    switch (step.Importance) {
      case StepImportance.None:
        newImp = StepImportance.Low;
        break;
      case StepImportance.Low:
        newImp = StepImportance.Medium;
        break;
      case StepImportance.Medium:
        newImp = StepImportance.High;
        break;
      case StepImportance.High:
        newImp = StepImportance.Question;
        break;
      case StepImportance.Question:
        newImp = StepImportance.Waiting;
        break;
      case StepImportance.Waiting:
        newImp = StepImportance.InProgress;
        break;
      case StepImportance.InProgress:
        newImp = StepImportance.None;
        break;
    }
    try {
      const newItem: Step = { ...step, Importance: newImp, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        putItemInDisplay(data);
        setIsSavingImportance(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingImportance(false);
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

  const getTheme = () => {
    let rtnTheme = 'stepContainer';

    if(step.Done){
      rtnTheme += ' stepContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' stepContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' stepContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' stepContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' stepContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' stepContainerNoTheme';
      }
    }

    if(isSelected) rtnTheme += ' stepContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' stepContainerSelectedEnding';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' stepTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' stepTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' stepTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' stepTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' stepTextNoTheme'
    }
    else{
      return ' stepTextBlue';
    }
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'stepInputBlue stepTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'stepInputRed stepTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'stepInputGreen stepTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'stepInputWhite stepTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'stepInputNoTheme stepTextNoTheme'
    }
    else{
      v+= 'stepInputNoTheme stepTextNoTheme';
    }

    return 'stepInput ' + v;
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' stepTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' stepTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' stepTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' stepTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' stepTextFadeNoTheme'
    }
    else{
      return ' stepTextFadeBlue';
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getNewImportanceImage = () => {
    if(newImportance === StepImportance.Low){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/low.png'}/>
    }
    else if(newImportance === StepImportance.Medium){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/med.png'}/>
    }
    else if(newImportance === StepImportance.High){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/high.png'}/>
    }
    else if(newImportance === StepImportance.Question){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/questionmark'+getTintColor()+'.png'}/>
    }
    else if(newImportance === StepImportance.Waiting){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/wait'+getTintColor()+'.png'}/>
    }
    else if(newImportance === StepImportance.InProgress){
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/inprogress'+getTintColor()+'.png'}/>
    }
    else{
      return <PressImage onClick={() => {if(!isEditingPos)onChangeNewImportance();}} src={process.env.PUBLIC_URL + '/cancel'+getTintColor()+'.png'}/>
    }
  }

  const getImportanceImage = () => {
    if(!step.Done) {
      if(newImportance === StepImportance.Low){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/low.png'} isLoading={isSavingImportance}/>
      }
      else if(newImportance === StepImportance.Medium){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/med.png'} isLoading={isSavingImportance}/>
      }
      else if(newImportance === StepImportance.High){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/high.png'} isLoading={isSavingImportance}/>
      }
      else if(newImportance === StepImportance.Question){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/questionmark'+getTintColor()+'.png'} isLoading={isSavingImportance}/>
      }
      else if(newImportance === StepImportance.Waiting){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/wait'+getTintColor()+'.png'} isLoading={isSavingImportance}/>
      }
      else if(newImportance === StepImportance.InProgress){
        return <PressImage onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/inprogress'+getTintColor()+'.png'} isLoading={isSavingImportance}/>
      }
      else{
        return <></>//<img className='stepImage' onClick={() => {if(!isEditingPos)onChangeImportance();}} src={process.env.PUBLIC_URL + '/questionmark'+getTintColor()+'.png'}></img>;
      }
    }
  }

  return (
    <div className={getTheme()}>
      {isSavingTitle?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingTitle?
          <div className='stepTitleContainer'>
            {getNewImportanceImage()}
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
            }
            <input
              className={getInputColor()}
              type='text'
              placeholder='Step text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}/>
            <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}/>
          </div>
          :
          <>
            {getImportanceImage()}
            <div className={'stepTitle' + (step.Done? getTextFadeColor():getTextColor())} onClick={() => {if(!isEditingPos)onChangeEditTitle();}}>{step.Title}</div>
          </>
        )
      }
      {!isEditingTitle &&
      <>
        {step.Done?
          <PressImage onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'} isLoading={isSavingDone}/>
          :
          <PressImage onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + getTintColor() + '.png'} isLoading={isSavingDone}/>
        }
      </>
      }
    </div>
  );
}

export default StepView;
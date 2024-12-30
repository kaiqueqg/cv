import { useEffect, useState } from "react";
import './StepView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Step } from "../../../../TypesObjectives";
import log from "../../../../Log/Log";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";


interface StepViewProps extends ItemViewProps{
  step: Step,
}

const StepView: React.FC<StepViewProps> = (props) => {
  const { step, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingDone, setIsSavingDone] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(step.Title);

  useEffect(() => {
  }, []);

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
      LastModified: new Date().toISOString()
    };

    if(newStep.Title !== step.Title || newStep.Done !== step.Done || newStep.Pos !== step.Pos) {
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
    }
  }

  const cancelEdit = () => {
    setNewTitle(step.Title);
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
      else{
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

  return (
    <div className={getTheme()}>
      {isSavingTitle?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingTitle?
          <div className='stepTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
            }
            <input
              className={getInputColor()}
              type='text'
              placeholder='Step text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
          </div>
          :
          <div className={'stepTitle' + (step.Done? getTextFadeColor():getTextColor())} onClick={() => {if(!isEditingPos)onChangeEditTitle();}}>{step.Title}</div>
        )
      }
      {!isEditingTitle &&
        (isSavingDone?
          <Loading IsBlack={theme==='darkWhite'}></Loading>
          :
          (step.Done?
            <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'}></img>
            :
            <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + getTintColor() + '.png'}></img>
          )
        )
      }
    </div>
  );
}

export default StepView;
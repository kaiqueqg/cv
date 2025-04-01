import { useEffect, useState } from "react";
import './ExerciseView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Exercise, Weekdays } from "../../../../TypesObjectives";
import log from "../../../../Log/Log";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
      IsDone: false,
      Reps: 1,
      Series: 1,
      MaxWeight: '',
      Description: '',
      Weekdays: [],
      LastDone: '',
    }
  )
}

interface ExerciseViewProps extends ItemViewProps{
  exercise: Exercise,
}

const ExerciseView: React.FC<ExerciseViewProps> = (props) => {
  const { exercise, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [isSavingExercise, setIsSavingExercise] = useState<boolean>(false);
  const [isSavingIsDone, setIsSavingIsDone] = useState<boolean>(false);
  const [isEditingExercise, setIsEditingExercise] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<Exercise>(exercise);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(()=>{
    const now = new Date();
    const exerciseDate = new Date(exercise.LastDone);

    const needToWorkoutToday = (
      (now.getFullYear() >= exerciseDate.getFullYear() ||
      now.getMonth() >= exerciseDate.getMonth()) &&
      now.getDay() > exerciseDate.getDay()
    )

    if (exercise.IsDone && needToWorkoutToday && exercise.Weekdays.includes(now.getDay())) {
      onChangeDone();
    }
  }, []);

  useEffect(() => {
    
  }, [exercise, newExercise]);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise({...newExercise, Title: event.target.value});
  }
  const handleRepsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise({...newExercise, Reps: Number(event.target.value)});
  }
  const handleSeriesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise({...newExercise, Series: Number(event.target.value)});
  }
  const handleMaxHeightInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise({...newExercise, MaxWeight: event.target.value});
  }
  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewExercise({...newExercise, Description: event.target.value});
  }

  const allWeekdayChange = () => {
    setNewExercise({...newExercise, Weekdays: [Weekdays.Monday, Weekdays.Tuesday, Weekdays.Wednesday, Weekdays.Thursday, Weekdays.Friday, Weekdays.Saturday, Weekdays.Sunday]});
  }

  const noneWeekdayChange = () => {
    setNewExercise({...newExercise, Weekdays: []});
  }

  const weekdayChange = (weekday: Weekdays) => {
    const includes = newExercise.Weekdays.includes(weekday);
  
    if(includes){
      setNewExercise({...newExercise, Weekdays: newExercise.Weekdays.filter((item)=>item!==weekday)});
    }
    else{
      setNewExercise({...newExercise, Weekdays: [...newExercise.Weekdays, weekday]});
    }
  };

  const onChangeDone = async () => {
    setIsSavingExercise(true);

    try {
      const newItem: Exercise = { 
        ...exercise, 
        IsDone: !exercise.IsDone, LastDone: !exercise.IsDone? new Date().toISOString():exercise.LastDone, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        putItemInDisplay(data);
        setIsSavingExercise(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingExercise(false);
    }, 200); 
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
    const data = await objectiveslistApi.deleteObjectiveItem(exercise);

    if(data){
      setIsEditingExercise(false);
      putItemInDisplay(exercise, true);
    }
    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newItem: Exercise = {...newExercise,
      Title: newExercise.Title.trim(),
      Reps: newExercise.Reps,
      Series: newExercise.Series,
      MaxWeight: newExercise.MaxWeight.trim(),
      Description: newExercise.Description.trim(),
      Weekdays: newExercise.Weekdays,
    };

    if(newItem.Title !== exercise.Title || 
      newItem.Reps !== exercise.Reps ||
      newItem.Series !== exercise.Series ||
      newItem.MaxWeight !== exercise.MaxWeight ||
      newItem.Pos !== exercise.Pos ||
      newItem.Description !== exercise.Description ||
      newItem.Weekdays !== exercise.Weekdays ||
      newItem.LastDone !== exercise.LastDone) {
      setIsSavingExercise(true);

      const data = await objectiveslistApi.putObjectiveItem(newExercise);

      if(data){
        setIsEditingExercise(false);
        putItemInDisplay(data);
        setNewExercise(newExercise);
      }

      setTimeout(() => {
        setIsSavingExercise(false);
      }, 200); 
    }
    else{
      setIsEditingExercise(false);
      setNewExercise(exercise);
    }
  }

  const onEditExercise = () => {
    if(!isEditingPos)setIsEditingExercise(!isEditingExercise);
  }

  const cancelEdit = () => {
    setIsEditingExercise(false);
    setNewExercise(exercise);
  }

  const getTheme = () => {
    let rtnTheme = 'exerciseContainer';

    if(exercise.IsDone){
      rtnTheme += ' exerciseContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' exerciseContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' exerciseContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' exerciseContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' exerciseContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' exerciseContainerNoTheme';
      }
      else{
        rtnTheme += ' exerciseContainerNoTheme';
      }
    }

    if(isSelected) rtnTheme += ' exerciseContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' exerciseContainerSelectedEnding';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' exerciseTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' exerciseTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' exerciseTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' exerciseTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' exerciseTextNoTheme'
    }
    else{
      return ' exerciseTextBlue';
    }
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' exerciseTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' exerciseTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' exerciseTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' exerciseTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' exerciseTextFadeNoTheme'
    }
    else{
      return ' exerciseTextFadeBlue';
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'exerciseInputBlue exerciseTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'exerciseInputRed exerciseTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'exerciseInputGreen exerciseTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'exerciseInputWhite exerciseTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'exerciseInputNoTheme exerciseTextNoTheme'
    }
    else{
      v+= 'exerciseInputNoTheme exerciseTextNoTheme';
    }

    return 'exerciseInput ' + v;
  }

  const getWeekButtonColor = (weekday: Weekdays) => {
    const isCont = newExercise.Weekdays.includes(weekday);
    return 'exerciseWeekdaysButton ' + (isCont?'exerciseWeekdaysButtonSelected':'');
  }

  const getWeekdaysButtons = () => {
    return(
      <div className='exerciseWeekdaysContainer'>
        <div className={'exerciseWeekdaysButtonAllNone'} onClick={allWeekdayChange}>All</div>
        <div className={'exerciseWeekdaysButtonAllNone'} onClick={noneWeekdayChange}>None</div>
        <div className={getWeekButtonColor(Weekdays.Monday)} onClick={()=>weekdayChange(Weekdays.Monday)}>Mon</div>
        <div className={getWeekButtonColor(Weekdays.Tuesday)} onClick={()=>weekdayChange(Weekdays.Tuesday)}>Tue</div>
        <div className={getWeekButtonColor(Weekdays.Wednesday)} onClick={()=>weekdayChange(Weekdays.Wednesday)}>Wed</div>
        <div className={getWeekButtonColor(Weekdays.Thursday)} onClick={()=>weekdayChange(Weekdays.Thursday)}>Thu</div>
        <div className={getWeekButtonColor(Weekdays.Friday)} onClick={()=>weekdayChange(Weekdays.Friday)}>Fri</div>
        <div className={getWeekButtonColor(Weekdays.Saturday)} onClick={()=>weekdayChange(Weekdays.Saturday)}>Sat</div>
        <div className={getWeekButtonColor(Weekdays.Sunday)} onClick={()=>weekdayChange(Weekdays.Sunday)}>Sun</div>
      </div>
    )
  }

  const getTitle = ():string => {
    let title = '';
    if(exercise.Title !== ''){
      if(exercise.Reps > 1 || exercise.Series > 1) title += exercise.Series + 'x' + exercise.Reps + ' ';
      title += exercise.Title;
      if(exercise.MaxWeight) title += ' ('+exercise.MaxWeight+')';
      title += exercise.Weekdays.includes(Weekdays.Monday)?' M':'';
      title += exercise.Weekdays.includes(Weekdays.Tuesday)?' T':'';
      title += exercise.Weekdays.includes(Weekdays.Wednesday)?' W':'';
      title += exercise.Weekdays.includes(Weekdays.Thursday)?' Th':'';
      title += exercise.Weekdays.includes(Weekdays.Friday)?' F':'';
      title += exercise.Weekdays.includes(Weekdays.Saturday)?' S':'';
    }
    
    return title;
  }

  return (
    <div className={getTheme()}>
      {isSavingExercise?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingExercise?
          <div className='inputsContainer'>
            <div className='exerciseSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='exerciseCenterContainer'>
              <input 
                className={getInputColor()}
                type='text'
                value={newExercise.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={getInputColor()}
                type='number'
                value={newExercise.Series}
                onChange={handleSeriesInputChange}
                onKeyDown={handleKeyDown}
                min={1}></input>
              <input 
                className={getInputColor()}
                type='number'
                value={newExercise.Reps}
                onChange={handleRepsInputChange}
                onKeyDown={handleKeyDown}
                min={1}></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newExercise.MaxWeight}
                onChange={handleMaxHeightInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Max"></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newExercise.Description}
                onChange={handleDescriptionInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Description"></input>
              {getWeekdaysButtons()}
            </div>
            <div className='exerciseSideContainer'>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}/>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}/>
            </div>
          </div>
          :
          <div className='exerciseDisplayContainer'>
            <div className='exerciseLine' onClick={onEditExercise}>
              <div className={'exerciseText' + (exercise.IsDone? getTextFadeColor():getTextColor())}> {getTitle()}</div>
              {/* {medicine.Unit && <div className={'medicineText' + (exercise.IsDone? getTextFadeColor():getTextColor())}>{medicine.Unit}</div>} */}
              {/* {medicine.Purpose && <div className={'medicineText ' + getTextFadeColor()}>{'('+exercise.Purpose+')'}</div>} */}
            </div>
            {!isEditingExercise &&
              (isSavingIsDone?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                (exercise.IsDone?
                  <PressImage onClick={() => {if(!isEditingPos)onChangeDone()}} src={process.env.PUBLIC_URL + '/exercise-filled-grey.png'}/>
                  :
                  <PressImage onClick={() => {if(!isEditingPos)onChangeDone()}} src={process.env.PUBLIC_URL + '/exercise' + getTintColor() + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default ExerciseView;
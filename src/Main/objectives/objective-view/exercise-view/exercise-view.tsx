import { useEffect, useState } from "react";
import './exercise-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Exercise, Weekdays } from "../../../../TypesObjectives";
import log from "../../../../log/log";
import Loading from "../../../../loading/loading";
import PressImage from "../../../../press-image/press-image";
import { useLogContext } from "../../../../contexts/log-context";
import { MessageType } from "../../../../Types";
import { useRequestContext } from "../../../../contexts/request-context";
import { SCSSItemType, SCSSObjType, useThemeContext } from "../../../../contexts/theme-context";

export function exerciseNew(){
  return {
    Title: '',
    IsDone: false,
    Reps: 1,
    Series: 1,
    MaxWeight: '',
    Description: '',
    Weekdays: [],
    LastDone: '',
    BodyImages: [],
  }
}

interface ExerciseViewProps extends ItemViewProps{
  exercise: Exercise,
}

export const ExerciseView: React.FC<ExerciseViewProps> = (props) => {
  const { popMessage } = useLogContext();
  const { identityApi, objectiveslistApi } = useRequestContext();
  const { exercise, theme, putItemsInDisplay, isEditingPos, isSelected, isEndingPos, 
    itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const { getItemScssColor, getScssObjColor } = useThemeContext();

  const [isSavingExercise, setIsSavingExercise] = useState<boolean>(false);
  const [isSavingIsDone, setIsSavingIsDone] = useState<boolean>(false);
  const [isEditingExercise, setIsEditingExercise] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<Exercise>(exercise);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const bodyImages: Record<string, string> = {
    abs: process.env.PUBLIC_URL + '/128px/abs.png',
    anteriorforearm: process.env.PUBLIC_URL + '/128px/anteriorforearm.png',
    backoutside: process.env.PUBLIC_URL + '/128px/backoutside.png',
    biceps: process.env.PUBLIC_URL + '/128px/biceps.png',
    calves: process.env.PUBLIC_URL + '/128px/calves.png',
    chest: process.env.PUBLIC_URL + '/128px/chest.png',
    innerthigh: process.env.PUBLIC_URL + '/128px/innerthigh.png',
    externalobliques: process.env.PUBLIC_URL + '/128px/externalobliques.png',
    frontthigh: process.env.PUBLIC_URL + '/128px/frontthigh.png',
    glutes: process.env.PUBLIC_URL + '/128px/glutes.png',
    hamstrings: process.env.PUBLIC_URL + '/128px/hamstrings.png',
    lower: process.env.PUBLIC_URL + '/128px/lower.png',
    lumbar: process.env.PUBLIC_URL + '/128px/lumbar.png',
    obliques: process.env.PUBLIC_URL + '/128px/obliques.png',
    pectorals: process.env.PUBLIC_URL + '/128px/pectorals.png',
    posteriorforearm: process.env.PUBLIC_URL + '/128px/posteriorforearm.png',
    quadriceps: process.env.PUBLIC_URL + '/128px/quadriceps.png',
    rectusabdominis: process.env.PUBLIC_URL + '/128px/rectusabdominis.png',
    shoulderback: process.env.PUBLIC_URL + '/128px/shoulderback.png',
    shoulderfront: process.env.PUBLIC_URL + '/128px/shoulderfront.png',
    topback: process.env.PUBLIC_URL + '/128px/topback.png',
    outerthigh: process.env.PUBLIC_URL + '/128px/outerthigh.png',
    trapezius: process.env.PUBLIC_URL + '/128px/trapezius.png',
    triceps: process.env.PUBLIC_URL + '/128px/triceps.png',
    cardio: process.env.PUBLIC_URL + '/128px/cardio.png',
    stretching: process.env.PUBLIC_URL + '/128px/stretching.png',
    warmup: process.env.PUBLIC_URL + '/128px/warmup.png',
    cancel: process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png',
  };

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

    exercise
  }, []);

  // useEffect(() => {
  // }, [exercise, newExercise]);

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
      putItemsInDisplay([newItem]);
      const data = await objectiveslistApi.putObjectiveItems([newItem], (error:any) => popMessage(error.Message, MessageType.Error, 10));

      if(data){
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
    const data = await objectiveslistApi.deleteObjectiveItem(exercise, (error:any) => popMessage(error.Message, MessageType.Error, 10));

    if(data){
      setIsEditingExercise(false);
      putItemsInDisplay([exercise], true);
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
      BodyImages: newExercise.BodyImages,
    };

    if(newItem.Title !== exercise.Title || 
      newItem.Reps !== exercise.Reps ||
      newItem.Series !== exercise.Series ||
      newItem.MaxWeight !== exercise.MaxWeight ||
      newItem.Pos !== exercise.Pos ||
      newItem.Description !== exercise.Description ||
      newItem.Weekdays !== exercise.Weekdays ||
      newItem.BodyImages !== exercise.BodyImages ||
      newItem.LastDone !== exercise.LastDone) {
      setIsSavingExercise(true);

      const data = await objectiveslistApi.putObjectiveItems([newExercise], (error:any) => popMessage(error.Message, MessageType.Error, 10));

      if(data){
        setIsEditingExercise(false);
        putItemsInDisplay(data);
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

  const getWeekButtonColor = (weekday: Weekdays) => {
    const isCont = newExercise.Weekdays.includes(weekday);
    if(isCont){
      return 'exerciseWeekdaysButton exerciseWeekdaysButtonSelected ' + getItemScssColor(theme, SCSSItemType.TEXT, SCSSItemType.BORDERCOLOR) + getScssObjColor(theme, SCSSObjType.OBJ_BG)
    }
    else{
      return 'exerciseWeekdaysButton ' + getItemScssColor(theme, SCSSItemType.TEXT);
    }
  }

  const getWeekdaysButtons = () => {
    return(
      <div className={'exerciseWeekdaysContainer'}>
        <div className={'exerciseWeekdaysButtonAllNone' + getItemScssColor(theme, SCSSItemType.TEXT, SCSSItemType.BORDERCOLOR) + getScssObjColor(theme, SCSSObjType.OBJ_BG)} onClick={allWeekdayChange}>All</div>
        <div className={'exerciseWeekdaysButtonAllNone' + getItemScssColor(theme, SCSSItemType.TEXT, SCSSItemType.BORDERCOLOR) + getScssObjColor(theme, SCSSObjType.OBJ_BG)} onClick={noneWeekdayChange}>None</div>
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

  const onChangeBodyImage = (bodyImage: string) => {
    const includes = newExercise.BodyImages.includes(bodyImage);
  
    if(includes){
      setNewExercise({...newExercise, BodyImages: newExercise.BodyImages.filter((item)=>item!==bodyImage)});
    }
    else{
      setNewExercise({...newExercise, BodyImages: [...newExercise.BodyImages, bodyImage]});
    }
  };

  const bodyImageEditButton = (bodyImage: string) => {
    if(bodyImage === 'cancel'){
      setNewExercise({...newExercise, BodyImages: []});
      return;
    }

    onChangeBodyImage(bodyImage);
  }

  const getBodyImage = (bodyImage: string, view: boolean = false) => {
    if (typeof newExercise.BodyImages === 'string' || newExercise.BodyImages === undefined) {
      newExercise.BodyImages = [];
    }
    const isSelectedSaved = newExercise.BodyImages.includes(bodyImage);

    if(view){
      return (
        <PressImage
            size={'bigger'}
            src={bodyImages[bodyImage]}
            onClick={() => {onEditExercise(); }}
            isBlack={props.isLoadingBlack}
          />
      );
    }
    else{
      return(
        <div className={'exerciseBodyImageContainer ' + (isSelectedSaved? getScssObjColor(theme, SCSSObjType.OBJ_BG) + getItemScssColor(theme, SCSSItemType.BORDERCOLOR)+' exerciseBodyImageContainerSelected ':'')}>
          <PressImage
            size={'bigger'}
            src={bodyImages[bodyImage]}
            onClick={() => {bodyImageEditButton(bodyImage)}}
            isBlack={props.isLoadingBlack}
          />
        </div>
      )
    }
  }; 

  const getBodyImages = () => {
    if (!exercise.BodyImages || exercise.BodyImages === undefined || exercise.BodyImages.includes('cancel')) return <></>;

    const rtn = [];

    for (let i = 0; i < exercise.BodyImages.length; i++) {
      rtn.push(getBodyImage(exercise.BodyImages[i], true));
    }

    return <>{rtn}</>;
  };

  const getTitle = () => {
    let title = '';
    if(exercise.Title !== ''){
      if(exercise.Reps > 1 || exercise.Series > 1) title += exercise.Series + 'x' + exercise.Reps + ' ';
      title += exercise.Title;
      if(exercise.MaxWeight) title += ' (Max: '+exercise.MaxWeight+')';
      title += exercise.Weekdays.includes(Weekdays.Monday)?' Mo':'';
      title += exercise.Weekdays.includes(Weekdays.Tuesday)?' Tu':'';
      title += exercise.Weekdays.includes(Weekdays.Wednesday)?' We':'';
      title += exercise.Weekdays.includes(Weekdays.Thursday)?' Th':'';
      title += exercise.Weekdays.includes(Weekdays.Friday)?' Fr':'';
      title += exercise.Weekdays.includes(Weekdays.Saturday)?' Sa':'';
      title += exercise.Weekdays.includes(Weekdays.Sunday)?' Su':'';
    }
    
    return <div className={'exerciseText' + getItemScssColor(theme, SCSSItemType.TEXT)}>{title}</div>;
  }

  return (
    <div className={'exerciseContainer' + itemGetTheme(theme, isSelected, isEndingPos, exercise.IsDone)}>
      {isSavingExercise?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingExercise?
          <div className='inputsContainer'>
            <div className='exerciseSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='exerciseCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newExercise.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={itemInputColor(theme)}
                type='number'
                value={newExercise.Series}
                onChange={handleSeriesInputChange}
                onKeyDown={handleKeyDown}
                min={1}></input>
              <input 
                className={itemInputColor(theme)}
                type='number'
                value={newExercise.Reps}
                onChange={handleRepsInputChange}
                onKeyDown={handleKeyDown}
                min={1}></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newExercise.MaxWeight}
                onChange={handleMaxHeightInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Max"></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newExercise.Description}
                onChange={handleDescriptionInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Description"></input>
              <div className={'exerciseHeaderText ' + getItemScssColor(theme, SCSSItemType.TEXT)}>WEEKDAYS</div>
              {getWeekdaysButtons()}
              <div className={'exerciseHeaderText ' + getItemScssColor(theme, SCSSItemType.TEXT)}>BODY PART</div>
              {<div className={'exerciseBodyImagesContainer'}>
                {getBodyImage('chest')}
                {getBodyImage('triceps')}
                {getBodyImage('shoulderfront')}
                {getBodyImage('anteriorforearm')}
                {getBodyImage('trapezius')}
                {getBodyImage('biceps')}
                {getBodyImage('posteriorforearm')}
                {getBodyImage('shoulderback')}
                {getBodyImage('backoutside')}
                {getBodyImage('topback')}
                {getBodyImage('abs')}
                {getBodyImage('pectorals')}
                {getBodyImage('lower')}
                {getBodyImage('obliques')}
                {getBodyImage('externalobliques')}
                {getBodyImage('hamstrings')}
                {getBodyImage('frontthigh')}
                {getBodyImage('quadriceps')}
                {getBodyImage('innerthigh')}
                {getBodyImage('outerthigh')}
                {getBodyImage('glutes')}
                {getBodyImage('lumbar')}
                {getBodyImage('calves')}
                {getBodyImage('rectusabdominis')}
                {getBodyImage('cardio')}
                {getBodyImage('stretching')}
                {getBodyImage('warmup')}
                {getBodyImage('cancel')}
              </div>}
            </div>
            <div className='exerciseSideContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className='exerciseDisplayContainer'>
            <div className='exerciseLine' onClick={onEditExercise}>
              <div className={'exerciseMainLine' + itemTextColor(theme, exercise.IsDone)}>
                {getBodyImages()}
                {getTitle()}
              </div>
              {exercise.Description && <div className={'exerciseDescriptionText'}> {exercise.Description}</div>}
            </div>
            {!isEditingExercise &&
              (isSavingIsDone?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                (exercise.IsDone?
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeDone()}} src={process.env.PUBLIC_URL + '/exercise-filled-grey.png'}/>
                  :
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeDone()}} src={process.env.PUBLIC_URL + '/exercise' + itemTintColor(theme) + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}
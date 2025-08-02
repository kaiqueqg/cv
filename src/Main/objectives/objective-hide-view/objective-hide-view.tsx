import { useEffect, useState } from "react";
import './objective-hide-view.scss';
// import { objectiveslistApi } from "../../../requests-sdk/requests-sdk";
import log from "../../../log/log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../loading/loading";
import PressImage from "../../../press-image/press-image";
import { useUserContext } from "../../../contexts/user-context";
import { useRequestContext } from "../../../contexts/request-context";

interface ObjectiveHideViewProps{
  objective: Objective,
  putObjectiveInDisplay: (obj?: Objective, remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

const ObjectiveHideView: React.FC<ObjectiveHideViewProps> = (props) => {
  const { identityApi, objectiveslistApi } = useRequestContext();
  const { objective, putObjectiveInDisplay, isObjsEditingPos } = props;
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBeingHover, setIsBeingHover] = useState<boolean>(false);

  const { selectedTags } = useUserContext();

  const onChangeObjectiveShowing = async (objective: Objective) => {
    setIsOpening(true);
    try {
      const newObjective: Objective = {...objective, IsShowing: !objective.IsShowing, LastModified: new Date().toISOString()};
      putObjectiveInDisplay(newObjective);

      const data = await objectiveslistApi.putObjective(newObjective);
      if(data){
      }
      else{
        putObjectiveInDisplay(objective); // is right?
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    
    setIsOpening(false);
  }

  const getTheme = () => {
    if(objective.Theme === 'blue'){
      return ' objObjectiveBlue'
    }
    else if(objective.Theme === 'red'){
      return ' objObjectiveRed'
    }
    else if(objective.Theme === 'green'){
      return ' objObjectiveGreen'
    }
    else if(objective.Theme === 'white'){
      return ' objObjectiveWhite'
    }
    else if(objective.Theme === 'cyan'){
      return ' objObjectiveCyan'
    }
    else if(objective.Theme === 'pink'){
      return ' objObjectivePink'
    }
    else if(objective.Theme === 'noTheme'){
      return ' objObjectiveNoTheme'
    }
  }

  const getTextColor = () => {
    return ' textColor' + (objective.Theme === 'white' || objective.Theme === 'pink'?'White':'');
  }

  const getTintColor = () => {
    if(objective.Theme === 'white' || objective.Theme === 'pink')
      return '-black';
    else
      return '';
  }

  const isLoadingBlack = () => { return objective.Theme==='white' || objective.Theme==='pink'}

  const shouldShowPin = () => {
    const as = selectedTags.filter(tag => objective.Tags.includes(tag));
    return as.length === 1 && as[0] === 'Pin';
  }

  return (
    <div 
      className={'objectiveClosedContainer' + getTheme()} 
      onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveShowing(objective)}}
      onMouseEnter={()=>{if(!isObjsEditingPos)setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      {shouldShowPin() && <img className='hidePinImage' src={process.env.PUBLIC_URL + '/pin.png'}></img>}
      {isOpening ?
        <Loading IsBlack={isLoadingBlack()}></Loading>
        :
        (isBeingHover?
          <PressImage isBlack={isLoadingBlack()} src={process.env.PUBLIC_URL + '/show' + getTintColor() + '.png'}/>
          :
          <div className={'objectiveClosedText' + getTextColor()}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveHideView;
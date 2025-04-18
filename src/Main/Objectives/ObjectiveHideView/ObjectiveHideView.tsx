import { useEffect, useState } from "react";
import './ObjectiveHideView.scss';
import { objectiveslistApi } from "../../../Requests/RequestFactory";
import log from "../../../Log/Log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../Loading/Loading";

interface ObjectiveHideViewProps{
  objective: Objective,
  putObjectiveInDisplay: (obj?: Objective, remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

const ObjectiveHideView: React.FC<ObjectiveHideViewProps> = (props) => {
  const { objective, putObjectiveInDisplay, isObjsEditingPos } = props;

  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBeingHover, setIsBeingHover] = useState<boolean>(false);

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
    if(objective.Theme === 'darkBlue'){
      return ' objObjectiveBlue'
    }
    else if(objective.Theme === 'darkRed'){
      return ' objObjectiveRed'
    }
    else if(objective.Theme === 'darkGreen'){
      return ' objObjectiveGreen'
    }
    else if(objective.Theme === 'darkWhite'){
      return ' objObjectiveWhite'
    }
    else if(objective.Theme === 'darkCyan'){
      return ' objObjectiveCyan'
    }
    else if(objective.Theme === 'darkPink'){
      return ' objObjectivePink'
    }
    else if(objective.Theme === 'noTheme'){
      return ' objObjectiveNoTheme'
    }
  }

  const getTextColor = () => {
    return ' textColor' + (objective.Theme === 'darkWhite' || objective.Theme === 'darkPink'?'White':'');
  }

  const getTintColor = () => {
    if(objective.Theme === 'darkWhite' || objective.Theme === 'darkPink')
      return '-black';
    else
      return '';
  }

  return (
    <div 
      className={'objectiveClosedContainer' + getTheme()} 
      onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveShowing(objective)}}
      onMouseEnter={()=>{if(!isObjsEditingPos)setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      { isOpening ?
        <Loading IsBlack={objective.Theme==='darkWhite' || objective.Theme === 'darkPink'}></Loading>
        :
        (isBeingHover?
          <img className="objectiveClosedImage" src={process.env.PUBLIC_URL + '/show' + getTintColor() + '.png'} alt='meaningfull text'></img>
          :
          <div className={'objectiveClosedText' + getTextColor()}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveHideView;
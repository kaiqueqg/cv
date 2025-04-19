import { useEffect, useState } from "react";
import './ObjectiveArchivedView.scss';
import { objectiveslistApi } from "../../../Requests/RequestFactory";
import log from "../../../Log/Log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../Loading/Loading";

interface ObjectiveArchivedViewProps{
  objective: Objective,
  putObjectiveInDisplay: (obj?: Objective, remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

const ObjectiveArchivedView: React.FC<ObjectiveArchivedViewProps> = (props) => {
  const { objective, putObjectiveInDisplay, isObjsEditingPos } = props;

  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  const [isBeingHover, setIsBeingHover] = useState<boolean>(false);

  const onChangeObjectiveArchived = async (objective: Objective) => {
    setIsUnarchiving(true);
    try {
      const newObjective: Objective = {...objective, IsArchived: !objective.IsArchived, LastModified: new Date().toISOString()};
      putObjectiveInDisplay(newObjective)
      const data = await objectiveslistApi.putObjective(newObjective);
  
      if(data){
      }
      else{
        putObjectiveInDisplay(objective);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsUnarchiving(false);
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
    if(objective.Theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  return (
    <div 
      className={'objectiveArchivedContainer' + getTheme()} 
      onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveArchived(objective)}}
      onMouseEnter={()=>{if(!isObjsEditingPos)setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      { isUnarchiving ?
        <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
        :
        (isBeingHover?
          <img className="objectiveArchivedImage" src={process.env.PUBLIC_URL + '/unarchive' + getTintColor() + '.png'} alt='meaningfull text'></img>
          :
          <div className={'objectiveArchivedText' + getTextColor()}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveArchivedView;
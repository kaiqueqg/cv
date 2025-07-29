import { useEffect, useState } from "react";
import './objective-archived-view.scss';
import { objectiveslistApi } from "../../../requests-sdk/requests-sdk";
import log from "../../../log/log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../loading/loading";

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
    if(objective.Theme === 'white')
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
        <Loading IsBlack={objective.Theme==='white'}></Loading>
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
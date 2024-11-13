import { useEffect, useState } from "react";
import './ObjectiveClosedView.scss';
import { objectiveslistApi } from "../../../Requests/RequestFactory";
import log from "../../../Log/Log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../Loading/Loading";

interface ObjectiveClosedViewProps{
  objective: Objective,
  putObjectiveInDisplay: (obj?: Objective, remove?: boolean) => void,
}

const ObjectiveClosedView: React.FC<ObjectiveClosedViewProps> = (props) => {
  const { objective, putObjectiveInDisplay } = props;

  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBeingHover, setIsBeingHover] = useState<boolean>(false);

  const onChangeObjectiveOpen = async (objective: Objective) => {
    setIsOpening(true);
    try {
      const data = await objectiveslistApi.putObjective({...objective, IsOpen: !objective.IsOpen, LastModified: new Date().toISOString()}, () => {});
  
      if(data){
        putObjectiveInDisplay(data)
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
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
    else if(objective.Theme === 'noTheme'){
      return ' objObjectiveNoTheme'
    }
  }

  const getTextColor = () => {
    if(objective.Theme === 'darkBlue'){
      return ' objTextBlue'
    }
    else if(objective.Theme === 'darkRed'){
      return ' objTextRed'
    }
    else if(objective.Theme === 'darkGreen'){
      return ' objTextGreen'
    }
    else if(objective.Theme === 'darkWhite'){
      return ' objTextWhite'
    }
    else if(objective.Theme === 'noTheme'){
      return ' objTextNoTheme'
    }
    else{
      return ' objTextBlue';
    }
  }

  const getTintColor = () => {
    if(objective.Theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  return (
    <div 
      className={'objectiveClosedContainer' + getTheme()} 
      onClick={()=>onChangeObjectiveOpen(objective)}
      onMouseEnter={()=>{setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      { isOpening ?
        <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
        :
        (isBeingHover?
          <img className="objectiveClosedImage" src={process.env.PUBLIC_URL + '/unarchive' + getTintColor() + '.png'} alt='meaningfull text'></img>
          :
          <div className={'objectiveClosedText' + getTextColor()}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveClosedView;
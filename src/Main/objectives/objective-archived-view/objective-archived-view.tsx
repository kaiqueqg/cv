import { useEffect, useState } from "react";
import './objective-archived-view.scss';
// import { objectiveslistApi } from "../../../requests-sdk/requests-sdk";
import log from "../../../log/log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../loading/loading";
import { useRequestContext } from "../../../contexts/request-context";
import { SCSS, useThemeContext } from "../../../contexts/theme-context";

interface ObjectiveArchivedViewProps{
  objective: Objective,
  putObjectiveInDisplay: (obj?: Objective, remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

const ObjectiveArchivedView: React.FC<ObjectiveArchivedViewProps> = (props) => {
  const { objectiveslistApi } = useRequestContext();
  const { scss, getTintColor } = useThemeContext();

  const { objective, putObjectiveInDisplay, isObjsEditingPos } = props;
  const { Theme } = objective;

  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  const [isBeingHover, setIsBeingHover] = useState<boolean>(false);

  const onChangeObjectiveArchived = async (objective: Objective) => {
    setIsUnarchiving(true);
    try {
      const newObjective: Objective = {...objective, IsArchived: !objective.IsArchived, LastModified: new Date().toISOString()};
      putObjectiveInDisplay(newObjective)
      const data = await objectiveslistApi.putObjectives([newObjective]);
  
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

  return (
    <div 
      className={'objectiveArchivedContainer' + scss(Theme, [SCSS.BORDERCOLOR_CONTRAST, SCSS.ITEM_BG])}
      onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveArchived(objective)}}
      onMouseEnter={()=>{if(!isObjsEditingPos)setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      { isUnarchiving ?
        <Loading IsBlack={objective.Theme==='white'}></Loading>
        :
        (isBeingHover?
          <img className="objectiveArchivedImage" src={process.env.PUBLIC_URL + '/unarchive' + getTintColor(Theme) + '.png'} alt='meaningfull text'></img>
          :
          <div className={'objectiveArchivedText' + scss(Theme, [SCSS.TEXT])}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveArchivedView;
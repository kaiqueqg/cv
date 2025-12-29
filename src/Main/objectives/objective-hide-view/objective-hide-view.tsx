import { useEffect, useState } from "react";
import './objective-hide-view.scss';
// import { objectiveslistApi } from "../../../requests-sdk/requests-sdk";
import log from "../../../log/log";
import { Objective } from "../../../TypesObjectives";
import Loading from "../../../loading/loading";
import PressImage from "../../../press-image/press-image";
import { useUserContext } from "../../../contexts/user-context";
import { useRequestContext } from "../../../contexts/request-context";
import { SCSS, useThemeContext } from "../../../contexts/theme-context";

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
  const { Theme } = objective;

  const { selectedTags } = useUserContext();
  const { scss, getTintColor } = useThemeContext();

  const onChangeObjectiveShowing = async (objective: Objective) => {
    setIsOpening(true);
    try {
      const newObjective: Objective = {...objective, IsShowing: !objective.IsShowing, LastModified: new Date().toISOString()};
      putObjectiveInDisplay(newObjective);

      const data = await objectiveslistApi.putObjectives([newObjective]);
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

  const isLoadingBlack = () => { return objective.Theme==='white' || objective.Theme==='pink'}

  const shouldShowPin = () => {
    const as = selectedTags.filter(tag => objective.Tags.includes(tag));
    return as.length === 1 && as[0] === 'Pin';
  }

  return (
    <div 
      className={'objectiveClosedContainer ' + scss(objective.Theme, [SCSS.BORDERCOLOR_CONTRAST, SCSS.OBJ_BG])} 
      onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveShowing(objective)}}
      onMouseEnter={()=>{if(!isObjsEditingPos)setIsBeingHover(true)}}
      onMouseLeave={()=>{setIsBeingHover(false)}}
      >
      {shouldShowPin() && <img className='hidePinImage' src={process.env.PUBLIC_URL + '/pin.png'}></img>}
      {isOpening ?
        <Loading IsBlack={isLoadingBlack()}></Loading>
        :
        (isBeingHover?
          <PressImage isLoadingBlack={isLoadingBlack()} src={process.env.PUBLIC_URL + '/show' + getTintColor(Theme) + '.png'}/>
          :
          <div className={'objectiveClosedText' + scss(Theme, [SCSS.TEXT])}>{objective.Title}</div>
        )
      }
    </div>
  )
}

export default ObjectiveHideView;
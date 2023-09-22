import React from 'react';
import colors from '../../../Colors';
import T from '../../../Text/T';
import { ExperienceData } from '../../../Types';

interface P{
  experienceData: ExperienceData,
}

interface S{
}

class Experience extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    const { experienceData } = this.props;
    
    return (
      <div style={{margin: '10px'}}>
        <T style={{fontSize: '30px', fontWeight: 'bold', margin: '10px 10px 0px', color: colors.blue}} text={experienceData.company}></T>
        <T style={{fontSize: '13px', margin: '0px 0px 10px 10px', color: colors.grey}} text={experienceData.timeOnIt}></T>
        <T style={{fontSize: '15px', margin: '0px 10px', color: colors.blue}} text={experienceData.jobTitle}></T>
        <T style={{margin: '10px', color: colors.blue}} text={experienceData.description}></T>
      </div>
    )
  }
}

export default Experience
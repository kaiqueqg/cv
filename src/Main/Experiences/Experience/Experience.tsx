import React from 'react';
import colors from '../../../Colors';
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
        <div style={{fontSize: '30px', fontWeight: 'bold', margin: '10px 10px 0px', color: colors.blue}}>{experienceData.company}</div>
        <div style={{fontSize: '13px', margin: '0px 0px 10px 10px', color: colors.grey}}>{experienceData.timeOnIt}</div>
        <div style={{fontSize: '15px', margin: '0px 10px', color: colors.blue}}>{experienceData.jobTitle}</div>
        <div style={{margin: '10px', color: colors.blue}}>{experienceData.description}</div>
      </div>
    )
  }
}

export default Experience
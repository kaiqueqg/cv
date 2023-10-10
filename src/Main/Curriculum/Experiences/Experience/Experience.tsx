import React from 'react';
import T from '../../../../Text/T';
import { ExperienceData } from '../../../../Types';
import './Experience.scss'

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
      <div className='experienceContainer'>
        <T className='experienceCompany' text={experienceData.company}></T>
        <T className='experienceTimeOnIt' text={experienceData.timeOnIt}></T>
        <T className='experienceJobTitle' text={experienceData.jobTitle}></T>
        <T className='experienceDescription' text={experienceData.description}></T>
      </div>
    )
  }
}

export default Experience
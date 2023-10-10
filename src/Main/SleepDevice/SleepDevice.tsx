import React from 'react';
import './SleepDevice.scss'
import { Language } from '../../Types';

interface P{
}

interface S{
}

class SleepDevice extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    
    return (
      <div className='sleepContainer'>
        
      </div> 
    )
  }
}

export default SleepDevice
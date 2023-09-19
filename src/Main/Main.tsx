import React from 'react';
import './Main.css'
import Experiences from './Experiences/Experiences';
import Knowledges from './Knowledge/Knowledges';

interface P{
}

interface S{
}

class Main extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    
    return (
      <div style={{width: '70%', display: 'flex', flexDirection: 'row'}}>
        <Knowledges></Knowledges>
        <Experiences></Experiences>
      </div>
    )
  }
}

export default Main
import React from 'react';
import './Main.css'
import Experiences from './Experiences/Experiences';
import Knowledges from './Knowledge/Knowledges';
import { Language } from '../Types';

interface P{
  lang: Language,
}

interface S{
}

class Curriculum extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    const { lang } = this.props;
    
    return (
      <div style={{width: '70%', display: 'flex', flexDirection: 'row'}}>
        <Knowledges lang={lang}></Knowledges>
        <Experiences lang={lang}></Experiences>
      </div> 
    )
  }
}

export default Curriculum
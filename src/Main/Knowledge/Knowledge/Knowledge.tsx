import React from 'react';
import T from '../../../Text/T';
import './Knowledge.css'
import { LangText, Language } from '../../../Types';

interface P{
  text: LangText,
  level: number,
}

interface S{
}

class Knowledge extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  getLevel = () => {
    const { level } = this.props
    let divs = [];
    for(let i = 0; i < 4; i++){
      divs.push(<div key={this.props.text.ptbr+i} style={{margin: '1px'}}>{i < level? '⚫' : '⚪'}</div>);
    }

    return divs;
  }

  render(): React.ReactNode {
    const { text } = this.props;

    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {this.getLevel()}
        <div style={{margin: '1px'}}>{<T text={text}></T>}</div>
      </div>
    )
  }
}

export default Knowledge
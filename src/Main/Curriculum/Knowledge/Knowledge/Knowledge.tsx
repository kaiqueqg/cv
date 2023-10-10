import React from 'react';
import T from '../../../../Text/T';
import './Knowledge.scss'
import { LangText, Language } from '../../../../Types';

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
      divs.push(<div key={this.props.text.ptbr+i} className='level'>{i < level? '⚫' : '⚪'}</div>);
    }

    return divs;
  }

  render(): React.ReactNode {
    const { text } = this.props;

    return (
      <div className='knowledgeContainer'>
        {this.getLevel()}
        <div className='levelText'>{<T text={text}></T>}</div>
      </div>
    )
  }
}

export default Knowledge
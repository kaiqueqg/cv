import React from 'react';

interface P{
  text: string,
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
      divs.push(<div style={{margin: '1px'}}>{i < level? '⚫' : '⚪'}</div>);
    }

    return divs;
  }

  render(): React.ReactNode {
    // ⚫⚪
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {this.getLevel()}
        <div style={{margin: '1px'}}>{this.props.text}</div>
      </div>
    )
  }
}

export default Knowledge
import React from 'react';
import { LangText, Language } from '../Types';
import './T.scss'

interface P{
  text: LangText,
  style?: React.CSSProperties,
  className?: string,
}

interface S{
}

class T extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    const { text } = this.props;
    
    return (
      <React.Fragment>
        {text.current === Language.PR_BR && <div className={this.props.className} style={this.props.style}>{text.ptbr}</div>}
        {text.current === Language.EN && <div className={this.props.className} style={this.props.style}>{text.en ? text.en: text.ptbr}</div>}
        {text.current === Language.FR && <div className={this.props.className} style={this.props.style}>{text.fr ? text.fr: text.ptbr}</div>}
        {text.current === Language.IT && <div className={this.props.className} style={this.props.style}>{text.it ? text.it: text.ptbr}</div>}
      </React.Fragment>
    )
  }
}

export default T
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

  getText = () => {
    const { text } =this.props;
    let cText = text.ptbr;
    switch(text.current){
      case Language.EN:
        cText = text.en? text.en:text.ptbr;
        break;
      case Language.FR:
        cText = text.fr? text.fr:text.ptbr;
        break;
      case Language.IT:
        cText = text.it? text.it:text.ptbr;
        break;
    }
    return cText;
  }

  render(): React.ReactNode {
    const { text } = this.props;

    return (
      <React.Fragment>
        {text.current === Language.PR_BR && <div className={this.props.className} style={this.props.style}>{this.getText()}</div>}
        {text.current === Language.EN && <div className={this.props.className} style={this.props.style}>{this.getText()}</div>}
        {text.current === Language.FR && <div className={this.props.className} style={this.props.style}>{this.getText()}</div>}
        {text.current === Language.IT && <div className={this.props.className} style={this.props.style}>{this.getText()}</div>}
      </React.Fragment>
    )
  }
}

export default T
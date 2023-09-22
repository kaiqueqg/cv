import React from 'react';
import './TopMenu.css';
import { Language } from '../../Types';
import Text from '../../Text/T';
import T from '../../Text/T';

interface P{
  lang: Language,
  changeLanguage: (language: Language) => void,
}

interface S{
}

class TopMenu extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    const { lang } = this.props;

    return (
      <div style={{width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'right'}}>
        <img src={process.env.PUBLIC_URL + '/brazil.png'} alt='' className={lang !== Language.PR_BR? 'langImg' : 'langImgSelected'} onClick={() => {this.props.changeLanguage(Language.PR_BR)}}></img>
        <img src={process.env.PUBLIC_URL + '/united-states-of-america.png'} alt='' className={lang !== Language.EN? 'langImg' : 'langImgSelected'} onClick={() => {this.props.changeLanguage(Language.EN)}}></img>
        <img src={process.env.PUBLIC_URL + '/france.png'} alt='' className={lang !== Language.FR? 'langImg' : 'langImgSelected'} onClick={() => {this.props.changeLanguage(Language.FR)}}></img>
        <img src={process.env.PUBLIC_URL + '/italy.png'} alt='' className={lang !== Language.IT? 'langImg' : 'langImgSelected'} onClick={() => {this.props.changeLanguage(Language.IT)}}></img>
      </div>
    )
  }
}

export default TopMenu
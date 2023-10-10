import React from 'react';
import './Curriculum.scss'
import Experiences from './Experiences/Experiences';
import Knowledges from './Knowledge/Knowledges';
import { Language } from '../../Types';

interface P{
  lang: Language,
  changeLanguage: (language: Language) => void,
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
      <div className='curriculumContainer'>
        <div className='cvTopItemsContainer'>
          <div className='cvLangContainer'>
            <img src={process.env.PUBLIC_URL + '/brazil.png'} alt='' className={lang !== Language.PR_BR? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {this.props.changeLanguage(Language.PR_BR)}}></img>
            <img src={process.env.PUBLIC_URL + '/united-states-of-america.png'} alt='' className={lang !== Language.EN? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {this.props.changeLanguage(Language.EN)}}></img>
            <img src={process.env.PUBLIC_URL + '/france.png'} alt='' className={lang !== Language.FR? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {this.props.changeLanguage(Language.FR)}}></img>
            <img src={process.env.PUBLIC_URL + '/italy.png'} alt='' className={lang !== Language.IT? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {this.props.changeLanguage(Language.IT)}}></img>
          </div>
        </div>
        <div className='cvContainer'>
          <Knowledges lang={lang}></Knowledges>
          <Experiences lang={lang}></Experiences>
        </div>
      </div> 
    )
  }
}

export default Curriculum
import React, { useState } from 'react';
import './Curriculum.scss'
import Experiences from './Experiences/Experiences';
import Knowledges from './Knowledge/Knowledges';
import { Language } from '../../Types';

interface CurriculumProps{
}

const Curriculum: React.FC<CurriculumProps> = () => {
  const [lang, setLang] = useState<Language>(Language.EN);

  return (
    <div className='curriculumContainer'>
      <div className='cvTopItemsContainer'>
        <div className='cvLangContainer'>
          <img src={process.env.PUBLIC_URL + '/brazil.png'} alt='' className={lang !== Language.PR_BR? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {setLang(Language.PR_BR)}}></img>
          <img src={process.env.PUBLIC_URL + '/usa.png'} alt='' className={lang !== Language.EN? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {setLang(Language.EN)}}></img>
          <img src={process.env.PUBLIC_URL + '/france.png'} alt='' className={lang !== Language.FR? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {setLang(Language.FR)}}></img>
          <img src={process.env.PUBLIC_URL + '/italy.png'} alt='' className={lang !== Language.IT? 'cvLangImg' : 'cvLangImgSelected'} onClick={() => {setLang(Language.IT)}}></img>
        </div>
      </div>
      <div className='cvContainer'>
        {lang === Language.PR_BR && <iframe className='pdf' src={process.env.PUBLIC_URL +  "/Curriculum.pdf#view=fitH"}/>}
        {lang === Language.EN && <iframe className='pdf' src={process.env.PUBLIC_URL +  "/Curriculum-En.pdf#view=fitH"}/>}
        {lang === Language.FR && <iframe className='pdf' src={process.env.PUBLIC_URL +  "/Curriculum-Fr.pdf#view=fitH"}/>}
        {lang === Language.IT && <iframe className='pdf' src={process.env.PUBLIC_URL +  "/Curriculum-It.pdf#view=fitH"}/>}
        {/* <Knowledges lang={lang}></Knowledges>
        <Experiences lang={lang}></Experiences> */}
      </div>
    </div> 
  )
}

export default Curriculum
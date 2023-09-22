import React from 'react';
import './App.css';
import Curriculum from './Main/Main';
import TopMenu from './Main/TopMenu/TopMenu';
import { Language } from './Types';

interface P{
}

interface S{
  lang: Language,
}

class App extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
      lang: Language.PR_BR,
    }
  }

  changeLanguage = (lang: Language) => {
    this.setState({lang});
  }

  render(): React.ReactNode {
    const { lang } = this.state;
    
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <TopMenu lang={lang} changeLanguage={this.changeLanguage}></TopMenu>
        <Curriculum lang={lang}></Curriculum>
      </div>
    )
  }
}

export default App
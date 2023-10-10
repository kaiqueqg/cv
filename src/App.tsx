import React from 'react';
import './App.scss';
import Curriculum from './Main/Curriculum/Curriculum';
import GroceryList from './Main/GroceryList/GroceryList';
import SleepDevice from './Main/SleepDevice/SleepDevice';
import TopMenu from './Main/TopMenu/TopMenu';
import { Language, MenuOption } from './Types';

interface P{
}

interface S{
  lang: Language,
  menuOption: MenuOption,
}

class App extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
      lang: Language.PR_BR,
      menuOption: MenuOption.GroceryList,
    }
  }

  changeLanguage = (lang: Language) => {
    this.setState({lang});
  }
  
  changeMenuOption = (menuOption: MenuOption) => {
    this.setState({menuOption})
  }

  render(): React.ReactNode {
    const { lang, menuOption } = this.state;
    
    return (
      <div className="appContainer">
        <TopMenu lang={lang} currentMenuOptionSelected={menuOption} changeLanguage={this.changeLanguage} changeMenuOption={this.changeMenuOption}></TopMenu>
        {menuOption === MenuOption.Curriculum && <Curriculum lang={lang} changeLanguage={this.changeLanguage}></Curriculum>}
        {menuOption === MenuOption.GroceryList && <GroceryList></GroceryList>}
        {menuOption === MenuOption.SleepDevice && <SleepDevice></SleepDevice>}
      </div>
    )
  }
}

export default App
import React from 'react';
import './TopMenu.scss';
import { Language, MenuOption } from '../../Types';

interface P{
  lang: Language,
  currentMenuOptionSelected: MenuOption,
  changeLanguage: (language: Language) => void,
  changeMenuOption: (menuOption: MenuOption) => void,
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
    const { currentMenuOptionSelected, changeMenuOption } = this.props;

    return (
      <div className='topMenu'>
        <div key='cvBtn' className={MenuOption.Curriculum === currentMenuOptionSelected? 'menuButton menuSelected': 'menuButton'} onClick={() => {changeMenuOption(MenuOption.Curriculum)}}>
          <div className='text'>Curriculum</div>
        </div>
        <div key='groceryBtn' className={MenuOption.GroceryList === currentMenuOptionSelected? 'menuButton menuSelected': 'menuButton'} onClick={() => {changeMenuOption(MenuOption.GroceryList)}}>
          <div className='text'>Grocery List</div>
        </div>
      </div>
    )
  }
}

export default TopMenu
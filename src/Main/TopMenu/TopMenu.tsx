import './TopMenu.scss';
import { Language, MenuOption } from '../../Types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface TopMenuProps{
}

const TopMenu: React.FC<TopMenuProps> = (props) => {
  const navigate = useNavigate();

  const [ currentMenuOption, setCurrentMenuOption ] = useState<MenuOption>(MenuOption.Curriculum);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        setCurrentMenuOption(MenuOption.Login);
        break;
      case '/cv':
        setCurrentMenuOption(MenuOption.Curriculum);
        break;
      case '/knowledgeshowcase':
        setCurrentMenuOption(MenuOption.GroceryList);
        break;
      default:
        setCurrentMenuOption(MenuOption.Curriculum);
        break;
    }
  }, [location.pathname]);

  return (
    <div className='topMenu'>
      <div key='loginBtn' className={MenuOption.Login === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.Login); navigate("/login");}}>
        <div className={MenuOption.Login === currentMenuOption? 'text textSelected': 'text'}>Login</div>
      </div>
      <div key='cvBtn' className={MenuOption.Curriculum === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.Curriculum); navigate("/cv");}}>
        <div className={MenuOption.Curriculum === currentMenuOption? 'text textSelected': 'text'}>Curriculum</div>
      </div>
      <div key='groceryBtn' className={MenuOption.GroceryList === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.GroceryList); navigate("/knowledgeshowcase")}}>
        <div className={MenuOption.GroceryList === currentMenuOption? 'text textSelected': 'text'}>Showcase</div>
      </div>
      {/* <div key='sleepDeviceBtn' className={MenuOption.SleepDevice === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.SleepDevice); navigate("/sleepDevice")}}>
        <div className={MenuOption.SleepDevice === currentMenuOption? 'text textSelected': 'text'}>Sleep Device</div>
      </div> */}
    </div>
  )
}

export default TopMenu
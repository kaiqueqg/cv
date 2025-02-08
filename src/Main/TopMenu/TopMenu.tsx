import './TopMenu.scss';
import { MenuOption } from '../../Types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';


interface TopMenuProps{
}

const TopMenu: React.FC<TopMenuProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ currentMenuOption, setCurrentMenuOption ] = useState<MenuOption>(MenuOption.Main);

  useEffect(() => {
    switch (location.pathname) {
      case '':
        setCurrentMenuOption(MenuOption.Main);
        break;
      case '/':
        setCurrentMenuOption(MenuOption.Main);
        break;
      case '/login':
        setCurrentMenuOption(MenuOption.Login);
        break;
      case '/cv':
        setCurrentMenuOption(MenuOption.Curriculum);
        break;
      case '/objectiveslist':
        setCurrentMenuOption(MenuOption.ObjectivesList);
        break;
      default:
        setCurrentMenuOption(MenuOption.Main);
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
      <div key='objectiveBtn' className={MenuOption.ObjectivesList === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.ObjectivesList); navigate("/objectiveslist")}}>
        <div className={MenuOption.ObjectivesList === currentMenuOption? 'text textSelected': 'text'}>Objectives</div>
      </div>
      {/* <div key='sleepDeviceBtn' className={MenuOption.SleepDevice === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.SleepDevice); navigate("/sleepDevice")}}>
        <div className={MenuOption.SleepDevice === currentMenuOption? 'text textSelected': 'text'}>Sleep Device</div>
      </div> */}
    </div>
  )
}

export default TopMenu
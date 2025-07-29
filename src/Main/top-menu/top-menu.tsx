import './top-menu.scss';
import { MenuOption } from '../../Types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import { useUserContext } from '../../contexts/user-context';
import SiteMessagesView from '../site-messages-view/site-messages-view';


interface TopMenuProps{
}

const TopMenu: React.FC<TopMenuProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();
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
      <div className='buttonsContainer'>
        <div key='loginBtn' className={MenuOption.Login === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.Login); navigate("/login");}}>
          <div className={MenuOption.Login === currentMenuOption? 'text textSelected': 'text'}>Login</div>
        </div>
        <div key='cvBtn' className={MenuOption.Curriculum === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.Curriculum); navigate("/cv");}}>
          <div className={MenuOption.Curriculum === currentMenuOption? 'text textSelected': 'text'}>Curriculum</div>
        </div>
        <div key='objectiveBtn' className={MenuOption.ObjectivesList === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.ObjectivesList); navigate("/objectiveslist")}}>
          <div className={MenuOption.ObjectivesList === currentMenuOption? 'text textSelected': 'text'}>Objectives</div>
        </div>
        {user?.Role === 'Admin' && <div key='iotBtn' className={MenuOption.IoT === currentMenuOption? 'menuButton menuSelected': 'menuButton'} onClick={() =>{setCurrentMenuOption(MenuOption.IoT); navigate("/iot")}}>
          <div className={MenuOption.IoT === currentMenuOption? 'text textSelected': 'text'}>IoT</div>
        </div>}
      </div>
      <SiteMessagesView></SiteMessagesView>
    </div>
  )
}

export default TopMenu
import './top-menu.scss';
import { MenuOption, Theme } from '../../Types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import { useUserContext } from '../../contexts/user-context';
import SiteMessagesView from '../site-messages-view/site-messages-view';
import Win95Btn from '../../win95-btn/win95-btn';
import Button from '../../button/button';
import {ButtonColor} from '../../button/button';
import { useThemeContext } from '../../contexts/theme-context';
import PressImage from '../../press-image/press-image';


interface TopMenuProps{
}

const TopMenu: React.FC<TopMenuProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogged } = useUserContext();
  const { globalTheme, changeTheme } = useThemeContext();
  const [ currentMenuOption, setCurrentMenuOption ] = useState<MenuOption>(MenuOption.ObjectivesList);

  useEffect(() => {
    switch (location.pathname) {
      case '':
        setCurrentMenuOption(MenuOption.Curriculum);
        break;
      case '/':
        setCurrentMenuOption(MenuOption.ObjectivesList);
        break;
      case '/login':
        setCurrentMenuOption(MenuOption.Login);
        break;
      // case '/cv':
      //   setCurrentMenuOption(MenuOption.Curriculum);
      //   break;
      case '/objectiveslist':
        setCurrentMenuOption(MenuOption.ObjectivesList);
        break;
      default:
        setCurrentMenuOption(MenuOption.ObjectivesList);
        break;
    }
  }, [location.pathname]);

  return (
    <div className='topMenu'>
      <div className='buttonsContainer'>
        <Button color={isLogged?ButtonColor.BLUE:ButtonColor.NEUTRAL} text={isLogged?'Profile':'Login'} isSelected={currentMenuOption===MenuOption.Login} onClick={() =>{setCurrentMenuOption(MenuOption.Login); navigate("/login");}}></Button>
        {/* <Button color={ButtonColor.BLUE} text='Curriculum' isSelected={currentMenuOption===MenuOption.Curriculum} onClick={() =>{setCurrentMenuOption(MenuOption.Curriculum); navigate("/cv");}}></Button> */}
        <Button color={ButtonColor.BLUE} text='Objectives' isSelected={currentMenuOption===MenuOption.ObjectivesList} onClick={() =>{setCurrentMenuOption(MenuOption.ObjectivesList); navigate("/objectiveslist");}}></Button>
        {globalTheme==='Dark' && <Button color={ButtonColor.NEUTRAL} onClick={changeTheme} src={process.env.PUBLIC_URL + '/dark-mode.png'}></Button>}
        {globalTheme==='Light' && <Button color={ButtonColor.NEUTRAL} onClick={changeTheme} src={process.env.PUBLIC_URL + '/light-mode.png'}></Button>}
        {globalTheme==='Win95' && <Button color={ButtonColor.NEUTRAL} onClick={changeTheme} src={process.env.PUBLIC_URL + '/win95.png'}></Button>}
      </div>
      <SiteMessagesView></SiteMessagesView>
    </div>
  )
}

export default TopMenu
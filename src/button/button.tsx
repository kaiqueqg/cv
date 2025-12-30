import React, { useEffect, useState } from 'react';
import './button.scss'
import { SCSS, useThemeContext } from '../contexts/theme-context';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { useLogContext } from '../contexts/log-context';
import { MessageType } from '../Types';
interface ButtonProps {
  onClick?: () => void,
  color: ButtonColor,
  text?: string,
  isSelected?: boolean,
  isDisabled?: boolean,
  disabledMessage?: string,

  src?: string,

}

export enum ButtonColor { BLUE, RED, GREEN, YELLOW, WHITE, NEUTRAL }

const Button: React.FC<ButtonProps> = ({onClick,disabledMessage, text, isSelected, isDisabled, color, src}) => {
  const { scss } = useThemeContext();
  const { popMessage } = useLogContext();
  // const [isClicking, setIsClicking] = useState<boolean>(false);
  
  let count = 0;

  const getTheme = () => {
    let rtn = 'button-base ' +( isSelected?'button-base-selected ':' ');
    if(isDisabled || !onClick) return ' button-disabled ';

    switch(color){
      case ButtonColor.BLUE:
        rtn += ' button-blue' +( isSelected?'-selected ':' ');
        break;
      case ButtonColor.RED:
        rtn += ' button-red' +( isSelected?'-selected ':' ');
        break;
      case ButtonColor.GREEN:
        rtn += ' button-green' +( isSelected?'-selected ':' ');
        break;
      case ButtonColor.YELLOW:
        rtn += ' button-yellow' +( isSelected?'-selected ':' ');
        break;
      case ButtonColor.WHITE:
        rtn += ' button-white' +( isSelected?'-selected ':' ');
        break;
      case ButtonColor.NEUTRAL:
        rtn += ' button-neutral' +( isSelected?'-selected ':' ');
        break;
    }

    return rtn;
  }

  const click = () => {
    if(!onClick)return;

    if(isDisabled){
      count +=1;
      setTimeout(() => {
        count += 0;
      }, 3000);

      if(disabledMessage){
        popMessage(disabledMessage, MessageType.Alert);
      }
      else if(count >= 3 && !disabledMessage){
        popMessage(`It's off......`, MessageType.Alert);
      }
    }
    else{
      onClick();
    }
  }

  const getImageColor = () => {
    if(color === ButtonColor.WHITE) return ' button-dark ';
  }

  return (
    <div 
      className={getTheme()}
      onClick={click}
      >
      {src && 
        <div className={'button-image-container '}>
          <img className={'button-image g-img-dark ' + getImageColor() + (text?' image-text-separation ':'')} src={src}></img>
        </div>
      }
      <div className={' button-text '}>
        {text}
      </div>
    </div>
  );
};

export default Button;
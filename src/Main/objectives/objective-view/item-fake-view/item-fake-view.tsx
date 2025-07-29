import { useEffect } from "react";
import './item-fake-view.scss';
import { ItemViewProps } from "../../../../TypesObjectives";

export const itemFakeNew = () => {
  return(
    {
    }
  )
}

interface StepViewProps extends ItemViewProps{
}

export const ItemFakeView: React.FC<StepViewProps> = (props) => {
  const { theme } = props;


  useEffect(() => {
  }, []);

  const getBorderColor = () => {
    if(theme === 'blue'){
      return ' itemFakeBorderBlue'
    }
    else if(theme === 'red'){
      return ' itemFakeBorderRed'
    }
    else if(theme === 'green'){
      return ' itemFakeBorderGreen'
    }
    else if(theme === 'white'){
      return ' itemFakeBorderWhite'
    }
    else if(theme === 'noTheme'){
      return ' itemFakeBorderNoTheme'
    }
    else{
      return ' itemFakeBorderBlue';
    }
  }

  const getTextColor = () => {
    if(theme === 'blue'){
      return ' itemFakeTextBlue'
    }
    else if(theme === 'red'){
      return ' itemFakeTextRed'
    }
    else if(theme === 'green'){
      return ' itemFakeTextGreen'
    }
    else if(theme === 'white'){
      return ' itemFakeTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' itemFakeTextNoTheme'
    }
    else{
      return ' itemFakeTextBlue';
    }
  }

  return (
    <div className={'itemFakeContainer'+getBorderColor()}>
      <div className={'itemFakeTitle'+getTextColor()}>click to be the first</div>
    </div>
  );
}
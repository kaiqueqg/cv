import { useEffect } from "react";
import './ItemFakeView.scss';
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
    if(theme === 'darkBlue'){
      return ' itemFakeBorderBlue'
    }
    else if(theme === 'darkRed'){
      return ' itemFakeBorderRed'
    }
    else if(theme === 'darkGreen'){
      return ' itemFakeBorderGreen'
    }
    else if(theme === 'darkWhite'){
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
    if(theme === 'darkBlue'){
      return ' itemFakeTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' itemFakeTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' itemFakeTextGreen'
    }
    else if(theme === 'darkWhite'){
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
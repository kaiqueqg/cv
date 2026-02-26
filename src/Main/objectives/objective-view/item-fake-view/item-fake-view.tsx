import { useEffect } from "react";
import './item-fake-view.scss';
import { ItemViewProps } from "../../../../TypesObjectives";
import { Theme } from "../../../../Types";
import { SCSS, useThemeContext } from "../../../../contexts/theme-context";

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
  const { scss } = useThemeContext();

  useEffect(() => {
  }, []);

  return (
    <div className={'itemFakeContainer'+scss(theme, [SCSS.BORDERCOLOR_CONTRAST])}>
      <div className={'itemFakeTitle'+scss(theme, [SCSS.TEXT])}>click to be the first</div>
    </div>
  );
}
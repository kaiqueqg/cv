import { useEffect, useState } from "react";
import './review-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Review, ItemViewProps } from "../../../../TypesObjectives";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { useThemeContext, SCSS } from "../../../../contexts/theme-context";

export function reviewNew(){
  return {
    
  }
}

interface ReviewViewProps extends ItemViewProps{
  review: Review,
}

export const ReviewView: React.FC<ReviewViewProps> = (props) => {
  const { objectiveslistApi } = useRequestContext();
  const { scss } = useThemeContext();
  const { review, theme, putItemsInDisplay, removeItemsInDisplay, isDisabled, isSelecting, isSelected, itemTintColor } = props;

  const [newReview, setNewReview] = useState<Review>(review);
  const [isEditingreview, setIsEditingreview] = useState<boolean>(false);
  
  const [isSavingreview, setIsSavingreview] = useState<boolean>(false);
  const [isSavingIsChecked, setIsSavingIsChecked] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, [review]);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview({...newReview, Title: event.target.value});
  }
  const handleRatingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview({...newReview, Rating: event.target.value});
  }
  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview({...newReview, Description: event.target.value});
  }

  const onEditreview = () => {
    if(!isDisabled)setIsEditingreview(!isEditingreview);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditReview();
    }
    else if(event.key === 'Escape'){
      cancelEditreview();
    }
  }

  const onChangeIsCurrentChoise = async () => {
    setIsSavingIsChecked(true);

    try {
      const newItem: Review = { ...review, IsCurrentChoise: !review.IsCurrentChoise, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItems([newItem]);
      
      if(data){
        putItemsInDisplay([newItem]);
        setIsSavingIsChecked(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingIsChecked(false);
  }

  const doneEditReview = async () => {
    setIsSavingreview(true);
    const newItem: Review = {
      ...newReview,
      Title: newReview.Title.trim(),
      Description: newReview.Description?.trim(),
      Rating: newReview.Rating?.trim(),
      LastModified: new Date().toISOString()
    };

    if(newReview.Title !== review.Title.trim()
      || newItem.Description !== review.Description?.trim()
      || newItem.Rating !== review.Rating?.trim()
      ) {

      const data = await objectiveslistApi.putObjectiveItems([newItem]);

      if(data){
        setIsEditingreview(false);
        putItemsInDisplay(data);
      }
    }
    else{
      setIsEditingreview(false);
      setNewReview(review);
    }

    setIsSavingreview(false);
  }

  const cancelEditreview = () => {
    setNewReview(review);
    setIsEditingreview(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([review]);

    if(data){
      removeItemsInDisplay([review]);
    }

    setIsDeleting(false);
  }

  const getDisplayText = () => {
    let rtn = '';
    rtn += review.Title;

    return rtn;
  }

  return (
    <div className={'reviewContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], review.IsCurrentChoise, isSelecting, isSelected)}>
      {isSavingreview?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingreview?
          <div className='inputsContainer'>
            <div className='reviewSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage/>
              }
            </div>
            <div className='reviewCenterContainer'>
              <input 
                className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
                type='text'
                value={newReview.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus
                spellCheck/>
            </div>
            <div className='reviewSideContainer'>
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={doneEditReview} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} rawImage/>
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={cancelEditreview} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} rawImage/>
            </div>
          </div>
          :
          <div className={'reviewDisplayContainer'}>
            <div className='reviewLine' onClick={onEditreview}>
              <div className={'reviewText' + scss(theme, [SCSS.TEXT], review.IsCurrentChoise)}> {getDisplayText()}</div>
            </div>
            {!isEditingreview &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                (review.IsCurrentChoise && <PressImage isLoadingBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeIsCurrentChoise()}} src={process.env.PUBLIC_URL + '/review.png'}/>)
              )
            }
          </div>
        )
      }
    </div>
  );
}
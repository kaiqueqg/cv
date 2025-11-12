import { useEffect, useState } from "react";
import './question-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Question } from "../../../../TypesObjectives";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";

export function questionNew(){
  return {
    Statement: '',
    Answer: '',
  }
}

interface QuestionViewProps extends ItemViewProps{
  question: Question,
}

export const QuestionView: React.FC<QuestionViewProps> = (props) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { user, setUser } = useUserContext();
  const { question, theme, putItemsInDisplay, isSelected, isEditingPos, isEndingPos,
    itemGetTheme, itemTextColor, itemInputColor, itemTintColor} = props;

  const [newStatement, setNewStatement] = useState<string>(question.Statement);
  const [newAnswer, setNewAnswer] = useState<string>(question.Answer);
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  
  const [isSavingQuestion, setIsSavingQuestion] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const handleStatementInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewStatement(event.target.value);
  }

  const handleAnswerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAnswer(event.target.value);
  }

  const handleStatementKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditQuestion();
    }
    else if(event.key === 'Escape'){
      cancelEditQuestion();
    }
  }

  const handleAnswerKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditQuestion();
    }
    else if(event.key === 'Escape'){
      cancelEditQuestion();
    }
  }

  const doneEditQuestion = async () => {
    setIsSavingQuestion(true);
    const newQuestion: Question = {
      ...question,
      Statement: newStatement.trim(), 
      Answer: newAnswer.trim(),
      LastModified: new Date().toISOString()
    };

    if(newQuestion.Statement !== question.Statement
      || newQuestion.Answer !== question.Answer 
      || newQuestion.Pos !== question.Pos) {
      setIsEditingQuestion(true);

      const data = await objectiveslistApi.putObjectiveItems([newQuestion]);

      if(data){
        setIsEditingQuestion(false);
        putItemsInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingQuestion(false);
      }, 200); 
    }
    else{
      setNewStatement(question.Statement);
    setNewAnswer(question.Answer);
    }

    setIsSavingQuestion(false);
  }

  const cancelEditQuestion = () => {
    setNewStatement(question.Statement);
    setNewAnswer(question.Answer);
    setIsEditingQuestion(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([question]);

    if(data){
      putItemsInDisplay([question], true);
    }

    setIsDeleting(false);
  }

  const shouldBeClear = (): boolean => {
    return question.Answer.trim() !== '' && question.Statement.trim() !== '';
  }

  return (
    <div className={'questionContainer '+itemGetTheme(theme, isSelected, isEndingPos, (question.Statement.trim()!==''&&question.Answer.trim()!==''))}>
      {isSavingQuestion?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingQuestion?
          <div className='locationEditingContainer'>
            <div className='locationSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='locationCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newStatement}
                onChange={handleStatementInputChange}
                onKeyDown={handleStatementKeyDown} 
                placeholder='Statement' autoFocus>
              </input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newAnswer}
                onChange={handleAnswerInputChange}
                onKeyDown={handleAnswerKeyDown} 
                placeholder="Answer"
                ></input>
            </div>
            <div className='locationSideContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEditQuestion} src={process.env.PUBLIC_URL + '/done' +itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEditQuestion} src={process.env.PUBLIC_URL + '/cancel' +itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className='questionDisplayContainer'>
            <div 
              className={'questionDisplayLine ' + itemTextColor(theme, question.Statement.trim()==='')+' textBold'}
              onClick={() => {if(!isEditingPos) setIsEditingQuestion(true)}}>
                {question.Statement===''? 'Question':question.Statement}
              </div>
            <div className='questionAnswerContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={()=>{}} hideHoverEffect={true} src={process.env.PUBLIC_URL + '/arow-down-right-thicker' +itemTintColor(theme) + '.png'}></PressImage>
              <div
                className={'questionDisplayLine ' + itemTextColor(theme, question.Answer.trim()==='')}
                onClick={() => {if(!isEditingPos) setIsEditingQuestion(true)}}>
                  {question.Answer===''? 'Answer':question.Answer}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
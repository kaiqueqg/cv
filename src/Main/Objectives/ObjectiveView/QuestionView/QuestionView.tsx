import { useEffect, useState } from "react";
import './QuestionView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Question } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";

interface QuestionViewProps extends ItemViewProps{
  question: Question,
}

const QuestionView: React.FC<QuestionViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { question, theme, putItemInDisplay, isSelected, isEditingPos, isEndingPos } = props;

  const [newStatement, setNewStatement] = useState<string>(question.Statement);
  const [newAnswer, setNewAnswer] = useState<string>(question.Answer);
  const [isEditingStatement, setIsEditingStatement] = useState<boolean>(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState<boolean>(false);
  
  const [isSavingStatement, setIsSavingStatement] = useState<boolean>(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState<boolean>(false);
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
      doneEditStatement();
    }
    else if(event.key === 'Escape'){
      cancelEditStatement();
    }
  }

  const handleAnswerKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditAnswer();
    }
    else if(event.key === 'Escape'){
      cancelEditAnswer();
    }
  }

  const doneEditStatement = async () => {
    setIsSavingStatement(true);
    const newQuestion: Question = {
      ...question, 
      Statement: newStatement.trim(), 
      LastModified: new Date().toISOString()
    };

    if(newQuestion.Statement !== question.Statement
      || newQuestion.Answer !== question.Answer 
      || newQuestion.Pos !== question.Pos) {
      setIsEditingStatement(true);

      const data = await objectiveslistApi.putObjectiveItem(newQuestion);

      if(data){
        setIsEditingStatement(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingStatement(false);
      }, 200); 
    }
    else{
      setIsEditingStatement(false);
      setNewStatement(question.Statement);
    }

    setIsSavingStatement(false);
  }

  const cancelEditStatement = () => {
    setNewStatement(question.Statement);
    setIsEditingStatement(false);
  }

  const doneEditAnswer = async () => {
    setIsSavingAnswer(true);
    const newQuestion: Question = {
      ...question, 
      Answer: newAnswer.trim(),
      LastModified: new Date().toISOString()};

    if(newQuestion.Statement !== question.Statement
      || newQuestion.Answer !== question.Answer 
      || newQuestion.Pos !== question.Pos) {
      setIsEditingAnswer(true);

      const data = await objectiveslistApi.putObjectiveItem(newQuestion);

      if(data){
        setIsEditingAnswer(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingAnswer(false);
      }, 200); 
    }
    else{
      setIsEditingAnswer(false);
      setNewAnswer(question.Answer);
    }

    setIsSavingAnswer(false);
  }

  const cancelEditAnswer = () => {
    setNewAnswer(question.Answer);
    setIsEditingAnswer(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(question);

    if(data){
      putItemInDisplay(question, true);
    }

    setIsDeleting(false);
  }

  const getTheme = () => {
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'questionContainer questionContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'questionContainer questionContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'questionContainer questionContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'questionContainer questionContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'questionContainer questionContainerNoTheme';
    }
    else{
      rtnTheme = 'questionContainer';
    }
    rtnTheme += isSelected? ' questionContainerSelected':'';
    rtnTheme += isEndingPos&&isSelected? ' questionContainerSelectedEnding':'';
    rtnTheme += (question.Answer.trim() !== '' && question.Statement.trim() !== '')? ' questionContainerNoBackground':'';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' questionTextBlue';
    }
    else if(theme === 'darkRed'){
      return ' questionTextRed';
    }
    else if(theme === 'darkGreen'){
      return ' questionTextGreen';
    }
    else if(theme === 'darkWhite'){
      return ' questionTextWhite';
    }
    else if(theme === 'noTheme'){
      return ' questionTextNoTheme';
    }
    else{
      return ' questionTextBlue';
    }
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' questionTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' questionTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' questionTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' questionTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' questionTextFadeNoTheme'
    }
    else{
      return ' questionTextFadeBlue';
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'questionInputBlue questionTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'questionInputRed questionTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'questionInputGreen questionTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'questionInputWhite questionTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'questionInputNoTheme questionTextNoTheme'
    }
    else{
      v+= 'questionInputNoTheme questionTextNoTheme';
    }

    return 'questionInput ' + v;
  }

  return (
    <div className={getTheme()}>
      <div className='statementLineContainer'>
        {isSavingStatement?
          <Loading IsBlack={theme==='darkWhite'}></Loading>
          :
          (isEditingStatement?
            <>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
              <input 
                className={getInputColor()}
                type='text'
                value={newStatement}
                placeholder='Statement'
                onChange={handleStatementInputChange}
                onKeyDown={handleStatementKeyDown} autoFocus></input>
                <img className='inputImage' onClick={cancelEditStatement} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
                <img className='inputImage' onClick={doneEditStatement} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
            </>
            :
            <div className={'statementLine' + (question.Statement===''? getTextFadeColor():getTextColor())} onClick={() => {if(!isEditingPos)setIsEditingStatement(true)}}>{question.Statement===''? 'Question':question.Statement}</div>
          )
        }
      </div>
      <div className='answerLineContainer'>
        {isSavingAnswer?
          <Loading IsBlack={theme==='darkWhite'}></Loading>
          :
          (isEditingAnswer?
            <>
              <img className='answerImage' src={process.env.PUBLIC_URL + '/arow-down-right-thicker' + getTintColor() + '.png'}></img>
              <input 
                className={getInputColor()}
                type='text'
                placeholder='Question'
                value={newAnswer}
                onChange={handleAnswerInputChange}
                onKeyDown={handleAnswerKeyDown} autoFocus></input>
                <img className='inputImage' onClick={cancelEditAnswer} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
                <img className='inputImage' onClick={doneEditStatement} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
            </>
            :
            <>
              <img className='answerImage' src={process.env.PUBLIC_URL + '/arow-down-right-thicker' + getTintColor() + '.png'}></img>
              <div className={'answerLine' + (question.Answer===''? getTextFadeColor():getTextColor())} onClick={() => {if(!isEditingPos)setIsEditingAnswer(true)}}>{question.Answer===''? 'Answer':question.Answer}</div>
            </>
          )
        }
      </div>
    </div>
  );
}

export default QuestionView;
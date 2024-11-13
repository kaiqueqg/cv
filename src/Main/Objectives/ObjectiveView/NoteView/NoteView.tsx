import { useEffect, useState } from "react";
import './NoteView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Note } from "../../../../TypesObjectives";
import Loading from "../../../../Loading/Loading";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import log from "../../../../Log/Log";
import { isEnumDeclaration } from "typescript";

interface NoteViewProps extends ItemViewProps{
  note: Note,
}

const WaitView: React.FC<NoteViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { note, putItemInDisplay, theme, isSelected, isEditingPos, isEndingPos } = props;

  const [newText, setNewText] = useState<string>(note.Text);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [isSavingText, setIsSavingTitle] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSavingUp, setIsSavingUp] = useState<boolean>(false);
  const [isSavingDown, setIsSavingDown] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const onChangeEditTitle = () => {
    setIsEditingText(!isEditingText);
  }

  const handleTextInputChange = (event: any) => {
    setNewText(event.target.value);
  }

  const handleKeyDown = async (event: any) => {
    if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(note);

    if(data){
      putItemInDisplay(note, true);
    }

    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newNote: Note = {...note, Text: newText, LastModified: new Date().toISOString()};

    if(newNote.Text !== note.Text || newNote.Pos !== note.Pos) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItem(newNote);

      if(data){
        setIsEditingText(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingText(false);
    }
  }

  const cancelEdit = () => {
    setNewText(note.Text);
    setIsEditingText(false);
  }

  const getTheme = () => {
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'noteContainer noteContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'noteContainer noteContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'noteContainer noteContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'noteContainer noteContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'noteContainer noteContainerNoTheme';
    }
    else{
      rtnTheme = 'noteContainer noteContainerNoTheme';
    }

    return rtnTheme + (isSelected? ' noteContainerSelected':'') + (isSelected&&isEndingPos?' noteContainerSelectedEnding':'');
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' noteTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' noteTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' noteTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' noteTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' noteTextNoTheme'
    }
    else{
      return ' noteTextBlue';
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  return (
    <div className={getTheme()}>
      {isSavingText?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingText?
          <div className='noteTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
            }
            <textarea 
              className={'noteTextArea' + getTextColor()}
              value={newText}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} 
              autoFocus></textarea>
            <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
          </div>
          :
          <div className={'noteTitle' + getTextColor()} onClick={() => {if(!isEditingPos)onChangeEditTitle()}}>{note.Text}</div>
        )
      }
    {note.Text === '' && !isEditingText && <img className='noteImage' src={process.env.PUBLIC_URL + '/note' + getTintColor() + '.png'}></img>}
    </div>
  );
}

export default WaitView;
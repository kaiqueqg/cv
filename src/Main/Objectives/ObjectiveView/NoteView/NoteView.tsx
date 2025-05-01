import { useEffect, useRef, useState } from "react";
import './NoteView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Note } from "../../../../TypesObjectives";
import Loading from "../../../../Loading/Loading";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import log from "../../../../Log/Log";
import { isEnumDeclaration } from "typescript";
import PressImage from "../../../../PressImage/PressImage";

export function noteNew(){
  return {
    Text: '',
  }
}

interface NoteViewProps extends ItemViewProps{
  note: Note,
}

export const NoteView: React.FC<NoteViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { note, putItemInDisplay, theme, isSelected, isEditingPos, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor} = props;

  const [newText, setNewText] = useState<string>(note.Text);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [isSavingText, setIsSavingTitle] = useState<boolean>(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [shouldAutoSave, setShouldAutoSave] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  }, []);

  const onChangeEditTitle = () => {
    setIsEditingText(!isEditingText);
  }

  const handleTextInputChange = (event: any) => {
    const newValue = event.target.value;
    setNewText(newValue);

    if(shouldAutoSave) {
      timerRef.current = setTimeout(async () => {
        await saveNote(newValue);
      }, 3000);
    }
  }

  const handleKeyDown = async (event: any) => {
    if(event.key === 'Enter' && event.shiftKey){
      doneEdit();
    }
    else if(event.key === 'Escape'){
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
    const newNote: Note = {...note, Text: newText.trim(), LastModified: new Date().toISOString()};

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
      setNewText(note.Text);
    }
  }

  const saveNote = async (newValue: string) => {
    console.log('Saving')
    const newNote: Note = {...note, Text: newValue.trim(), LastModified: new Date().toISOString()};

    if(newNote.Text !== note.Text || newNote.Pos !== note.Pos) {
      setIsAutoUpdating(true);

      const data = await objectiveslistApi.putObjectiveItem(newNote);

      if(data){
        setIsEditingText(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsAutoUpdating(false);
      }, 500); 
    }
  }

  const cancelEdit = () => {
    setNewText(note.Text);
    setIsEditingText(false);
  }

  return (
    <div className={'noteContainer' + itemGetTheme(theme, isSelected, isEndingPos, note.Text.trim() !== '')}>
      {isSavingText?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingText?
          <div className='noteTitleContainer'>
            <div className='sideTitleContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='centerTitleContainer'>
              <textarea 
                className={'noteTextArea' + itemTextColor(theme)}
                value={newText}
                onChange={handleTextInputChange}
                onKeyDown={handleKeyDown} 
                autoFocus></textarea>
            </div>
            <div className='sideTitleContainer'>
              {isAutoUpdating?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={()=>{setShouldAutoSave(!shouldAutoSave)}} src={process.env.PUBLIC_URL + (shouldAutoSave? ('/save' + itemTintColor(theme) + '.png'):'/save-grey.png')}/>
              }
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className={'noteTitle' + itemTextColor(theme)} onClick={() => {if(!isEditingPos)onChangeEditTitle()}}>{note.Text}</div>
        )
      }
    {note.Text === '' && !isEditingText && <img className='noteImage' src={process.env.PUBLIC_URL + '/note' + itemTintColor(theme) + '.png'}></img>}
    </div>
  );
}
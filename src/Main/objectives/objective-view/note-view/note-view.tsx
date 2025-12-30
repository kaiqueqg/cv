import { useEffect, useRef, useState } from "react";
import './note-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Note } from "../../../../TypesObjectives";
import Loading from "../../../../loading/loading";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import log from "../../../../log/log";
import { isEnumDeclaration } from "typescript";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { useThemeContext, SCSS } from "../../../../contexts/theme-context";

export function noteNew(){
  return {
    Text: '',
  }
}

interface NoteViewProps extends ItemViewProps{
  note: Note,
}

export const NoteView: React.FC<NoteViewProps> = (props) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { user, setUser } = useUserContext();
  const { scss } = useThemeContext();
  const { note, putItemsInDisplay, removeItemsInDisplay, theme, isSelecting, isSelected, isDisabled, itemTintColor} = props;


  const [tempNote, setTempNote] = useState<Note>(note);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [isSavingText, setIsSavingTitle] = useState<boolean>(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [shouldAutoSave, setShouldAutoSave] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hasTextSelection = () => {
    const selection = window.getSelection();
    return selection && selection.toString().length > 0;
  };

  const onChangeEditTitle = () => {
    setIsEditingText(!isEditingText);
  }

  const handleTextInputChange = (event: any) => {
    const newValue = {...tempNote, Text: event.target.value}
    setTempNote(newValue);

    // if(shouldAutoSave) {
    //   timerRef.current = setTimeout(async () => {
    //     await saveNote(newValue);
    //   }, 3000);
    // }
  }

  const handleTitleInputChange = (event: any) => {
    const newValue = {...tempNote, Title: event.target.value}
    setTempNote(newValue);
  }

  const handleTitleKeyDown = async (event: any) => {
    if(event.key === 'Enter'){
        doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const handleTextKeyDown = async (event: any) => {
    if(event.key === 'Enter' && event.shiftKey){
      doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([note]);

    if(data){
      removeItemsInDisplay([note]);
    }

    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newNote: Note = {...tempNote, Title: tempNote.Title, Text: tempNote.Text, LastModified: new Date().toISOString()};

    if(newNote.Title !== note.Title || newNote.Text !== note.Text || newNote.Pos !== note.Pos) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItems([newNote]);

      if(data){
        setIsEditingText(false);
        putItemsInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingText(false);
      setTempNote(note);
    }
  }

  // const saveNote = async (newValue: Note) => {
  //   console.log('Saving')
  //   const newNote: Note = {...note, Text: newValue.trim(), LastModified: new Date().toISOString()};

  //   if(newNote.Text !== note.Text || newNote.Pos !== note.Pos) {
  //     setIsAutoUpdating(true);

  //     const data = await objectiveslistApi.putObjectiveItems([newNote]);

  //     if(data){
  //       setIsEditingText(false);
  //       putItemsInDisplay(data);
  //     }

  //     setTimeout(() => {
  //       setIsAutoUpdating(false);
  //     }, 500); 
  //   }
  // }

  const cancelEdit = () => {
    setTempNote(note);
    setIsEditingText(false);
  }

  return (
    <div className={'noteContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], note.Text.trim() !== '', isSelecting, isSelected)}>
      {isSavingText?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingText?
          <div className='noteTitleContainer'>
            <div className='sideTitleContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage/>
              }
            </div>
            <div className='centerTitleContainer'>
              <input
                className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
                type='text'
                placeholder='Title'
                value={tempNote.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleKeyDown} autoFocus></input>
              <textarea 
                className={'noteTextArea' + scss(theme, [SCSS.TEXT, SCSS.BORDERCOLOR_CONTRAST])}
                value={tempNote.Text}
                onChange={handleTextInputChange}
                onKeyDown={handleTextKeyDown} 
                ></textarea>
            </div>
            <div className='sideTitleContainer'>
              {isAutoUpdating?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={()=>{setShouldAutoSave(!shouldAutoSave)}} src={process.env.PUBLIC_URL + (shouldAutoSave? ('/save' + itemTintColor(theme) + '.png'):'/save-grey.png')}/>
              }
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} rawImage/>
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} rawImage/>
            </div>
          </div>
          :
          <div className="noteDisplayContainer">
            {note.Title.trim() !== '' && <div className={'noteTitle ' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled && !hasTextSelection())onChangeEditTitle()}}>{note.Title}</div>}
            <div 
              className={'noteText' + scss(theme, [SCSS.TEXT])}
              onClick={() => {if(!isDisabled && !hasTextSelection())onChangeEditTitle()}}>{note.Text}</div>
          </div>
        )
      }
    {note.Text === '' && !isEditingText && <PressImage src={process.env.PUBLIC_URL + '/note' + itemTintColor(theme) + '.png'}></PressImage>}
    </div>
  );
}
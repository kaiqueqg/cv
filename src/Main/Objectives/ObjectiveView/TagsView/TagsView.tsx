import { useEffect, useState } from "react";
import './TagsView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import log from "../../../../Log/Log";
import Loading from "../../../../Loading/Loading";


interface TagsViewProps{
  tags: string[],
  theme: string,
  doneEditTags: (newTags:string[]) => void,
  cancelEditTags: ()=>void,
}

const TagsView: React.FC<TagsViewProps> = (props) => {
  const { tags, theme, doneEditTags, cancelEditTags } = props;

  const [newTag, setNewTag] = useState<string>('');
  const [newTags, setNewTags] = useState<string[]>([...tags]);
  const [tagBeingHover, setTagBeingHover] = useState<string>('');

  useEffect(()=>{
    setNewTags(tags);
  },[])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      doneEditTags(newTags);
    } else if (event.key === 'Enter') {
        if(newTag.trim() !== ''){
          setNewTags((prevTags) => [...prevTags, newTag.trim()]);
          setNewTag('');
        }
    } else if (event.key === 'Escape') {
        cancelEditTags();
    }
  }

  const removeTag = (tag:string) => {
    setNewTags((prevTags) => prevTags.filter((t) => t !== tag));
  }

  const getInputColor = () => {
    if(theme === 'blue'){
      return 'tagInput tagInputBlue'
    }
    else if(theme === 'red'){
      return 'tagInput tagInputRed'
    }
    else if(theme === 'green'){
      return 'tagInput tagInputGreen'
    }
    else if(theme === 'white'){
      return 'tagInput tagInputWhite'
    }
    else if(theme === 'cyan'){
      return 'tagInput tagInputCyan'
    }
    else if(theme === 'pink'){
      return 'tagInput tagInputPink'
    }
    else if(theme === 'noTheme'){
      return 'tagInput tagInputNoTheme'
    }
    else{
      return 'tagInput tagInputNoTheme';
    }
  }

  const getTintColor = () => {
    if(theme === 'white')
      return '-black';
    else
      return '';
  }

  const getTheme = () => {
    if(theme === 'blue'){
      return 'tagContainer tagBlue';
    }
    else if(theme === 'red'){
      return 'tagContainer tagRed';
    }
    else if(theme === 'green'){
      return 'tagContainer tagGreen';
    }
    else if(theme === 'white'){
      return 'tagContainer tagWhite';
    }
    else if(theme === 'cyan'){
      return 'tagContainer tagCyan';
    }
    else if(theme === 'pink'){
      return 'tagContainer tagPink';
    }
    else if(theme === 'noTheme'){
      return 'tagContainer tagNoTheme';
    }
  }

  const getTagsView = (tag: string, isBeingHover: boolean):React.ReactNode => {
    return (
      <div key={'tagview'+tag} className={getTheme()} onClick={()=>{removeTag(tag)}}>{tag}</div>
    )
  }

  return (
    <div className={'tagsContainer'}>
      <div className='tagsInputLine'>
        <input
          className={getInputColor()}
          type='text'
          value={newTag}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} autoFocus>
        </input>
        <img className='tagInputImage' onClick={()=>{doneEditTags(newTags)}} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
        <img className='tagInputImage' onClick={()=>{setNewTag(''); cancelEditTags();}} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
      </div>
      <div className={'tagsList'}>
        {newTags.map((tag)=>{ return getTagsView(tag, tag===tagBeingHover)})}
      </div>
    </div>
  );
}

export default TagsView;
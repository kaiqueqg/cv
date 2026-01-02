import { useEffect, useState } from "react";
import './tags-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { SCSS, useThemeContext } from "../../../../contexts/theme-context";
import log from "../../../../log/log";
import Loading from "../../../../loading/loading";
import PressImage from "../../../../press-image/press-image";


interface TagsViewProps{
  tags: string[],
  theme: string,
  doneEditTags: (newTags:string[]) => void,
  cancelEditTags: ()=>void,
}

const TagsView: React.FC<TagsViewProps> = (props) => {
  const { tags, theme, doneEditTags, cancelEditTags } = props;
  const { availableTags } = useUserContext();
  const { scss } = useThemeContext();

  const [newTag, setNewTag] = useState<string>('');
  const [newTags, setNewTags] = useState<string[]>([...tags]);
  const [availableTagsFiltered, setAvailableTagsFiltered] = useState<string[]>([]);
  const [tagBeingHover, setTagBeingHover] = useState<string>('');

  useEffect(()=>{
    setAvailableTagsFiltered(getAvailableTagsFiltered());
    setNewTags(tags);
  },[]);

  useEffect(() => {
    setAvailableTagsFiltered(getAvailableTagsFiltered());
  }, [newTags, availableTags])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      doneEditTags(newTags);
    } 
    else if (event.key === 'Enter'){
      if(newTag.trim() !== '' && !newTags.includes(newTag.trim())){
        setNewTags((prevTags) => [...prevTags, newTag.trim()]);
      }
      setNewTag('');
    } else if (event.key === 'Escape') {
        cancelEditTags();
    }
  }

  const removeTag = (tag:string) => {
    setNewTags((prevTags) => prevTags.filter((t) => t !== tag));
  }

  const addAvailableTag = (tag: string) => {
    if(tag.trim() !== '' && !newTags.includes(tag.trim())){
      setNewTags((prevTags) => [...prevTags, tag.trim()]);
    }
  }

  const getTintColor = () => {
    if(theme === 'white')
      return '-black';
    else
      return '';
  }

  const getAvailableTagView = (tag: string) => {
    if(newTags.includes(tag)) return;
    let style = 'tagContainer box-effect' + scss(theme, [SCSS.TEXT, SCSS.OBJ_BG]) + scss(theme, [SCSS.BORDERCOLOR_CONTRAST]);

    return (
      <div key={`includedtagview-${tag}`} className={style} onClick={()=>{addAvailableTag(tag)}}>{tag}</div>
    )
  }

  const getTagsView = (tag: string):React.ReactNode => {
    let style = '';
    if(tags.includes(tag)) style+= 'tagContainer box-effect ' + scss(theme, [SCSS.TEXT, SCSS.OBJ_BG]) + scss(theme, [SCSS.BORDERCOLOR_CONTRAST]);
    else style += 'tagContainerToSave' + scss(theme, [SCSS.TEXT_ALERT]) + scss(theme, [SCSS.BORDERCOLOR_ALERT]);
    return (
      <div key={`tagview-${tag}`} className={style} onClick={()=>{removeTag(tag)}}>{tag}</div>
    )
  }

  const getAvailableTagsFiltered = (): string[] => {
    return availableTags.filter((i) => !newTags.includes(i));
  }

  return (
    <div className={'tagsContainer ' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST])}>
      <div className={'tagAvailableTagsTitle'+ scss(theme, [SCSS.TEXT])}>AVAILABLE</div>
      <div className={'tagsList'}>
        {availableTagsFiltered.map((tag)=>{ return getAvailableTagView(tag)})}
      </div>
      <div className={'tagAvailableTagsTitle' + scss(theme, [SCSS.TEXT])}>NEW</div>
      <div className='tagsInputLine'>
        <input
          className={'tagInput'+ scss(theme, [SCSS.INPUT])}
          type='text'
          value={newTag}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} autoFocus>
        </input>
        <PressImage onClick={()=>{doneEditTags(newTags)}} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'} rawImage/>
        <PressImage onClick={()=>{setNewTag(''); cancelEditTags();}} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'} rawImage/>
      </div>
      <div className={'tagAvailableTagsTitle'+ scss(theme, [SCSS.TEXT])}>TAGS</div>
      <div className={'tagsList'}>
        {newTags.map((tag)=>{ return getTagsView(tag)})}
      </div>
    </div>
  );
}

export default TagsView;
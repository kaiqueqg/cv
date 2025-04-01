import { useEffect, useRef, useState } from "react";
import './ImageView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Image, StepImportance, ImageInfo } from "../../../../TypesObjectives";
import log from "../../../../Log/Log";
import { objectiveslistApi, s3Api } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
      IsDisplaying: true,
      ItemId: '',
      ItemImage: {
        ItemId: '',
        Name: '',
        Size: 0,
        Width: 0,
        Height: 0,
        ImageFile: '',
      }
    }
  )
}


interface ImageViewProps extends ItemViewProps{
  image: Image,
}

const ImageView: React.FC<ImageViewProps> = (props) => {
  const { image, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [newImage, setNewImage] = useState<Image>(image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isSavingIsDisplaying, setIsSavingIsDisplaying] = useState<boolean>(false);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);

  const fileInputRefCamera = useRef<HTMLInputElement>(null);
  const fileInputRefGallery = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(imageFile === null){
      downloadImage();
    }
  }, [image]);

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewImage({...newImage, Title: event.target.value});
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const onChangeIsDisplaying = async () => {
    setIsSavingIsDisplaying(true);

    try {
      const newItem: Image = { ...image, IsDisplaying: !image.IsDisplaying, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        putItemInDisplay(data);
        setIsSavingIsDisplaying(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingIsDisplaying(false);
    }, 200); 
  }

  const deleteItem = async () => {
    setIsDeleting(true);
    const data = await objectiveslistApi.deleteObjectiveItem(image);

    if(data){
      setIsEditingImage(false);
      putItemInDisplay(image, true);
    }
    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newValue: Image = {
      ...newImage,
      Title: newImage.Title.trim(),
      LastModified: new Date().toISOString()
    };

    if(newValue.Title !== image.Title.trim()) {
      setIsSavingImage(true);

      const data = await objectiveslistApi.putObjectiveItem(newValue);

      if(data){
        setIsEditingImage(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingImage(false);
      }, 200); 
    }

    setIsEditingImage(false);
  }

  const cancelEdit = () => {
    setNewImage(image);
    setIsEditingImage(false);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const result:boolean = await uploadImage(file);
      if(result){

        setImageFile(file);
       
        const newValue: Image = {...newImage, Name: file.name, Size: file.size, LastModified: new Date().toISOString()};
        const data = await objectiveslistApi.putObjectiveItem(newValue);

        if(data){
          putItemInDisplay(data);
        }
      }
      else{
        log.pop('Error uploading image');
      }

      
    } else {
      alert('Please select an image file');
    }
  };

  const uploadImage = async (file: File): Promise<boolean> => {
    setIsUploadingImage(true);
    try {
      if(file && file.name && file.type){
        const returnUpload = await s3Api.sendImage(image.ItemId, file);

        setTimeout(() => {
          setIsUploadingImage(false);
        }, 200);
        return returnUpload;
      } 
    }
    catch (err) {
      setIsUploadingImage(false);
      return false;
    }
    setIsUploadingImage(false);
    return false;
  }

  const downloadImage = async () => {
    setIsDownloadingImage(true);
    try {
      if(image.Name){ 
        const downloadFile = await s3Api.getImage({itemId: image.ItemId, fileName: image.Name, fileType: 'image/jpeg'});

        if(downloadFile){
          setImageFile(downloadFile);

          setTimeout(() => {
            setIsDownloadingImage(false);
          }, 200); 
        }
      }
    }
    catch (err) {
      setIsDownloadingImage(false);
    } 
    
    setTimeout(() => {
      setIsDownloadingImage(false);
    }, 200); 
  }

  const saveImage = async () => {
    if(!imageFile) return;

    try {
      // Create a temporary link to download the image
      const url = URL.createObjectURL(imageFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageFile.name || 'downloaded-image.jpg'; // Provide a default name if unavailable
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      URL.revokeObjectURL(url); // Free up the object URL memory
    } catch (err) {
      log.err("Failed to save image: " + JSON.stringify(err));
    }
  }

  const deleteImage = async () => {
    setIsDeletingImage(true);
    try {
      if(imageFile){
        const result = await s3Api.deleteImage(image.ItemId, imageFile);

        if(result){
          const newValue: Image = {...newImage, Name: '', Size: 0, LastModified: new Date().toISOString()};
          const data = await objectiveslistApi.putObjectiveItem(newValue);

          if(data){
            putItemInDisplay(data);
            setImageFile(null);
          }
        }
      }
    }
    catch (err) {
      setIsDeletingImage(false);
    } 
    setIsDeletingImage(false);
  }

  const getTheme = () => {
    let rtnTheme = 'imageContainer';

    if(theme === 'darkBlue'){
      rtnTheme += ' imageContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme += ' imageContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme += ' imageContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme += ' imageContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme += ' imageContainerNoTheme';
    }
    else{
      rtnTheme += ' imageContainerNoTheme';
    }

    if(isSelected) rtnTheme += ' imageContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' imageContainerSelectedEnding';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' imageTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' imageTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' imageTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' imageTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' imageTextNoTheme'
    }
    else{
      return ' imageTextBlue';
    }
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'imageInputBlue imageTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'imageInputRed imageTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'imageInputGreen imageTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'imageInputWhite imageTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'imageInputNoTheme imageTextNoTheme'
    }
    else{
      v+= 'imageInputNoTheme imageTextNoTheme';
    }

    return 'imageInput ' + v;
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' imageTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' imageTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' imageTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' imageTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' imageTextFadeNoTheme'
    }
    else{
      return ' imageTextFadeBlue';
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
      {isSavingImage?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingImage ?
          <div className='inputsContainer'>
            <div className='imageSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
            </div>
            <div className='imageCenterContainer'>
              <div className='imageInfoContainer'>
                <input
                  className={getInputColor()}
                  type='text'
                  placeholder='Title'
                  value={newImage.Title}
                  onChange={handleTextInputChange}
                  onKeyDown={handleKeyDown} autoFocus>
                </input>
                {imageFile && <img className='inputImage' onClick={saveImage} src={process.env.PUBLIC_URL + '/save'+getTintColor()+'.png'}></img>}
                {(image.Name !== '') && <img className='inputImage' onClick={downloadImage} src={process.env.PUBLIC_URL + '/download'+getTintColor()+'.png'}></img>}
                {!imageFile && 
                (isUploadingImage?
                  <Loading IsBlack={theme==='darkWhite'}></Loading>
                  :
                  <>
                    <img className='inputImage' onClick={() => fileInputRefCamera.current?.click()} src={process.env.PUBLIC_URL + '/camera' + getTintColor() + '.png'}></img>
                    <img className='inputImage' onClick={() => fileInputRefGallery.current?.click()} src={process.env.PUBLIC_URL + '/upload' + getTintColor() + '.png'}></img>
                  </>
                )}
                
                {imageFile && 
                  (isDeletingImage?
                    <Loading IsBlack={theme==='darkWhite'}></Loading>
                    :
                    <img className='inputImage' onClick={deleteImage} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>)
                }
              </div>
              {imageFile && 
                (isDownloadingImage?
                  <Loading IsBlack={theme==='darkWhite'}></Loading>
                  :
                  <img className={'previewImage'} src={URL.createObjectURL(imageFile)} alt="Preview" />
                )}
            </div>
            <div className='imageSideContainer'>
              <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
              <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            </div>
          </div>
          :
          <div className={'imageDisplayContainer'}>
            <div className='imageDisplayTitleContainer'>
              <div className={'imageTitle ' + getTextColor()} onClick={() => {if(!isEditingPos)setIsEditingImage(!isEditingImage);}}>{image.Title}</div>
              {imageFile && <img className='inputImage' onClick={saveImage} src={process.env.PUBLIC_URL + '/save'+getTintColor()+'.png'}></img>}
              {isSavingIsDisplaying?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='imageImage' onClick={() => {if(!isEditingPos)onChangeIsDisplaying()}} src={process.env.PUBLIC_URL + '/image' + ((imageFile)?'-filled':'') + (image.IsDisplaying?getTintColor():'-grey') + '.png'}></img>
              }
            </div>
            <div className='previewImageContainer'>
              {image.IsDisplaying && imageFile &&
                (isDownloadingImage?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className={'previewImage'} src={URL.createObjectURL(imageFile)} onClick={() => {if(!isEditingPos)setIsEditingImage(!isEditingImage);}} alt="Preview" />
              )}
            </div>
          </div>
        )
      }
      <input
        ref={fileInputRefCamera}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRefGallery}
        type="file"
        capture="environment"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageView;
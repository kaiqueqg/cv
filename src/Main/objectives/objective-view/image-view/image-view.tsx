import { useEffect, useRef, useState } from "react";
import './image-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Image, StepImportance, ImageInfo } from "../../../../TypesObjectives";
import log from "../../../../log/log";
// import { objectiveslistApi, s3Api } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import PressImage from "../../../../press-image/press-image";
import { isEditable } from "@testing-library/user-event/dist/utils";
import { useRequestContext } from "../../../../contexts/request-context";
import { useThemeContext, SCSS } from "../../../../contexts/theme-context";

export function imageNew(){
  return {
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
}

interface ImageViewProps extends ItemViewProps{
  image: Image,
}

export const ImageView: React.FC<ImageViewProps> = (props) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { scss } = useThemeContext();
  const { image, theme, putItemsInDisplay, removeItemsInDisplay, isDisabled, isSelecting, isSelected, itemTintColor } = props;

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

      putItemsInDisplay([newItem]);

      const data = await objectiveslistApi.putObjectiveItems([newItem]);

      if(data){
        setIsSavingIsDisplaying(false);
      }
    } catch (err) {
      putItemsInDisplay([image]);
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingIsDisplaying(false);
    }, 200); 
  }

  const deleteItem = async () => {
    setIsDeleting(true);
    const data = await objectiveslistApi.deleteObjectiveItems([image]);

    if(data){
      setIsEditingImage(false);
      removeItemsInDisplay([image]);
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

      const data = await objectiveslistApi.putObjectiveItems([newValue]);

      if(data){
        setIsEditingImage(false);
        putItemsInDisplay(data);
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
        const data = await objectiveslistApi.putObjectiveItems([newValue]);

        if(data){
          putItemsInDisplay(data);
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
          const data = await objectiveslistApi.putObjectiveItems([newValue]);

          if(data){
            putItemsInDisplay(data);
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

  return (
    <div className={'imageContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], false, isSelecting, isSelected)}>
      {isSavingImage?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingImage ?
          <div className='inputsContainer'>
            <div className='imageSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage/>
              }
            </div>
            <div className='imageCenterContainer'>
              <div className='imageInfoContainer'>
                <input
                  className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
                  type='text'
                  placeholder='Title'
                  value={newImage.Title}
                  onChange={handleTextInputChange}
                  onKeyDown={handleKeyDown} autoFocus>
                </input>
                {imageFile && <img className='inputImage' onClick={saveImage} src={process.env.PUBLIC_URL + '/save'+itemTintColor(theme)+'.png'}></img>}
                {(image.Name !== '') && <img className='inputImage' onClick={downloadImage} src={process.env.PUBLIC_URL + '/download'+itemTintColor(theme)+'.png'}></img>}
                {!imageFile && 
                (isUploadingImage?
                  <Loading IsBlack={theme==='white'}></Loading>
                  :
                  <>
                    <img className='inputImage' onClick={() => fileInputRefCamera.current?.click()} src={process.env.PUBLIC_URL + '/camera' + itemTintColor(theme) + '.png'}></img>
                    <img className='inputImage' onClick={() => fileInputRefGallery.current?.click()} src={process.env.PUBLIC_URL + '/upload' + itemTintColor(theme) + '.png'}></img>
                  </>
                )}
                
                {imageFile && 
                  (isDeletingImage?
                    <Loading IsBlack={theme==='white'}></Loading>
                    :
                    <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage/>
                  )
                }
              </div>
              {imageFile && 
                (isDownloadingImage?
                  <Loading IsBlack={theme==='white'}></Loading>
                  :
                  <img className={'previewImage'} src={URL.createObjectURL(imageFile)} alt="Preview" />
                )}
            </div>
            <div className='imageSideContainer'>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} rawImage/>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} rawImage/>
            </div>
          </div>
          :
          <div className={'imageDisplayContainer'}>
            <div className='imageDisplayTitleContainer'>
              <div className={'imageTitle ' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingImage(!isEditingImage);}}>{image.Title}</div>
              {isSavingIsDisplaying?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <img className='imageImage' onClick={() => {if(!isDisabled)onChangeIsDisplaying()}} src={process.env.PUBLIC_URL + '/image' + ((imageFile)?'-filled':'') + (image.IsDisplaying?itemTintColor(theme):'-grey') + '.png'}></img>
              }
            </div>
            <div className='previewImageContainer'>
              {image.IsDisplaying && imageFile &&
                (isDownloadingImage?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <img className={'previewImage'} src={URL.createObjectURL(imageFile)} onClick={() => {if(!isDisabled)setIsEditingImage(!isEditingImage);}} alt="Preview" />
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
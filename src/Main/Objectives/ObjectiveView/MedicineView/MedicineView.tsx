import { useEffect, useState } from "react";
import './MedicineView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Medicine, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";

interface MedicineViewProps extends ItemViewProps{
  medicine: Medicine,
}

const MedicineView: React.FC<MedicineViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { medicine, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [newMedicine, setNewMedicine] = useState<Medicine>(medicine);
  const [isEditingMedicine, setIsEditingMedicine] = useState<boolean>(false);
  
  const [isSavingMedicine, setIsSavingMedicine] = useState<boolean>(false);
  const [isSavingIsChecked, setIsSavingIsChecked] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, [medicine]);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedicine({...newMedicine, Title: event.target.value});
  }
  const handleQuantityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedicine({...newMedicine, Quantity: Number(event.target.value)});
  }
  const handleUnitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedicine({...newMedicine, Unit: event.target.value});
  }
  const handlePurposeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMedicine({...newMedicine, Purpose: event.target.value});
  }

  const onEditMedicine = () => {
    if(!isEditingPos)setIsEditingMedicine(!isEditingMedicine);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditMedicine();
    }
    else if(event.key === 'Escape'){
      cancelEditMedicine();
    }
  }

  const onChangeIsChecked = async () => {
    setIsSavingIsChecked(true);

    try {
      const newItem: Medicine = { ...medicine, IsChecked: !medicine.IsChecked, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsSavingIsChecked(false);
        putItemInDisplay(data);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingIsChecked(false);
  }

  const doneEditMedicine = async () => {
    setIsSavingMedicine(true);
    const newItem: Medicine = {
      ...newMedicine,
      Title: newMedicine.Title.trim(),
      Unit: newMedicine.Unit?.trim(),
      Purpose: newMedicine.Purpose?.trim(),
      LastModified: new Date().toISOString()
    };

    if(newMedicine.Title !== medicine.Title.trim()
      || newItem.Quantity !== medicine.Quantity
      || newItem.Unit !== medicine.Unit?.trim()
      || newItem.Pos !== medicine.Pos
      || newItem.Purpose !== medicine.Purpose?.trim()) {
      setIsEditingMedicine(true);

      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsEditingMedicine(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingMedicine(false);
      }, 200); 
    }
    else{
      setIsEditingMedicine(false);
      setNewMedicine(medicine);
    }

    setIsSavingMedicine(false);
  }

  const cancelEditMedicine = () => {
    setNewMedicine(medicine);
    setIsEditingMedicine(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(medicine);

    if(data){
      putItemInDisplay(medicine, true);
    }

    setIsDeleting(false);
  }

  const getTheme = () => {
    let rtnTheme = 'medicineContainer';
    
    if(medicine.IsChecked){
      rtnTheme += ' medicineContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' medicineContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' medicineContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' medicineContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' medicineContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' medicineContainerNoTheme';
      }
      else{
        rtnTheme += ' medicineContainerNoTheme';
      }
    }

    if(isSelected) rtnTheme += ' medicineContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' medicineContainerSelectedEnding';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' medicineTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' medicineTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' medicineTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' medicineTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' medicineTextNoTheme'
    }
    else{
      return ' medicineTextBlue';
    }
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' medicineTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' medicineTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' medicineTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' medicineTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' medicineTextFadeNoTheme'
    }
    else{
      return ' medicineTextFadeBlue';
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
      v+= 'medicineInputBlue medicineTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'medicineInputRed medicineTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'medicineInputGreen medicineTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'medicineInputWhite medicineTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'medicineInputNoTheme medicineTextNoTheme'
    }
    else{
      v+= 'medicineInputNoTheme medicineTextNoTheme';
    }

    return 'medicineInput ' + v;
  }

  const getDisplayText = () => {
    let rtn = '';
    if(medicine.Quantity && medicine.Quantity > 1) rtn += medicine.Quantity.toString()+'x ';
    rtn += medicine.Title;

    return rtn;
  }

  return (
    <div className={getTheme()}>
      {isSavingMedicine?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingMedicine?
          <div className='inputsContainer'>
            <div className='inputLeft'>
              <input 
                className={getInputColor()}
                type='text'
                value={newMedicine.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={getInputColor()}
                type='number'
                value={newMedicine.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newMedicine.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newMedicine.Purpose?? ''}
                onChange={handlePurposeInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Purpose"></input>
            </div>
            <div className='inputRight'>
              <img className='inputImage' onClick={doneEditMedicine} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
              <img className='inputImage' onClick={cancelEditMedicine} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
            </div>
          </div>
          :
          <div className={'medicineDisplayContainer'}>
            <div className='medicineLine' onClick={onEditMedicine}>
              <div className={'medicineText' + (medicine.IsChecked? getTextFadeColor():getTextColor())}> {getDisplayText()}</div>
              {medicine.Unit && <div className={'medicineText' + (medicine.IsChecked? getTextFadeColor():getTextColor())}>{medicine.Unit}</div>}
              {medicine.Purpose && <div className={'medicineText ' + getTextFadeColor()}>{'('+medicine.Purpose+')'}</div>}
            </div>
            {!isEditingMedicine &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                (medicine.IsChecked?
                  <img className='medicineImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine-filled-grey.png'}></img>
                  :
                  <img className='medicineImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine' + getTintColor() + '.png'}></img>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default MedicineView;
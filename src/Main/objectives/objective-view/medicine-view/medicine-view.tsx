import { useEffect, useState } from "react";
import './medicine-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Medicine, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";

export function medicineNew(){
  return {
    Title: '',
    Purpose: '',
    IsChecked: false,
    Quantity: 0,
    Unit: '',
    Components: [],
  }
}

interface MedicineViewProps extends ItemViewProps{
  medicine: Medicine,
}

export const MedicineView: React.FC<MedicineViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { medicine, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

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
      putItemInDisplay(newItem);
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsSavingIsChecked(false);
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

  const getDisplayText = () => {
    let rtn = '';
    if(medicine.Quantity && medicine.Quantity > 1) rtn += medicine.Quantity.toString()+'x ';
    rtn += medicine.Title;

    return rtn;
  }

  return (
    <div className={'medicineContainer' + itemGetTheme(theme, isSelected, isEndingPos, medicine.IsChecked)}>
      {isSavingMedicine?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingMedicine?
          <div className='inputsContainer'>
            <div className='medicineSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='medicineCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newMedicine.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={itemInputColor(theme)}
                type='number'
                value={newMedicine.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newMedicine.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newMedicine.Purpose?? ''}
                onChange={handlePurposeInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Purpose"></input>
            </div>
            <div className='medicineSideContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEditMedicine} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEditMedicine} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className={'medicineDisplayContainer'}>
            <div className='medicineLine' onClick={onEditMedicine}>
              <div className={'medicineText' + itemTextColor(theme, medicine.IsChecked)}> {getDisplayText()}</div>
              {medicine.Unit && <div className={'medicineText' + itemTextColor(theme, medicine.IsChecked)}>{medicine.Unit}</div>}
              {medicine.Purpose && <div className={'medicineText ' + itemTextColor(theme, true)}>{'('+medicine.Purpose+')'}</div>}
            </div>
            {!isEditingMedicine &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                (medicine.IsChecked?
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine-filled-grey.png'}/>
                  :
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine' + itemTintColor(theme) + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}
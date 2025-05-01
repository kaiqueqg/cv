import { useEffect, useState } from "react";
import './MedicineView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Medicine, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";
import PressImage from "../../../../PressImage/PressImage";

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

  const getDisplayText = () => {
    let rtn = '';
    if(medicine.Quantity && medicine.Quantity > 1) rtn += medicine.Quantity.toString()+'x ';
    rtn += medicine.Title;

    return rtn;
  }

  return (
    <div className={'medicineContainer' + itemGetTheme(theme, isSelected, isEndingPos, medicine.IsChecked)}>
      {isSavingMedicine?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingMedicine?
          <div className='inputsContainer'>
            <div className='medicineSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
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
              <PressImage onClick={doneEditMedicine} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={cancelEditMedicine} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
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
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                (medicine.IsChecked?
                  <PressImage onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine-filled-grey.png'}/>
                  :
                  <PressImage onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/medicine' + itemTintColor(theme) + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}
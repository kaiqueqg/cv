import React, { useEffect, useState } from 'react';
import './request-user-view.scss'
import Loading from '../../../loading/loading';
import { local } from '../../../storage/storage';
import { CreateUserModel } from '../../../Types';
import { useRequestContext } from '../../../contexts/request-context';
import { useUserContext } from '../../../contexts/user-context';
interface RequestUserViewProps {
  setIsLogged: (value: boolean) => void,
}

const RequestUserView: React.FC<RequestUserViewProps> = ({setIsLogged, }) => {
  const { identityApi } = useRequestContext();
  const { setUser } = useUserContext();
  
  const [typeAnEmailCreate, setTypeAnEmailCreate] = useState<boolean>(false);
  const [typeAnValidEmailCreate, setTypeAnValidEmailCreate] = useState<boolean>(false);
  const [typeAnPasswordCreate, setTypeAnPasswordCreate] = useState<boolean>(false);
  const [typeAnUsernameCreate, setTypeAnUsernameCreate] = useState<boolean>(false);
  const [typeReasonCreate, setTypeReasonCreate] = useState<boolean>(false);
  
  const [username, setUsername] = useState<string>('');
  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [isCreatingNewUser, setIsCreatingNewUser] = useState<boolean>(false);

  function isValidEmail(input: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(input);
  }

  const createLogin = async () => {
    if(createEmail.trim() === "" ||!isValidEmail(createEmail.trim()) || username.trim() === "" || createPassword.trim() === ""|| reason.trim() === ""){
      if(createEmail.trim() === ""){
        setTypeAnEmailCreate(true);
      }else if(!isValidEmail(createEmail.trim())){
        setTypeAnValidEmailCreate(true);
      }
      if(username.trim() === ""){
        setTypeAnUsernameCreate(true);
      }
      if(createPassword.trim() === ""){
        setTypeAnPasswordCreate(true);
      }
      if(reason.trim() === ""){
        setTypeReasonCreate(true);
      }

      return;
    }

    const createUser: CreateUserModel = {
      Email: createEmail.trim(),
      Password: createPassword.trim(),
      Username: username,
      Reason: reason,
    };

    try {
      setIsCreatingNewUser(true);
      const data = await identityApi.askToCreate(JSON.stringify(createUser));

      
      if(data){
        local.setToken(data.Token);
        local.setUser(data.User);
        local.setFirstLogin(true);
        setUser(data.User);
        setIsLogged(true);
      }
    } catch (error) {
      setIsCreatingNewUser(false);
    }

    setIsCreatingNewUser(false);
  }

  const changeCreateEmail = (event: any) => {
    setTypeAnEmailCreate(false);
    setTypeAnValidEmailCreate(false);
    setCreateEmail(event.target.value);
  }
  
  const changeUsername = (event: any) => {
    setTypeAnUsernameCreate(false);
    setUsername(event.target.value);
  }
  
  const changeCreatePaswword = (event: any) => {
    setTypeAnPasswordCreate(false);
    setCreatePassword(event.target.value);
  }
  
  const changeReason = (event: any) => {
    setTypeReasonCreate(false);
    setReason(event.target.value);
  }

  const reasonEnter = (event: any) => {
    if(event.key === 'Enter'){
      createLogin();
    }
  }

  return (
    <div className=" login-box">
      <div style={{width: '100%', height:'1px', margin: '40px 0px', backgroundColor: 'black'}}></div>
      <h3 style={{margin: '40px 0px 30px 0px'}}>Do you want to test my project?</h3>
      <div className="login-row">
          <input className="input-base" type="text" onChange={changeCreateEmail} placeholder="Email" aria-label="Email"></input>
          {typeAnEmailCreate && <span className="alert-message concert-one-regular">Type an email.</span>}
          {typeAnValidEmailCreate && <span className="alert-message concert-one-regular">Type in a valid email style.</span>}
      </div>
      <div className="login-row">
          <input className="input-base" type="text" onChange={changeUsername} placeholder="Username" aria-label="Username"></input>
          {typeAnUsernameCreate && <span className="alert-message concert-one-regular">Type an username.</span>}
      </div>
      <div className="login-row">
          <input className="input-base"  type="password" onChange={changeCreatePaswword} placeholder="Password" aria-label="Server"></input>
          {typeAnPasswordCreate && <span className="alert-message concert-one-regular">Type an password.</span>}
      </div>
      <div className="login-row">
          <input className="input-base"  type="text" onChange={changeReason} onKeyUp={reasonEnter} placeholder="Reason" aria-label="Server"></input>
          {typeReasonCreate ?
          <span className="alert-message concert-one-regular">Write something, otherwise I'll refuse."</span>
          :
          <span className="focus-message concert-one-regular">e.g. "I saw your CV and want to test your project. I'm a recruter."</span>
          }
      </div>
      <div className="login-row">
          {isCreatingNewUser?
          <Loading></Loading>
          :
          <button className="btn-base btn-create" type="button" onClick={createLogin}>Send it</button>
          }
      </div>
    </div>
  );
};

export default RequestUserView;
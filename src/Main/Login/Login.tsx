import React, { useEffect, useState } from 'react';
import './Login.scss'
import { CreateUserModel, ResponseUser, MenuOption, Response } from '../../Types'
import Loading from '../../Loading/Loading';
import { useUserContext } from '../../Contexts/UserContext';
import storage from '../../Storage/Storage';
import log from '../../Log/Log';
import { identityApi } from '../../Requests/RequestFactory';
import { useNavigate } from 'react-router-dom';
import UserView from './UserView/UserView';

interface LoginProps{
}

const Login: React.FC<LoginProps> = (props) => {
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');

  const [typeAnEmail, setTypeAnEmail] = useState<boolean>(false);
  const [typeAnValidEmail, setTypeAnValidEmail] = useState<boolean>(false);
  const [typeAnPassword, setTypeAnPassword] = useState<boolean>(false);

  const [typeAnEmailCreate, setTypeAnEmailCreate] = useState<boolean>(false);
  const [typeAnValidEmailCreate, setTypeAnValidEmailCreate] = useState<boolean>(false);
  const [typeAnPasswordCreate, setTypeAnPasswordCreate] = useState<boolean>(false);
  const [typeAnUsernameCreate, setTypeAnUsernameCreate] = useState<boolean>(false);
  const [typeReasonCreate, setTypeReasonCreate] = useState<boolean>(false);

  const { user, setUser, testServer, isServerUp } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    verifyLogin();

    if(user !== null && user !== undefined){
      //getUser();
    }
  }, []);
  
  const parseJwt = (token :string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const getUser = async () =>{
    try {
      setIsLogging(true);
      const response = await identityApi.getUser(undefined, () => {
        setIsLogging(false);
        testServer();
      });

      setIsLogging(false);
      if(response !== undefined && response.status == 200) {
        const responseData: ResponseUser = await response.json();
        if(responseData !== undefined){
          storage.setUser(responseData);
          setUser(responseData);
        }
      }
    } catch (error) {
    }
    setTimeout(() => {
      setIsLogging(false);
    }, 1000); 
  }

  interface LoginData { User: ResponseUser, Token: string }
  const login = async () => {
    //check username
    if(email.trim() === "" || password.trim() === ""){
      if(email.trim() === ""){
        setTypeAnEmail(true);
      }
      else if(!isValidEmail(email.trim())){
        setTypeAnValidEmail(true);
      }

      if(password.trim() === ""){
        setTypeAnPassword(true);
      }
      return;
    }

    const user = {
      Email: email,
      Password: password,
    };

    setIsLogging(true);
    try {
      const data = await identityApi.login(JSON.stringify(user), () => {testServer();});
      if(data && data.User){
        storage.setToken(data.Token);
        storage.setUser(data.User);
        setUser(data.User);
        setIsLogged(true);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsLogging(false);
  }

  const changeEmail = (event: any) => {
    setTypeAnEmail(false);
    setTypeAnValidEmail(false);
    setEmail(event.target.value);
  }
  
  const changePassword = (event: any) => {
    setTypeAnPassword(false);
    setPassword(event.target.value);
  }

  const passwordEnter = (event: any) => {
    if(event.key === 'Enter'){
      login();
    }
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

  const checkForLoginToken = () =>{
    const token = storage.getToken();

    if(token != null && token !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      return tokenDate > now;
    }

    return false;
  }

  const logout = () => {
    storage.deleteToken();
    storage.deleteUser();
    setUser(null);
    setIsLogged(false);
  }

  function isValidEmail(input: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(input);
  }

  const createLogin = async () => {
    if(createEmail.trim() === ""
      ||!isValidEmail(createEmail.trim())
      || username.trim() === ""
      || createPassword.trim() === ""
      || reason.trim() === ""){
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
      setIsLogging(true);
      const data = await identityApi.askToCreate(JSON.stringify(createUser), () => {
        testServer();
      });

      setIsLogging(false);
      
      if(data){
        storage.setToken(data.Token);
        storage.setUser(data.User);
        setUser(data.User);
        setIsLogged(true);
      }
    } catch (error) {
      setIsLogging(false);
    }
    setTimeout(() => {
      setIsLogging(false);
    }, 1000); 
  }

  //Responsable for getting token and user from storage to state
  const verifyLogin = () => {
    const token = storage.getToken();
    const user = storage.getUser();

    if(token != null && token !== undefined && user != null && user !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(parsedToken.exp === undefined || tokenDate > now){
        setUser(storage.getUser());
        setIsLogged(true);
      }
      else{
        logout();
      }
    }
  }

  return(
    <div className='login-container'>
      {isServerUp?
        (isLogging?
          <Loading/>
          :
          (!isLogged?
            <div className=''>
              <div className='login-box'>
                <h3 style={{margin: '10px 0px'}}>Login</h3>
                <div className="email-column">
                  <input className="input-base" type="text" onChange={changeEmail} placeholder="Email" aria-label="Email"></input>
                  {typeAnEmail && <span className="alert-message concert-one-regular">Type an email.</span>}
                  {typeAnValidEmail && <span className="alert-message concert-one-regular">Type a valid email.</span>}
                </div>
                <div className="pass-column">
                  <div className="pass-row">
                    {showPassword?
                      <input className="input-base" type="text" onChange={changePassword} onKeyUp={passwordEnter} placeholder="Password" aria-label="Server" ></input>
                      :
                      <input className="input-base" type="password" onChange={changePassword} onKeyUp={passwordEnter} placeholder="Password" aria-label="Server" ></input>
                    }
                    {showPassword?
                      <img className="loginImage" src={process.env.PUBLIC_URL + '/hide.png'} alt='meaningfull text' onClick={()=>{setShowPassword(false)}}></img>
                      :
                      <img className="loginImage" src={process.env.PUBLIC_URL + '/show.png'} alt='meaningfull text' onClick={()=>{setShowPassword(true)}}></img>
                    }
                  </div>
                  {typeAnPassword && <span className="alert-message concert-one-regular">Type a password.</span>}
                </div>
                <div className="login-row">
                  <button className="btn-login" type="button" onClick={login}>Login</button>
                </div>
              </div>
              {/* <div className=" login-box">
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
                  {typeAnPasswordCreate ?
                    <span className="alert-message concert-one-regular">Type an password.</span>
                    :
                    <span className="focus-message concert-one-regular">For now isn't encrypted, put something silly!</span>
                  }
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
                  <button className="btn-base btn-create" type="button" onClick={createLogin}>Send it</button>
                </div>
              </div> */}
            </div>
            :
            <UserView setIsLogged={setIsLogged}></UserView>
            )
          )
        :
        <div>Server out</div>
      }
    </div>
  );
}

export default Login
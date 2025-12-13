import React, { useEffect, useState } from 'react';
import './login.scss'
import { CreateUserModel, ResponseUser, MenuOption, Response, MessageType, TwoFactorAuthRequest } from '../../Types'
import Loading from '../../loading/loading';
import { useUserContext } from '../../contexts/user-context';
import log from '../../log/log';
import { useNavigate } from 'react-router-dom';
import UserView from './user-view/user-view';
import { useLogContext } from '../../contexts/log-context';
import { useRequestContext } from '../../contexts/request-context';
import { local, session } from '../../storage/storage';
import TwoFAView from './twofa-view/twofa-view';
import RequestUserView from './request-user-view/request-user-view';

interface LoginProps{
}

const Login: React.FC<LoginProps> = () => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { user, setUser, isServerUp } = useUserContext();
  const { popMessage } = useLogContext();
  const navigate = useNavigate();

  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [typeAnEmail, setTypeAnEmail] = useState<boolean>(false);
  const [wrongEmail, setWrongEmail] = useState<boolean>(false);
  const [typeAnValidEmail, setTypeAnValidEmail] = useState<boolean>(false);
  const [typeAnPassword, setTypeAnPassword] = useState<boolean>(false);
  const [wrongPassword, setWrongPassword] = useState<boolean>(false);

  const [requiringTwoFA, setRequiringTwoFA] = useState<boolean>(false);

  
  useEffect(() => {
    verifyLogin();
  }, []);
  
  const parseJwt = (token :string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const loginError = (response: any) => {
    if(response.Message === 'Wrong email.' || response.Message === 'Wrong password.'){
      if(response.Message === 'Wrong email.'){
        setWrongEmail(true);
        setPassword('');
      }
      if(response.Message === 'Wrong password.') {
        setWrongPassword(true);
        setPassword('');
      }
    }
    else{
      popMessage(response.Message, MessageType.Error, 10);
    }
  }

  // interface LoginData { User: ResponseUser, Token: string }
  const login = async () => {
    if(email.trim() === ""){
      setWrongEmail(false);
      setWrongPassword(false);
      setTypeAnEmail(true);
      return;
    }
    if(password.trim() === ""){
      setWrongEmail(false);
      setWrongPassword(false);
      setTypeAnPassword(true);
      return;
    }
    if(!isValidEmail(email.trim())){
      setWrongEmail(false);
      setWrongPassword(false);
      setTypeAnValidEmail(true);
      return;
    }

    const user = {
      Email: email,
      Password: password,
    };

    setPassword('');
    setIsLogging(true);
    try {
      const data = await identityApi.login(JSON.stringify(user), loginError);
      if(data){
        /// Fist require 2FA
        if(data.RequiringTwoFA){
          if(data.TwoFATempToken && data.TwoFATempToken.trim() !== ''){
            session.writeTwoFATempToken(data.TwoFATempToken);
            setRequiringTwoFA(true);
          }
          else{
            popMessage('There was a problem with requiring 2FA code.', MessageType.Error);
          }
        }
        else{
          /// Normal login, without 2FA
          if(data.User && data.Token){
            local.setToken(data.Token);
            local.setUser(data.User);
            local.setFirstLogin(true);
            setUser(data.User);
            setIsLogged(true);
          }
          else{
            popMessage('Login was ok but no data was returned.', MessageType.Error);
          }
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsLogging(false);
  }

  const changeEmail = (event: any) => {
    setTypeAnEmail(false);
    setTypeAnValidEmail(false);
    setWrongEmail(false);
    setEmail(event.target.value);
  }
  
  const changePassword = (event: any) => {
    setTypeAnPassword(false);
    setWrongPassword(false);
    setPassword(event.target.value);
  }

  const passwordEnter = (event: any) => {
    if(event.key === 'Enter'){
      login();
    }
  }

  const checkForLoginToken = () =>{
    const token = local.getToken();

    if(token != null && token !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      return tokenDate > now;
    }

    return false;
  }

  const logout = async () => {
    local.deleteToken();
    local.deleteUser();
    local.deleteAvailableTags();
    local.deleteSelectedTags();
    local.deleteFirstLogin();
    setUser(null);
    setIsLogged(false);
    setRequiringTwoFA(false);
  }

  function isValidEmail(input: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(input);
  }

  

  //Responsable for getting token and user from storage to state
  const verifyLogin = () => {
    const token = local.getToken();
    const user = local.getUser();

    if(token != null && token !== undefined && user != null && user !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(parsedToken.exp === undefined || tokenDate > now){
        setUser(local.getUser());
        setIsLogged(true);
      }
      else{
        logout();
      }
    }
  }

  return(
    <div className='login-container'>
      {!isLogged?
        <div className='login-wrapper'>
          {requiringTwoFA?
            <TwoFAView setIsLogged={setIsLogged} logout={logout}></TwoFAView>
            :
            <div className='login-box'>
              <div className="email-column">
                <div className="pass-row">
                  <input name='email'  className="input-base" type="email" onChange={changeEmail} placeholder="Email" aria-label="Email" value={email}></input>
                  {typeAnEmail && <span className="warning-message concert-one-regular">Type an email</span>}
                  {typeAnValidEmail && <span className="warning-message concert-one-regular">Type a valid email</span>}
                  {wrongEmail && <span className="alert-message concert-one-regular">Wrong email</span>}
                </div>
              </div>
              <div className="pass-column">
                <div className="pass-row">
                  {showPassword?
                    <input className="input-base" type="text" onChange={changePassword} onKeyUp={passwordEnter} placeholder="Password" aria-label="Server" value={password}></input>
                    :
                    <input className="input-base" type="password" onChange={changePassword} onKeyUp={passwordEnter} placeholder="Password" aria-label="Server" value={password}></input>
                  }
                  {showPassword?
                    <img className="loginImage" src={process.env.PUBLIC_URL + '/hide.png'} alt='meaningfull text' onClick={()=>{setShowPassword(false)}}></img>
                    :
                    <img className="loginImage" src={process.env.PUBLIC_URL + '/show.png'} alt='meaningfull text' onClick={()=>{setShowPassword(true)}}></img>
                  }
                </div>
                {typeAnPassword && <span className="warning-message concert-one-regular">Type a password</span>}
                {wrongPassword && <span className="alert-message concert-one-regular">Wrong password</span>}
              </div>
              <div className="login-row">
                {isLogging?
                  <Loading/>
                  :
                  <button className="btn-login" type="button" onClick={login}>Login</button>
                }
              </div>
            </div>
          }
          {/* <RequestUserView setIsLogged={setIsLogged}></RequestUserView> */}
        </div>
        :
        <UserView setIsLogged={setIsLogged} logout={logout}></UserView>
      }
    </div>
  );
}

export default Login
import { useUserContext } from "../../../contexts/user-context";
import {local, session} from "../../../storage/storage";
import { useNavigate } from 'react-router-dom';
import './user-view.scss';
import { useEffect, useState } from "react";
import { ResponseUser, Response, ResponseServices, MessageType, TwoFactorAuthRequest } from "../../../Types";
import log from "../../../log/log";
import Loading from "../../../loading/loading";
import { useRequestContext } from "../../../contexts/request-context";
import { useLogContext } from "../../../contexts/log-context";
const QRCode = require("qrcode");

interface UserViewProps{
  setIsLogged: (value: boolean) => void,
  logout: () => void,
}

const UserView: React.FC<UserViewProps> = ({setIsLogged, logout}) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { user, setUser } = useUserContext();
  const { 
    popMessage,
    // randomId
  } = useLogContext();
  const navigate = useNavigate();
  const [userList, setUserList] = useState<ResponseUser[]>([]);
  const [identityServiceStatus, setIdentityServiceStatus] = useState<ResponseServices>();
  const [isGettingUserInfo, setIsGettingUserInfo] = useState<boolean>(false);
  const [isGettingUserList, setIsGettingUserList] = useState<boolean>(false);
  const [isGettingServicesList, setIsGettingServicesList] = useState<boolean>(false);
  
  const [emailChangePassword, setEmailChangePassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowingChangePass, setIsShowingChangePass] = useState<boolean>(false);
  
  //2FA QR CODE
  const [twoFAQRCode, setTwoFAQRCode] = useState<string>('');
  const [isGettingQRCode, setIsGettingQRCode] = useState<boolean>(false);

  //2FA Activating
  const [isActivatingTwoFA, setIsActivatingTwoFA] = useState<boolean>(false);
  const [deactivateTwoFA, setDeactivateTwoFA] = useState<boolean>(false);
  const [isDeactivatingTwoFA, setIsDeactivatingTwoFA] = useState<boolean>(false);

  //2FA Verification
  const [twoFATempToken, setTwoFATempToken] = useState<string>('');
  const [twoFAVerificationCode, setTwoFAVerificationCode] = useState<string>('');

  useEffect(() => {
    if(user?.Role === 'Admin'){
      getUserList();
      getServicesList();
    }
  }, []);

  const getUserInfo = async () => {
    setIsGettingUserInfo(true);

    const newUser = await identityApi.getUserInfo();
    if(newUser){
      local.setUser(newUser);
      setUser(newUser);
    }

    setIsGettingUserInfo(false);
  }

  const getUserList = async () => {
    setIsGettingUserList(true);

    const data = await identityApi.getUserList();
    if(data){
      setUserList(data);
    }

    setIsGettingUserList(false);
  }

  const getServicesList = async () => {
    setIsGettingServicesList(true);
    const identityData = await identityApi.getIdentityServiceStatus();
    if(identityData){
      setIdentityServiceStatus(identityData);
    }

    setIsGettingServicesList(false);
  }

  const changeToObjectivesList = () => {
    navigate('/objectiveslist')
  }

  const resendApproveEmail = async () => {
    console.log('resendApproveEmail');
    const response = await identityApi.resendApproveEmail();
    console.log(response);
  }

  const activateUser = async (user: ResponseUser) => {
    setIsGettingUserList(true);
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'Active'});
    await getUserList();
    setIsGettingUserList(false);
  }

  const refuseUser = async (user: ResponseUser) => {
    setIsGettingUserList(true);
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'Refused'});
    await getUserList();
    setIsGettingUserList(false);
  }

  const waitingApproval = async (user: ResponseUser) => {
    setIsGettingUserList(true);
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'WaitingApproval'});
    await getUserList();
    setIsGettingUserList(false);
  }

  const changeIdentityStatus = async (up: boolean) => {
    if(identityServiceStatus) {
      let newData = identityServiceStatus;
      newData.Up = up;
      await identityApi.putIdentityServiceStatus(newData);
    }
    await getServicesList();
  }

  const changeRequestNewUserStatus = async (up: boolean) => {
    if(identityServiceStatus) {
      let newData = identityServiceStatus;
      newData.RequestNewUserUp = up;
      await identityApi.putIdentityServiceStatus(newData);
    }

    await getServicesList();
  }

  const getUserRow = (user: ResponseUser) => {
    return (
      <div key={user.Email} className='admin-user-row'>
        <div className='admin-user-name'>{user.Email}</div>
        <img className={user.Status === 'Active'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{activateUser(user)}}></img>
        <img className={user.Status === 'Refused'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{refuseUser(user)}}></img>
        <img className={user.Status === 'WaitingApproval'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/wait.png'} alt='meaningfull text' onClick={()=>{waitingApproval(user)}}></img>
        <img className={user.TwoFAActive? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/fingerprint.png'} alt='meaningfull text' onClick={()=>{}}></img>
        <img className={'admin-user-image'} src={process.env.PUBLIC_URL + '/add-lock.png'} alt='meaningfull text' onClick={()=>{showChangePass(user.Email)}}></img>
      </div>
    )
  }

  const emergencyStop = async () => {
    const result = await identityApi.getEmergencyStop();
  }
  
  const changePassword = (event: any) => {
    setPassword(event.target.value);
  }

  const passwordEnter = async (event: any) => {
    if(event.key === 'Enter'){
      if(emailChangePassword.trim() === '') { popMessage('Invalid user email to change.'); return;}
      if(password.trim() === '') { popMessage(`The password can't be empty.`); return;}
      if(password.trim().length > 64) { popMessage(`Too big. ( Max 64 characters )`); return;}

      const data = await identityApi.changeUserPassword({Email: emailChangePassword, Password: password});

      if(data){
        popMessage('Password changed.');
      }

      setIsShowingChangePass(false);
      setEmailChangePassword('');
      setPassword('');
    }
  }

  const showChangePass = (email: string) => {
    if(isShowingChangePass){
      setEmailChangePassword('');
      setPassword('');
      setIsShowingChangePass(false);
    }
    else{
      setEmailChangePassword(email);
      setIsShowingChangePass(true);
    }
  }

  const get2FAAuth = async () => {
    setIsGettingQRCode(true);
    const otpauth_url = await identityApi.getTwoFAAuth();

    if(otpauth_url){
      const url = await QRCode.toDataURL(otpauth_url);
      setTwoFAQRCode(url);
    }
    setIsGettingQRCode(false);
  }

  const sendDeactivateTwoFA = async (event: any) => {
    if(event.key === 'Enter'){
      setIsDeactivatingTwoFA(true);

      const requestDeactivate: TwoFactorAuthRequest = {TwoFACode: twoFAVerificationCode}
      log.b(requestDeactivate)
      const data = await identityApi.deactivateTwoFA(requestDeactivate);

      if(data){
        await getUserInfo();
      }

      setTwoFAVerificationCode('');
      setIsDeactivatingTwoFA(false);
    }
  }

  const sendActivationCode = async (event: any) => {
    if(event.key === 'Enter'){
      setIsActivatingTwoFA(true);
      const data = await identityApi.activateTwoFA({ TwoFACode: twoFAVerificationCode});

      setTwoFAQRCode('');
      setDeactivateTwoFA(false);
      if(data){
        await getUserInfo();
      }

      setTwoFAVerificationCode('');
      setIsActivatingTwoFA(false);
    }
  }

  const changeTwoFACode = (event: any) => {
    log.b('changeTwoFACode')
    setTwoFAVerificationCode(event.target.value);
  }

  return(
  <div className={"logged-container "}>
      <div className='card-container'>
      {isGettingUserInfo?
        <Loading/>
        :
        <>
          <div className='logged-title' onClick={getUserInfo}>PROFILE</div>
          <div className="logged-info-box">
            <div className="logged-box">
              <div className="userRow"><b>Username:</b> </div>
              <div className="userRow"><b>Email:</b> </div>
              <div className="userRow"><b>Role:</b> </div>
              <div className="userRow"><b>Status:</b> </div>
              <div className="userRow"><b>2FA:</b> </div>
            </div>
            <div className="logged-box">
              <div className="userData">{user?.Username}</div>
              <div className="userData">{user?.Email}</div>
              <div className="userData">{user?.Role}</div>
              <div className="userData">{user?.Status}</div>
              <div className="userData">{(user?.TwoFAActive)? 'Active':'Not active'}</div>
            </div>
          </div>
          <div className="logout-row">
            <button className="btn-base btn-logout" type="button"  onClick={logout}>Logout</button>
            <button className="btn-base btn-togrocerylist" type="button"  onClick={changeToObjectivesList}>To Objectives List</button>
            {user?.Status === 'WaitingApproval' && <button className="btn-base btn-togrocerylist" type="button"  onClick={resendApproveEmail}>Ask again for approval.</button>}
          </div>
        </>
      }
    </div>
    {user?.TwoFAActive?
      <div className="card-container">
        <div className='logged-title' onClick={()=>{popMessage('Message test...', MessageType.Error)}}>Deactivate 2FA</div>
        {deactivateTwoFA && 
          <div className={'fa-deactivate-container'}>
            <div className='fa-deactivate-subtitle'>Verification code:</div>
            {isDeactivatingTwoFA?
              <Loading/>
              :
              <input className="input-base" type="text" onChange={changeTwoFACode} onKeyUp={sendDeactivateTwoFA} placeholder="6 digit number" aria-label="Server" value={twoFAVerificationCode}></input>
            }
          </div>
        }
        <button className="btn-base" type="button" onClick={() => { setDeactivateTwoFA(!deactivateTwoFA)}}>{deactivateTwoFA?'Cancel':'Deactivate 2FA'}</button>
      </div>
      :
      <div className="card-container">
        <div className='logged-title' onClick={()=>{popMessage('Message test...', MessageType.Error)}}>Activate 2FA</div>
        {twoFAQRCode !== ''?
          (isActivatingTwoFA?
            <Loading/>
            :
            <>
              {isGettingQRCode?
                <Loading/>
                :
                <img className={'qrcode-image'} src={twoFAQRCode} onClick={get2FAAuth}></img>
              }
              <div className='fa-subtitle'>Verification code:</div>
              <input className="input-base" type="text" onChange={changeTwoFACode} onKeyUp={sendActivationCode} placeholder="6 digit number" aria-label="Server" value={twoFAVerificationCode}></input>
            </>
          )
          :
          (isGettingQRCode?
            <Loading/>
            :
            <button className="btn-base" type="button" onClick={get2FAAuth}>Get 2FA</button>
          )
        }
      </div>
    }
    {user?.Role === 'Admin' && (
    <>
      <div className='card-container'>
        {isGettingUserList ? (
          <Loading/>
        ) : (
          <>
            <div className='logged-title' onClick={() => {getUserList()}}>Users:</div>
            <div className='admin-users-box'>
              {userList.length > 0 && userList.map((user: ResponseUser) => (
                getUserRow(user)
              ))}
            </div>
            {isShowingChangePass && <div className="changeEmailText">{emailChangePassword}</div>}
            {isShowingChangePass && <input className="input-base" type="password" onChange={changePassword} onKeyUp={passwordEnter} placeholder="Password" aria-label="Server" value={password}></input>}
          </>
        )}
      </div>
      <div className='card-container'>
        {isGettingServicesList ? (
          <Loading/>
        ) : (
          <>
            <div onClick={emergencyStop}>Emergency Stop</div>
            <div className='logged-title' onClick={() => {getServicesList()}}>Services:</div>
            <div className='admin-service-box'>
              <div className='admin-service-row'>
                <div className='admin-service-name'>Identity:</div>
                <img className={identityServiceStatus?.Up ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{changeIdentityStatus(true)}}></img>
                <img className={!identityServiceStatus || !identityServiceStatus.Up ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{changeIdentityStatus(false)}}></img>
              </div>
              <div className='admin-service-row'>
                <div className='admin-service-name'>Identity Request:</div>
                <img className={identityServiceStatus?.RequestNewUserUp ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{changeRequestNewUserStatus(true)}}></img>
                <img className={!identityServiceStatus || !identityServiceStatus.RequestNewUserUp ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{changeRequestNewUserStatus(false)}}></img>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )}
  </div>
  )
}

export default UserView;
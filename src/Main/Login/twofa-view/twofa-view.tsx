import React, { useEffect, useRef, useState } from 'react';
import './twofa-view.scss';
import log from '../../../log/log';
import { useUserContext } from '../../../contexts/user-context';
import { useRequestContext } from '../../../contexts/request-context';
import { useLogContext } from '../../../contexts/log-context';
import { local, session } from '../../../storage/storage';
import { MessageType, TwoFactorAuthRequest } from '../../../Types';
import Loading from '../../../loading/loading';
import Button, { ButtonColor } from '../../../button/button';

interface TwoFAViewProps {
  setIsLogged: (value: boolean) => void,
  logout: () => void,
}

const TwoFAView: React.FC<TwoFAViewProps> = ({setIsLogged, logout}) => {
  const { identityApi } = useRequestContext();
  const { setUser } = useUserContext();
  const { popMessage } = useLogContext();
  
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerifingTwoFA, setIsVerifingTwoFA] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const changeTwoFACode = (event: any) => {
    setVerificationCode(event.target.value);
  }

  const onClickEnter = async (event: any) => {
    if(event.key === 'Enter'){
      sendVerificationTwoFA();
    }
  }

  const sendVerificationTwoFA = async () => {
    setIsVerifingTwoFA(true);
    
    if(!(/^[0-9]{6}$/.test(verificationCode))){
      setVerificationCode('');
      popMessage('Bad verification code. Must be 6 numbers.', MessageType.Alert);
      return;
    }
    
    const tempToken: string|null = await session.readTwoFATempToken();
    if(tempToken) {
      const sendRequest: TwoFactorAuthRequest = { TwoFACode: verificationCode, TwoFATempToken: tempToken };
      const data = await identityApi.validateTwoFA(sendRequest);

      if(data && data.User && data.Token){
        local.setToken(data.Token);
        local.setUser(data.User);
        local.setFirstLogin(true);
        setUser(data.User);
        setIsLogged(true);
      }
      else{
        popMessage('Login was ok but no data was returned.', MessageType.Error);
        logout();
      }
    }
    else{
      popMessage(`There's no token to try to approve 2FA code.`)
    }

    setIsVerifingTwoFA(false);
  }

  return (
    <div className='login-twofa-box'>
      {isVerifingTwoFA?
        <Loading/>
        :
        <>
          <div className='login-2fa-subtitle g-txt'>2FA Verification code:</div>
          <input ref={inputRef} name='TwoFA' className="input-base" type="text" onChange={changeTwoFACode} onKeyUp={onClickEnter} placeholder="6 digit number" aria-label="TwoFA" value={verificationCode}></input>
          <Button color={ButtonColor.GREEN} text='LOGIN' onClick={sendVerificationTwoFA} ></Button>
        </>
      }
    </div>
  );
};

export default TwoFAView;
import React, { useEffect, useRef, useState } from 'react';
import './twofa-view.scss';
import log from '../../../log/log';
import { useUserContext } from '../../../contexts/user-context';
import { useRequestContext } from '../../../contexts/request-context';
import { useLogContext } from '../../../contexts/log-context';
import { local, session } from '../../../storage/storage';
import { MessageType, TwoFactorAuthRequest } from '../../../Types';
import Loading from '../../../loading/loading';

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

  const sendVerificationTwoFA = async (event: any) => {
    if(event.key === 'Enter'){
      setIsVerifingTwoFA(true);
      
      if(!(/^[0-9]{6}$/.test(verificationCode))){
        setVerificationCode('');
        popMessage('Bad verification code. Must be 6 numbers.', MessageType.Alert);
        return;
      }
      
      log.b('sendVerificationTwoFA')
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

        setIsVerifingTwoFA(false);
      }
      else{
        popMessage(`There's no token to try to approve 2FA code.`)
      }
    }
  }

  return (
    <div className='login-twofa-box'>
      <div className='login-2fa-subtitle'>2FA Verification code:</div>
      {isVerifingTwoFA?
        <Loading/>
        :
        <input ref={inputRef} name='TwoFA' className="input-base" type="text" onChange={changeTwoFACode} onKeyUp={sendVerificationTwoFA} placeholder="6 digit number" aria-label="TwoFA" value={verificationCode}></input>
      }
    </div>
  );
};

export default TwoFAView;
import React, { useEffect, useState } from 'react';
import './Login.scss'
import { LoginModel, UserModel } from '../../Types'
import Loading from '../../Loading/Loading';
import { toast } from 'react-toastify';
import request from '../../Requests/RequestFactory';
import { useUserContext } from '../../Contexts/UserContext';
import storage from '../../Storage/Storage';
import { isJsxClosingElement } from 'typescript';

interface LoginProps{
}

const Login: React.FC<LoginProps> = (props) => {
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setUser, testServer, isServerUp } = useUserContext();

  useEffect(() => {
    console.log('verify');
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

  const requestAuthenticationToken = () => {

    //check username
    if(username.trim() === ""){
      toast.warning("Type username to login!");
      return;
    }
    //check password
    if(password.trim() === ""){
      toast.warning("Type password to login!");
      return;
    }

    const user: UserModel = {
      UserId: '',
      Username: username,
      Password: password,
    };

    const fetchData = async () => {
      console.log('fetchData');
      try {
        console.log('setIsLogging(true)');
        setIsLogging(true);
        const response = await request('/Login', 'POST', JSON.stringify(user), () => {
          console.log('setIsLogging(false)');
          setIsLogging(false);
          toast.warning("Error trying to login!");
          testServer();
        });

        setIsLogging(false);
        console.log('setIsLogging(false)');
        
        if(response !== undefined) {
          if(response.ok){
            const jsonData: LoginModel = await response.json();
            if(jsonData.User !== undefined && jsonData.Token !== undefined){
              console.log('logged');
              storage.setToken(jsonData.Token);
              storage.setUser(jsonData.User);
              setUser(jsonData.User);

              console.log('isLogged');
              setIsLogged(true);
            }
          }
        }
      } catch (error) {
        console.log('logging error');
        console.log('Error:', error);
      }
      setTimeout(() => {
        setIsLogging(false);
    }, 1000); 
    };
    fetchData();
  }

  const changeUsername = (event: any) => {
    setUsername(event.target.value);
  }

  const changePassword = (event: any) => {
    setPassword(event.target.value);
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
    console.log('logout');
    storage.deleteToken();
    storage.deleteUser();
    setUser(null);
    setIsLogged(false);
  }

  const verifyLogin = () => {
    const token = storage.getToken();
    const user = storage.getUser();

    if(token != null && token !== undefined && user != null && user !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(tokenDate > now){
        setUser(storage.getUser());
        console.log('isLogged');
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
          <div>Logging...</div>
          :
          (!isLogged?
            <div className="col login-box">
              <div className="login-row">
                <input className="form-control username" type="text" onChange={changeUsername} placeholder="Username" aria-label="Username"></input>
              </div>
              <div className="login-row">
                <input className="form-control password"  type="password" onChange={changePassword} placeholder="Password" aria-label="Server"></input>
              </div>
              <div className="login-row">
                <button className="btn btn-login" type="button"  onClick={requestAuthenticationToken}>Login</button>
              </div>
            </div>
            :
            <div className="col login-box">
              <div className="logout-row">
                <button className="btn btn-logout" type="button"  onClick={logout}>Logout</button>
              </div>
            </div>
            )
          )
        :
        <div>Server out</div>
      }
    </div>
  );
}

export default Login
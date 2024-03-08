import React, { useEffect, useState } from 'react';
import { UserProvider, useUserContext } from '../../Contexts/UserContext';
import storage from '../../Storage/Storage';
import './GroceryList.scss'
import Table from './Table/Table';

interface GroceryListProps{}

const GroceryList: React.FC<GroceryListProps> = (props) => {

  const { user, setUser } = useUserContext();
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(true);
  
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

  const verifyLogin = () => {
    const token = storage.getToken();
    const user = storage.getUser();

    if(token != null && token !== undefined && user != null && user !== undefined){
      const parsedToken = parseJwt(token);
      const now = new Date();
      const tokenDate = new Date(parsedToken.exp * 1000);

      if(parsedToken.exp === undefined || tokenDate > now){
        setUser(storage.getUser());
      }
    }
  }

  const handleIsOptionOpen = () => {
    setIsOptionOpen(!isOptionOpen);
  }

  return (
    <div className='groceryContainer'>
      <UserProvider>
        <div className="appContainer">
          {(user !== null && user !== undefined && user.Status === 'Active') ?
            <div className='tableInnerContainer'>
              {/* <div className='option-container'>
                <img src={process.env.PUBLIC_URL + '/settings.png'} onClick={handleIsOptionOpen} className="option-gear" alt='meaningfull text'></img>
                {isOptionOpen && 
                <div>
                  <div className='option'>Test1</div>
                  <div className='option'>Test2</div>
                </div>}
              </div> */}
              <Table></Table>
            </div>
            :
            <div className='showcaseInnerConainer'>
              <div className='title'>Personal use project & knowledge showcase</div>
              <div className='title'>Version 2</div>
              <img src={process.env.PUBLIC_URL +  '/how2.jpg'} alt='' className='how'></img>
              <div className='subTitle'>Test yourself:</div>
              <div className='sourceCode'><b>1- </b>Go to Login tab</div>
              <div className='sourceCode'><b>2- </b>Fill the fields to "send it".</div>
              <div className='sourceCode'><b>3- </b>I'll receive an email to approve the new user.</div>
              <div className='sourceCode'><b>4- </b>When approved, you'll be able to test my Grocery List app here on "Showcase" tab.</div>
              <div className='sourceCode'><b>React Native Android App: </b><a className='link' href='https://github.com/kaiqueqg/grocerylist-app/blob/main/apk/grocerylistv2.apk'>GroceryListApp.apk</a></div>

              <div className='title' style={{color: '#EE6C4D'}}>{"Version 1 (deprecated)"}</div>
              <img src={process.env.PUBLIC_URL +  '/how.png'} alt='' className='how'></img>
              <div className='subTitle' style={{color: '#EE6C4D'}}>Run yourself:</div>
              <div className='grocerylistText'>Use this docker-compose: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml'>https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml</a></div>
              <div className='sourceCode'>{"Api address: http://<ip-computer-running-api>:5000/api"}</div>
              <div className='sourceCode'>{"username: test"}</div>
              <div className='sourceCode'>{"password: test"}</div>
              <div className='subTitle' style={{color: '#EE6C4D'}}>GitHub:</div>
              <div className='sourceCode'>API: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api'>https://github.com/kaiqueqg/grocerylist-api</a></div>
              <div className='sourceCode'>Front-end: <a className='link' href='https://github.com/kaiqueqg/grocerylist-front'>https://github.com/kaiqueqg/grocerylist-front</a></div>
              <div className='sourceCode'>App: <a className='link' href='https://github.com/kaiqueqg/grocerylist-app'>https://github.com/kaiqueqg/grocerylist-app</a></div>
              <div className='subTitle' style={{color: '#EE6C4D'}}>Docker hub:</div>
              <div className='sourceCode'><a className='link' href='https://hub.docker.com/repositories/kaiqueqg'>https://hub.docker.com/repositories/kaiqueqg</a></div>
              <div className='subTitle' style={{color: '#EE6C4D'}}>App:</div>
              <div className='sourceCode'>Download the apk: <a className='link' href='https://github.com/kaiqueqg/grocerylist-app/blob/main/apk/GroceryListApp.apk'>GroceryListApp.apk</a></div>
              <br></br>
              <div className="appSampleContainer">
                <img src={process.env.PUBLIC_URL + "/appsample1.jpg"} alt='' className='appSampleImage'></img>
                <img src={process.env.PUBLIC_URL + "/appsample2.jpg"} alt='' className='appSampleImage'></img>
                <img src={process.env.PUBLIC_URL + "/appsample3.jpg"} alt='' className='appSampleImage'></img>
              </div>
              <div className='subTitle'>Front-end:</div>
              <img src={process.env.PUBLIC_URL + "/frontsample1.jpg"} alt='' className='frontSampleImg'></img>
            </div>
          }
        </div>
      </UserProvider>
    </div> 
  )
}

export default GroceryList
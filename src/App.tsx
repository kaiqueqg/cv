import React, { useEffect } from 'react';
import './app.scss';
import './global.scss';
import Curriculum from './main/curriculum/curriculum';
import TopMenu from './main/top-menu/top-menu';
import { HashRouter, Navigate, Route, Routes  } from 'react-router-dom';
import { UserProvider } from './contexts/user-context';
import { RequestProvider } from './contexts/request-context';
import { LogProvider } from './contexts/log-context';
import Login from './main/login/login';
import ObjectivesList from './main/objectives/objectives-list';
import IoT from './main/iot/iot';

interface AppProps{
}

const App: React.FC<AppProps> = () => {
  
  useEffect(() => {
    require('./global.scss');
  }, []);
  
  return (
    <React.StrictMode>
      <LogProvider>
        <UserProvider>
          <RequestProvider>
            <div className="appContainer">
              <HashRouter>
                <TopMenu></TopMenu>
                <Routes>
                  <Route path="" element={<Curriculum/>}/>
                  <Route path="/" element={<Curriculum/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/cv" element={<Curriculum/>}/>
                  <Route path="/objectiveslist" element={<ObjectivesList/>}/>
                  <Route path="/iot" element={<IoT></IoT>}/>
                </Routes>
              </HashRouter>
            </div>
          </RequestProvider>
        </UserProvider>
      </LogProvider>
    </React.StrictMode>
  )
}

export default App
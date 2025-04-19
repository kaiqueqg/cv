import React, { useEffect } from 'react';
import './App.scss';
import './global.scss';
import Curriculum from './Main/Curriculum/Curriculum';
import TopMenu from './Main/TopMenu/TopMenu';
import { HashRouter, Navigate, Route, Routes  } from 'react-router-dom';
import { UserProvider } from './Contexts/UserContext';
import Login from './Main/Login/Login';
import ObjectivesList from './Main/Objectives/ObjectivesList';
import { LogProvider } from './Contexts/LogContext';
import IoT from './Main/IoT/IoT';

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
        </UserProvider>
      </LogProvider>
    </React.StrictMode>
  )
}

export default App
import React, { useEffect } from 'react';
import './App.scss';
import './global.scss';
import Curriculum from './Main/Curriculum/Curriculum';
import TopMenu from './Main/TopMenu/TopMenu';
import { HashRouter, Navigate, Route, Routes  } from 'react-router-dom';
import { UserProvider } from './Contexts/UserContext';
import Login from './Main/Login/Login';
import { ToastContainer } from 'react-toastify';
import ObjectivesList from './Main/Objectives/ObjectivesList';

interface AppProps{
}

const App: React.FC<AppProps> = () => {
  
  useEffect(() => {
    require('./global.scss');
  }, []);
  
  return (
    <React.StrictMode>
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
              {/* <Route path="/sleepdevice" element={<SleepDevice></SleepDevice>} /> */}
            </Routes>
          </HashRouter>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            theme="dark"
            />
        </div>
      </UserProvider>
    </React.StrictMode>
  )
}

export default App
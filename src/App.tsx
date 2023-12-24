import React, { useEffect, useState } from 'react';
import './App.scss';
import Curriculum from './Main/Curriculum/Curriculum';
import GroceryList from './Main/GroceryList/GroceryList';
import SleepDevice from './Main/SleepDevice/SleepDevice';
import TopMenu from './Main/TopMenu/TopMenu';
import { BrowserRouter, Navigate, Route, Routes  } from 'react-router-dom';
import { UserProvider } from './Contexts/UserContext';
import Login from './Main/Login/Login';

interface AppProps{
}

const App: React.FC<AppProps> = () => {

  useEffect(() => {
  });
  
  return (
    <UserProvider>
      <div className="appContainer">
        <BrowserRouter>
          <TopMenu></TopMenu>
          <Routes>
            <Route path="/" element={<Navigate replace to="/cv" />} />
            {/* <Route path="/login" element={<Login></Login>}></Route> */}
            <Route path="/cv" element={<Curriculum></Curriculum>}/>
            <Route path="/knowledgeshowcase" element={<GroceryList></GroceryList>} />
            {/* <Route path="/sleepdevice" element={<SleepDevice></SleepDevice>} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
    
  )
}

export default App
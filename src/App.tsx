import React, { useEffect } from 'react';
import './App.scss';
import Curriculum from './Main/Curriculum/Curriculum';
import GroceryList from './Main/GroceryList/GroceryList';
import TopMenu from './Main/TopMenu/TopMenu';
import { BrowserRouter, Navigate, Route, Routes  } from 'react-router-dom';
import { UserProvider, useUserContext } from './Contexts/UserContext';
import Login from './Main/Login/Login';
import storage from './Storage/Storage';
import { ToastContainer } from 'react-toastify';


interface AppProps{
}

const App: React.FC<AppProps> = () => {
  const { setUser } = useUserContext();
  
  useEffect(() => {
    let user = storage.getUser();
    setUser(user);
  }, []);
  
  return (
    <UserProvider>
      <div className="appContainer">
        <BrowserRouter>
          <TopMenu></TopMenu>
          <Routes>
            <Route path="" element={<Navigate replace to="/cv" />} />
            <Route path="/" element={<Navigate replace to="/cv" />} />
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/cv" element={<Curriculum></Curriculum>}/>
            <Route path="/knowledgeshowcase" element={<GroceryList></GroceryList>} />
            {/* <Route path="/sleepdevice" element={<SleepDevice></SleepDevice>} /> */}
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          theme="dark"
          />
      </div>
    </UserProvider>
    
  )
}

export default App
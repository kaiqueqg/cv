import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app';
import { UserProvider } from './contexts/user-context';
import './global.scss';
import { ThemeProvider } from './contexts/theme-context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className='indexContainer'>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link href="https://fonts.googleapis.com/css2?family=Concert+One&family=Fredoka:wght@300..700&family=Kode+Mono:wght@400..700&family=Protest+Revolution&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"></link>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </div>
  </React.StrictMode>
);
import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import Main from './Main/Main';
import Experiences from './Main/Experiences/Experiences';

interface P{
}

interface S{
}

class App extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    
    return (
      <div style={{display: 'flex', height: '100%', justifyContent: 'center'}}>
        <Main></Main>
      </div>
    )
  }
}

export default App
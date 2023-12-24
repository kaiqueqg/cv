import React from 'react';
import './GroceryList.scss'

interface P{
}

interface S{
}

class GroceryList extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    return (
      <div className='groceryContainer'>
        <div className='title'>Personal use project & knowledge showcase</div>
        <img src={process.env.PUBLIC_URL +  '/how.png'} alt='' className='how'></img>
        <div className='subTitle'>Run yourself:</div>
        <div className='grocerylistText'>Use this docker-compose: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml'>https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml</a></div>
        <div className='sourceCode'>{"Api address: http://<ip-computer-running-api>:5000/api"}</div>
        <div className='sourceCode'>{"username: test"}</div>
        <div className='sourceCode'>{"password: test"}</div>
        <div className='subTitle'>GitHub:</div>
        <div className='sourceCode'>API: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api'>https://github.com/kaiqueqg/grocerylist-api</a></div>
        <div className='sourceCode'>Front-end: <a className='link' href='https://github.com/kaiqueqg/grocerylist-front'>https://github.com/kaiqueqg/grocerylist-front</a></div>
        <div className='sourceCode'>App: <a className='link' href='https://github.com/kaiqueqg/grocerylist-app'>https://github.com/kaiqueqg/grocerylist-app</a></div>
        <div className='subTitle'>Docker hub:</div>
        <div className='sourceCode'><a className='link' href='https://hub.docker.com/repositories/kaiqueqg'>https://hub.docker.com/repositories/kaiqueqg</a></div>
        <div className='subTitle'>App:</div>
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
    )
  }
}

export default GroceryList
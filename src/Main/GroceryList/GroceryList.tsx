import React from 'react';
import { Direction } from 'react-toastify/dist/utils';
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
        <img src={process.env.PUBLIC_URL + '/how.png'} alt='' style={{width: '1000px' , height: '300px', alignSelf: 'center'}} className='grocerylistImg'></img>
        <div className='grocerylistText'>To run, use this docker-compose: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml'>compose-prod.yml</a></div>
        <div className='subTitle'>GitHub:</div>
        <div className='sourceCode'>API: <a className='link' href='https://github.com/kaiqueqg/grocerylist-api'>https://github.com/kaiqueqg/grocerylist-api</a></div>
        <div className='sourceCode'>Front-end: <a className='link' href='https://github.com/kaiqueqg/grocerylist-front'>https://github.com/kaiqueqg/grocerylist-front</a></div>
        <div className='sourceCode'>App: <a className='link' href='https://github.com/kaiqueqg/grocerylist-app'>https://github.com/kaiqueqg/grocerylist-app</a></div>
        <div className='subTitle'>Docker hub:</div>
        <div className='sourceCode'><a className='link' href='https://hub.docker.com/repositories/kaiqueqg'>https://hub.docker.com/repositories/kaiqueqg</a></div>
        <div className='subTitle'>App:</div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <img src={process.env.PUBLIC_URL + '/appsample1.jpg'} alt='' style={{width: '300px' , height: '633px', alignSelf: 'center', margin: '10px'}} className='grocerylistImg'></img>
          <img src={process.env.PUBLIC_URL + '/appsample2.jpg'} alt='' style={{width: '300px' , height: '633px', alignSelf: 'center', margin: '10px'}} className='grocerylistImg'></img>
          <img src={process.env.PUBLIC_URL + '/appsample3.jpg'} alt='' style={{width: '300px' , height: '633px', alignSelf: 'center', margin: '10px'}} className='grocerylistImg'></img>
        </div>
        <div className='subTitle'>Front-end:</div>
        <img src={process.env.PUBLIC_URL + '/frontsample1.jpg'} alt='' style={{width: '900px' , height: '400px', alignSelf: 'center', margin: '10px'}} className='grocerylistImg'></img>
      </div> 
    )
  }
}

export default GroceryList
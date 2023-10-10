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
        <div className='subTitle'>TO RUN:</div>
        <p>To run, use this docker-compose:</p>
        <a className='link' href='https://github.com/kaiqueqg/grocerylist-api/blob/main/compose-prod.yml'>compose-prod.yml</a>
        <p>GitHub:</p>
        <div><a className='link' href='https://github.com/kaiqueqg/grocerylist-api'>https://github.com/kaiqueqg/grocerylist-api</a></div>
        <div><a className='link' href='https://github.com/kaiqueqg/grocerylist-front'>https://github.com/kaiqueqg/grocerylist-front</a></div>
        <div className='subTitle'>WHY?</div>
        <div className='subTitleResponse'>
          <p>Knowledge showcase: </p>
          <p style={{marginLeft: '30px'}}>Public on github to show my code organization, design patterns and to invite critique from potential interviewers.</p>
          <p style={{marginLeft: '30px'}}>I used tools/frameworks that I was familiar with or wanted to learn. Not necessarily the best approach for the task. Some "overkill", others for simplicity.</p>
          <p>Personal use:</p>
          <div style={{margin: '10px 0px 10px 30px'}}>Before, I used Google Keep with checkboxes for my grocery shopping list, but it lack some important features I needed:</div>
          <li style={{marginLeft: '30px'}}>An easy-to-use lock mechanism to prevent accidental changes to the list.</li>
          <li style={{marginLeft: '30px'}}>An easily accessible option displaying items by 'checked', 'unchecked' or 'both'. Keep has a similar option, but its located within the settings.</li>
          <li style={{marginLeft: '30px'}}>For "categories" Google Keep uses indentation but it's messy. Others apps have a category unnecessarily complicated. I wanted a simpler and more direct approach.</li>
        </div>
        <div className='subTitle' style={{marginBottom: '50px'}}>How?</div>
        <img src={process.env.PUBLIC_URL + '/how.jpg'} alt='' style={{width: '1091px' , height: '257px', alignSelf: 'center'}}></img>
      </div> 
    )
  }
}

export default GroceryList
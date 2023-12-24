import React, { useEffect, useState } from 'react';
import './SleepDevice.scss'
import { Language } from '../../Types';

interface SleepDeviceProps{
}

const SleepDevice: React.FC<SleepDeviceProps> = () => {

  const [data, setData] = useState<string>("false");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fa7em4wpi1.execute-api.sa-east-1.amazonaws.com/dev/'); // Replace with your API endpoint
        const result = await response.json();
        console.log("Result: " + result);
        setData("Result: " + result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='sleepContainer'>
      <p>{data}</p>
    </div> 
  )
}

export default SleepDevice
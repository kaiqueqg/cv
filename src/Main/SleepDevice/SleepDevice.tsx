import React, { useEffect, useState } from 'react';
import './SleepDevice.scss'
import { Language } from '../../Types';

interface SleepDeviceProps{
}

const SleepDevice: React.FC<SleepDeviceProps> = () => {

  const [data, setData] = useState<string>("false");

  useEffect(() => {
  }, []);

  return (
    <div className='sleepContainer'>
      <p>{data}</p>
    </div> 
  )
}

export default SleepDevice
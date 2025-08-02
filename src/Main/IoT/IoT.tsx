import React, { useEffect, useState } from 'react';
import './iot.scss'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
//import { objectiveslistApi } from '../../requests-sdk/requests-sdk';
import { DeviceData } from '../../TypesObjectives';
import { useRequestContext } from '../../contexts/request-context';


interface IoTProps{
}

const IoT: React.FC<IoTProps> = () => {
  const { objectiveslistApi } = useRequestContext();

  const [mobileDeviceData, setMobileDeviceData] = useState<DeviceData[]>([]);
  const [stationaryDeviceData, setStationaryDeviceData] = useState<DeviceData[]>([]);

  useEffect(() => {
    getMobileDeviceData();
    getStationaryDeviceData();
  }, []);

  const getMobileDeviceData = async () => {
    const data = await objectiveslistApi.getDeviceData('MOBILEDEVICE');
    if(data){
      console.log(data);
      setMobileDeviceData(data);
    }
  }

  const getStationaryDeviceData = async () => {
    const data = await objectiveslistApi.getDeviceData('STATIONARYDEVICE');
    if(data){
      console.log(data);
      setStationaryDeviceData(data);
    }
  }

  const tooltip = ({ active, payload, label }: any) =>{
    if (!active || !payload || payload.length === 0) return null;
    return(
      <div>
        {payload[0].value}
      </div>
    )
  }

  const getChartMobile = (property: string, min: number, max: number, breakDown?: number[]) => {
    return(
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={mobileDeviceData}>
          <div >
            Environmental Sensor Data
          </div>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="DateAdded" 
            tickFormatter={(tick) => {
              const date = new Date(tick);
              const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' }); // force 24h UTC time
              const day = date.toLocaleDateString('en-GB', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              return `${time} - ${day}`;
            }}/>
          <YAxis domain={[min, max]} ticks={breakDown}/>
          <Tooltip content={tooltip} />
          <Line type="monotone" dataKey={property} stroke="#8884d8" strokeWidth={2}>
          <LabelList dataKey="DateAdded" content={({ x, y, value }) => (value)}/>
          </Line>
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const getChartStationary = (property: string, min: number, max: number, breakDown?: number[]) => {
    return(
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={stationaryDeviceData}>
          <div >
            Environmental Sensor Data
          </div>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="DateAdded" 
            tickFormatter={(tick) => {
              const date = new Date(tick);
              const time = date.toLocaleTimeString('en-GB', { timeZone: 'UTC' }); // force 24h UTC time
              const day = date.toLocaleDateString('en-GB', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              return `${time} - ${day}`;
            }}/>
          <YAxis domain={[min, max]} ticks={breakDown}/>
          <Tooltip content={tooltip}/>
          <Line type="monotone" dataKey={property} stroke="#8884d8" strokeWidth={2}>
          <LabelList dataKey="DateAdded" content={({ x, y, value }) => (value)}/>
          </Line>
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className='iotContainer'>
      <div className='iotContainerLeft'>
        <div className='iotDeviceTitle'>Mobile</div>
        <div>Ambient Temperature</div>
        {getChartMobile('AmbientTemperature', 0, 50, [0, 10, 20, 30, 40, 50])}
        <div>Ambient Humidity</div>
        {getChartMobile('AmbientHumidity' , 0, 10, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])}
        <div>Air quality</div>
        {getChartMobile('AirQuality', 30, 100, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])}
        <div>Prob Temperature</div>
        {getChartMobile('WeakProbTemperature', 0, 50, [0, 10, 20, 30, 40, 50])}
        <div>Acceleration</div>
        {getChartMobile('TotalAcel', 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}
        <div>Uv Light</div>
        {getChartMobile('UVLight', 0, 15, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])}
        <div>Light</div>
        {getChartMobile('AmbientLight', 0, 65000)}
      </div> 
      <div className='iotContainerRight'>
        <div className='iotDeviceTitle'>Stationary</div>
        <div>Ambient Temperature</div>
        {getChartStationary('AmbientTemperature', 0, 50, [0, 10, 20, 30, 40, 50])}
        <div>Ambient Humidity</div>
        {getChartStationary('AmbientHumidity' , 0, 10, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])}
        <div>Air quality</div>
        {getChartStationary('AirQuality', 30, 100, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])}
      </div>
    </div>
  )
}

export default IoT
import {  toast } from 'react-toastify';
import storage from '../Storage/Storage';

const errors = [400, 401, 404, 409, 500, 503]


async function request(endpoint: string, method: string, body?: string, fError?: () => void): Promise<any>{
  const headers: {[key: string]: string} = {};
  headers['Content-Type'] = 'application/json';

  const token = storage.getToken();
  if(token !== null) headers['Authorization'] = "Bearer " + token;

  try {
    const response = await fetch('https://ygwynyk5j6.execute-api.sa-east-1.amazonaws.com/dev' + endpoint, {
      headers,
      method,
      mode: 'cors',
      body: body
    });
    if(response !== undefined && errors.includes(response.status)){
      const message = await response.text();
      toast.warning(message, { autoClose: 10000});
    }

    return response;
  } catch (error) {
    if(fError !== undefined) fError();
    else {
      console.log('Untreated error...');
      //toast.error("Untreated error...", { autoClose: 5000 });
    }
    return undefined;
  }
}

export default request;
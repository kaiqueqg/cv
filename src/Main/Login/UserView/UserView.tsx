import { useUserContext } from "../../../Contexts/UserContext";
import storage from "../../../Storage/Storage";
import { useNavigate } from 'react-router-dom';
import './UserView.scss';
import { useEffect, useState } from "react";
import { ResponseUser, Response, ResponseServices } from "../../../Types";
import { identityApi } from "../../../Requests/RequestFactory";
import log from "../../../Log/Log";
import Loading from "../../../Loading/Loading";

interface UserViewProps{
  setIsLogged: (value: boolean) => void,
}

const UserView: React.FC<UserViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [userList, setUserList] = useState<ResponseUser[]>([]);
  const [identityServiceStatus, setIdentityServiceStatus] = useState<ResponseServices>();
  const [isGettingUserList, setIsGettingUserList] = useState<boolean>();
  const [isGettingServicesList, setIsGettingServicesList] = useState<boolean>();

  useEffect(() => {
    if(user?.Role === 'Admin'){
      getUserList();
      getServicesList();
    }
  }, []);

  const getUserList = async () => {
    setIsGettingUserList(true);

    const data = await identityApi.getUserList();
    if(data){
      setUserList(data);
    }

    setIsGettingUserList(false);
  }

  const getServicesList = async () => {
    setIsGettingServicesList(true);

    const identityData = await identityApi.getIdentityServiceStatus();
    if(identityData){
      setIdentityServiceStatus(identityData);
    }

    setIsGettingServicesList(false);
  }

  const logout = () => {
    storage.deleteToken();
    storage.deleteUser();
    setUser(null);
    props.setIsLogged(false);
  }

  const changeToObjectivesList = () => {
    navigate('/objectiveslist')
  }

  const activateUser = async (user: ResponseUser) => {
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'Active'});
    await getUserList();
  }

  const refuseUser = async (user: ResponseUser) => {
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'Refused'});
    await getUserList();
  }

  const waitingApproval = async (user: ResponseUser) => {
    const respUser = await identityApi.changeUserStatus({Email: user.Email, Status: 'WaitingApproval'});
    await getUserList();
  }

  const changeIdentityStatus = async (up: boolean) => {
    if(identityServiceStatus) {
      let newData = identityServiceStatus;
      newData.Up = up;
      await identityApi.putIdentityServiceStatus(newData);
    }
    await getServicesList();
  }

  const changeRequestNewUserStatus = async (up: boolean) => {
    if(identityServiceStatus) {
      let newData = identityServiceStatus;
      newData.RequestNewUserUp = up;
      await identityApi.putIdentityServiceStatus(newData);
    }

    await getServicesList();
  }

  const getUserRow = (user: ResponseUser) => {
    return (
      <div key={user.Email} className='admin-user-row'>
        <div className='admin-user-name'>{user.Email}</div>
        <img className={user.Status === 'Active'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{activateUser(user)}}></img>
        <img className={user.Status === 'Refused'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{refuseUser(user)}}></img>
        <img className={user.Status === 'WaitingApproval'? 'admin-user-image' : 'admin-user-image beige-darker'} src={process.env.PUBLIC_URL + '/waitingapproval.png'} alt='meaningfull text' onClick={()=>{waitingApproval(user)}}></img>
      </div>
    )
  }

  const emergencyStop = async () => {
    const result = await identityApi.getEmergencyStop();
    log.r(result);
  }

  return(
  <div className="logged-container">
    <div className='card-container'>
      <div className='logged-title'>Profile:</div>
      <div className="logged-info-box">
        <div className="logged-box">
          <div className="userRow"><b>Username:</b> </div>
          <div className="userRow"><b>Email:</b> </div>
          <div className="userRow"><b>Role:</b> </div>
          <div className="userRow"><b>Status:</b> </div>
        </div>
        <div className="logged-box">
          <div className="userData">{user?.Username}</div>
          <div className="userData">{user?.Email}</div>
          <div className="userData">{user?.Role}</div>
          <div className="userData">{user?.Status}</div>
        </div>
      </div>
      <div className="logout-row">
        <button className="btn-base btn-logout" type="button"  onClick={logout}>Logout</button>
        <button className="btn-base btn-togrocerylist" type="button"  onClick={changeToObjectivesList}>To Objectives List</button>
      </div>
    </div>

    {user?.Role === 'Admin' && (
    <>
      <div className='card-container'>
        {isGettingUserList ? (
          <Loading/>
        ) : (
          <>
            <div className='logged-title' onClick={() => {getUserList()}}>Users:</div>
            <div className='admin-users-box'>
              {userList.length > 0 && userList.map((user: ResponseUser) => (
                getUserRow(user)
              ))}
            </div>
          </>
        )}
      </div>
      <div className='card-container'>
        {isGettingServicesList ? (
          <Loading/>
        ) : (
          <>
            <div onClick={emergencyStop}>Emergency Stop</div>
            <div className='logged-title' onClick={() => {getServicesList()}}>Services:</div>
            <div className='admin-service-box'>
              <div className='admin-service-row'>
                <div className='admin-service-name'>Identity:</div>
                <img className={identityServiceStatus?.Up ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{changeIdentityStatus(true)}}></img>
                <img className={!identityServiceStatus || !identityServiceStatus.Up ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{changeIdentityStatus(false)}}></img>
              </div>
              <div className='admin-service-row'>
                <div className='admin-service-name'>Identity Request:</div>
                <img className={identityServiceStatus?.RequestNewUserUp ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/active.png'} alt='meaningfull text' onClick={()=>{changeRequestNewUserStatus(true)}}></img>
                <img className={!identityServiceStatus || !identityServiceStatus.RequestNewUserUp ? 'admin-service-image' : 'admin-service-image beige-darker'} src={process.env.PUBLIC_URL + '/refused.png'} alt='meaningfull text' onClick={()=>{changeRequestNewUserStatus(false)}}></img>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )}
  </div>
  )
}

export default UserView;
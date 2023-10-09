import React from 'react'
import api from './api';

const Admin = ({users, setUsers}) => {

  const setVipTrue = async (user) => {
    user.is_vip = true;
    const response = await api.setVipStatus(user);
    setUsers(users.map(item => item.id === response.id ? response : item))
  }

  const setVipFalse = async (user) => {
    user.is_vip = false;
    const response = await api.setVipStatus(user);
    setUsers(users.map(item => item.id === response.id ? response : item)) 
  }
  console.log(users)

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {
          users.map(user => {
            return <li key={user.id}>{user.username} 
            {user.is_vip ? <button onClick={() => setVipFalse(user)}>Remove VIP Status</button> : <button onClick={() => setVipTrue(user)}>Make VIP</button>}
            </li>
          })
        }
      </ul>
    </div>
  )
}

export default Admin;
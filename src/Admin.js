import React from 'react'

const Admin = ({users}) => {

  const makeVip = (id) => {
    console.log(id)
  }


  return (
    <div>
      <h3>Users</h3>
      <ul>
        {
          users.map(user => {
            return <li key={user.id}>{user.username} 
            <button onClick={() => makeVip(user.id)}>lol</button>
            </li>
          })
        }
      </ul>
    </div>
  )
}

export default Admin;
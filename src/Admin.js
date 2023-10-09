import React from 'react'

const Admin = ({users}) => {

  console.log(users)
  return (
    <div>
      <h3>Users</h3>
      <ul>
        {
          users.map(user => {
            return <li>{user.username}</li>
          })
        }
      </ul>
    </div>
  )
}

export default Admin;
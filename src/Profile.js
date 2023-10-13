import React from 'react'

const Profile = ({auth, users}) => {
  const user = users.find(user => user.id === auth.id)


  if (!user) return null;

  return (
    <div>
        <h2>Profile Settings</h2>
        {user.image ? <img src={user.image} /> : null}
        <h4>{`Username: ${user.username}`}</h4>
        <h4>{user.is_vip ? 'Thanks for being a vip!' : 'Upgrade to our VIP club for exclusive deals and promotions.'}</h4>
    </div>
  )
}

export default Profile
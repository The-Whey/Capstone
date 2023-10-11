import React from 'react'

const Profile = ({auth, users}) => {

  return (
    <div>
        <h2>Profile Settings</h2>
        <h4>{`Username: ${auth.username}`}</h4>
        <h4>{auth.is_vip ? 'Thanks for being a vip!' : 'Upgrade to our VIP club for exclusive deals and promotions.'}</h4>
    </div>
  )
}

export default Profile
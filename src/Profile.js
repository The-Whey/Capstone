import React from 'react'

const Profile = ({auth, users}) => {
  console.log(auth)

  return (
    <div>
        <h2>Profile Settings</h2>
        {auth.image ? <img src={auth.image} /> : null}
        <h4>{`Username: ${auth.username}`}</h4>
        <h4>{auth.is_vip ? 'Thanks for being a vip!' : 'Upgrade to our VIP club for exclusive deals and promotions.'}</h4>
    </div>
  )
}

export default Profile
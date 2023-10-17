import React, { useEffect, useState, useRef } from 'react'
import api from './api';

const Profile = ({auth, users, addresses}) => {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [is_vip, setIs_vip] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([])
  const user = users.find(user => user.id === auth.id);
  const el = useRef();

  const submitHandler = async (ev) => {
    ev.preventDefault()
    user.image = image;
    user.username = username;
    const response = await api.updateUser(user);
    setEditMode(false)
  }

  const deleteAddress = async(id) => {
    const json = {id}
    const response = await api.deleteAddress(json)
    console.log(response)
  }

  useEffect(() => {
    const user = users.find(user => user.id === auth.id);
  
    if (user){
      setImage(user.image);
      setUsername(user.username);
      setIs_vip(user.is_vip);
    }
    if (user && addresses){
      const userAddresses = addresses.filter(address => address.nickname).filter(address => address.user_id === user.id);
      setSavedAddresses(userAddresses)
    }
  }, [auth, users, addresses])

  useEffect(() => {
    if (editMode){
      el.current.addEventListener('change', (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', () => {
          setImage(reader.result)
        })
      })
    }
  }, [editMode])


  if (!user) return null;

  return (
    <div>
        { editMode ? 
        <div>
          <form onSubmit={submitHandler}>
            <img src={image} />
            <input type='file' ref={el}/>
            <label>Username:</label>
            <input value={username} onChange={(ev) => setUsername(ev.target.value)}></input>
            <button>Submit Changes</button>
            <button type='button' onClick={() => setEditMode(false)}>Cancel</button>
          </form>

        </div>
        : <div>
            <h2>Profile</h2>
            {user.image ? <img src={image} /> : null}
            <h4>{`Username: ${username}`}</h4>
            <h4>{is_vip ? 'Thanks for being a vip!' : 'Upgrade to our VIP club for exclusive deals and promotions.'}</h4>
            {savedAddresses.length ? 
              <div>
                <h4>Saved Addresses:</h4>
                {
                  savedAddresses.map(addy => <div key={addy.id}>{`${addy.nickname}: ${addy.data.properties.formatted}`}</div>)
                }
              </div>
              : <div>You have no saved addresses</div>
            }
            <br/>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        }
    </div>
  )
}

export default Profile
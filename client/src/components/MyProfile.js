import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfilePage from './profile';
import FormDialog from './FormDialog';

const MyProfile = ({ setIsLogged }) => {
  const [myProfile, setMyProfile] = useState([]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();
  const [user, setUser] = useState();

  useEffect(() => {

    setUser(JSON.parse(sessionStorage.user));
    axios.get(`https://localhost:7203/api/Player/` + JSON.parse(sessionStorage.user).playerID)
      .then(res => {
        console.log(res.data);
        setMyProfile(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])
  
  const edit_profile = async () => {
    const user1 = {
      "playerID": user.playerID,
      "playerName": name != null ? name : user.playerName,
      "playerPassword": user.playerPassword,
      "playerEmail": email != null ? email : user.playerEmail,
      "dateOfRegistration": "2023-05-03T22:02:33.445Z",
      "eloRating": user.eloRating,
      "playerAddress": address != null ? address : user.playerAddress,
      "games": [
      ]
    };
    console.log("axios");
    await axios.put(`https://localhost:7203/api/Player/` + user1.playerID , user1)
      .then(res => {
        console.log(res.data);
        alert("updated succesfully");
             
        sessionStorage.setItem('user', JSON.stringify(res.data)==""?{}:JSON.stringify(res.data));  

        
      })
      .catch(err => {
        console.log(err);
        alert("apdate failed:(");
        sessionStorage.setItem('user', "");
      })
  }
  return (
    <>
      {
        (sessionStorage.getItem("user")) == "" ? <FormDialog setIsLogged={setIsLogged} /> :
          <ProfilePage setName={setName} setEmail={setEmail} setAddress={setAddress} edit_profile={edit_profile} />
      }
    </>
  );
}

export default MyProfile;
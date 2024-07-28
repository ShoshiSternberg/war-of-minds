import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody} from 'mdb-react-ui-kit';

const MyHistory = ({setNumOfGames}) => {

  const [myHistory, setMyHistory] = useState([]);

  useEffect(() => {
    let user = JSON.parse(sessionStorage.user);
    axios.get(`https://localhost:7203/api/Player/GetHistory/` + user.playerID)
      .then(res => {
        console.log(res.data);
        setMyHistory(res.data);
        setNumOfGames(res.data.length);
      })

  }, [])

  return (
    <div style={{ height: '300px', overflow: 'auto' }}>
    <MDBTable align='middle'>
      <MDBTableHead light className='myHistory'>
        <tr>
          <th scope='col'></th>
          <th scope='col'>subject</th>
          <th scope='col'>date</th>
          <th scope='col'>length</th>
          <th scope='col'>average rating</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody className='MyHistoryTable'>
        {myHistory.map((game) => (
          <tr key={game.GameID}>
            <td>{game.GameID}</td>
            <td>{game.subject}</td>
            <td>{game.gameDate}</td>
            <td>{game.gameLength}</td>
            <td>{game.rating}</td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  </div>
  );
}

export default MyHistory;
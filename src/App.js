import React, { useState, useEffect, useRef } from "react";
import { socketService } from './services/Socket.service'
import DoctorModel from './models/Doctor.model'
import { patientService } from './services/Patient.service'
import { chainService } from './services/Blockchain.service'

import './App.scss';
import './config/Rou';
import { BrowserRouter } from 'react-router-dom';
import Rou from './config/Rou';

const host = "http://localhost:3000";

function App() {
  const [blocks, setBlocks] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    socketService.start()
    socketService.needSynchronizeChains()

    socketService.onSyncTheChain = (newChain) => {
      setBlocks(newChain)
    }

    return () => {

    };

  }, []);

  const addNewDoctor = (e) => {
    if (name != '' && username != '' && password != '') {
      let doctor = new DoctorModel()
      doctor.name = name
      doctor.username = username
      doctor.password = password

      chainService.addBlockToChain(patientService.convertDoctorToBlock(doctor))
      socketService.sendSyncData()
    }
  }

  return (
    <BrowserRouter>
        <Rou />
      </BrowserRouter>
  )

  // return (
  //   <div className="patient" style={{ padding: 16 }}>
  //     <div style={{ marginBottom: 16 }}>
  //       <div >
  //         <h2 >
  //           Add doctor
  //         </h2>
  //         <div >
  //           <div className="panel">
  //             <input type="text" onChange={(e) => { setName(e.target.value) }} placeholder='Name' />
  //             <input type="text" onChange={(e) => { setUsername(e.target.value) }} placeholder='Username' style={{ marginLeft: 8 }} />
  //             <input type="text" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' style={{ marginLeft: 8 }} />
  //             <button onClick={addNewDoctor} style={{ marginLeft: 8 }}>Add</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <h2 >
  //       Chain
  //     </h2>
  //     <div className="patient-infos">
  //       {blocks ? blocks.map(e => {
  //         return (
  //           <div key={e.index}>
  //             <div >
  //               Block {e.index}
  //             </div>
  //             <div >
  //               Created time {TimeUtil.timestampToDateString(e.timestamp)}
  //             </div>
  //             <div>
  //               Hash: {e.hash}
  //             </div>
  //             <div >
  //               Type: {e.type}
  //             </div>
  //             <div style={{ backgroundColor: 'yellow' }}>
  //               Previous hash: {e.previousHash}
  //             </div>
  //             <div> Content: {e.base64Transaction}</div>
  //             <div style={{ height: 1, width: '100%', backgroundColor: 'black', marginBottom: 6, paddingTop: 6 }}>

  //             </div>
  //           </div>
  //         )
  //       })
  //         : "No Data"}
  //     </div>
  //   </div>
  // );
}

export default App;
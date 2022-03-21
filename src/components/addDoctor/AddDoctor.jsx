import React, { useState } from 'react';
import './AddDoctor.scss';
import { useNavigate } from 'react-router-dom'

import { socketService } from '../../services/Socket.service'
import { chainService } from '../../services/Blockchain.service'
import { patientService } from '../../services/Patient.service'
import DoctorModel from '../../models/Doctor.model'
import { encryptDR } from '../../utils/Encryptor'

function AddPatient() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const addNewPatient = (e) => {
        if (name !== '' && username !== '' && password !== '') {
            
            let doctor = new DoctorModel()
            doctor.name = name
            doctor.username = username
            doctor.password = encryptDR(password)
      
            chainService.addBlockToChain(patientService.convertDoctorToBlock(doctor))
            socketService.sendSyncData()

            navigate('/home')
        }
        else (alert('Please enter information!!!'))
    }

    return (
        <div className="add-patient">
            <div className="add-patient-container">
                <h2 className="add-patient-container-title">
                    Add new doctor
                </h2>
                <div className="add-patient-container-panel">
                    <div className="panel">
                        <div className="panel-left">
                            <div className="panel-left-avatar">
                                <img src="" className="img" />
                            </div>
                            <button className='btn-upload'>Upload image</button>
                            
                        </div>
                        <div className="panel-right">
                            <p className='title'>Doctor full name</p>
                            <input type="text" onChange={(e) => { setName(e.target.value) }} placeholder='Full name' className="panel-right-input panel-right-name " />

                            <p className='title'>Username</p>
                            <input type="text" onChange={(e) => { setUsername(e.target.value) }} placeholder='Username' className="panel-right-input panel-right-name " />
                        
                            <p className='title'>Password</p>
                            <input type="text" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' className="panel-right-input panel-right-dob" />
                                                    
                            
                            <div className="button-bar">
                                <button className="btn-back btn" onClick={() => {
                                    navigate('/home')
                                }}>Back</button>
                                <button className="btn-add btn" onClick={addNewPatient}>Add doctor</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

AddPatient.propTypes = {

}

export default AddPatient
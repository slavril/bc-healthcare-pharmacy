import React, { useState } from 'react';
import './addPatient.scss';
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

import { socketService } from '../../services/Socket.service'
import PatientModel from '../../models/patient.model'
import { TimeUtil } from '../../utils/Time.util'
import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { chainService } from '../../services/Blockchain.service'
import { patientService } from '../../services/Patient.service'

function AddPatient() {
    const navigate = useNavigate();
    const option = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ]

    const [status, setStatus] = useState('ACTIVE');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [assignDoctor, setDoctor] = useState('');
    const [password, setPassword] = useState('');

    const addNewPatient = (e) => {
        if (name !== '' && gender !== '' && date !== '' && address !== '') {
            let patient = new PatientModel()
            patient.name = name
            patient.ID = TimeUtil.currentUTCTimestamp()
            patient.DOB = date
            patient.address = address
            patient.gender = gender

            if (password != '') {
                patient.password = password
            }

            chainService.addBlockToChain(patientService.convertPatientToBlock(patient))
            socketService.sendSyncData()

            navigate('/home')
        }
        else (alert('Please enter information!!!'))
    }

    const makeActive = (e) => {
        if (status === 'ACTIVE') {
            setStatus('INACTIVE')
        }
        else (setStatus('ACTIVE'))
    }

    const doctors = () => {
        return getAllDoctorSmartContract.getAllDoctor().map(e => {
            return { value: e.username, label: e.name }
        })
    }

    return (
        <div className="add-patient">
            <div className="add-patient-container">
                <h2 className="add-patient-container-title">
                    Add new patient
                </h2>
                <div className="add-patient-container-panel">
                    <div className="panel">
                        <div className="panel-left">
                            <div className="panel-left-avatar">
                                <img src="" className="img" />
                            </div>
                            <button className='btn-upload'>Upload image</button>
                            {/* <div className="panel-left-status">
                                <span className="panel-left-status-title">Status: </span>
                                <span className="panel-left-status-content">
                                    {status}
                                </span>
                            </div>
                            <button className="panel-left-btn-active" onClick={makeActive}>
                                Make active
                            </button> */}
                        </div>
                        <div className="panel-right">
                            <p className='title'>Patient full name</p>
                            <input type="text" onChange={(e) => { setName(e.target.value) }} placeholder='Name' className="panel-right-input panel-right-name " />
                            
                            <p className='title'>Patient gender</p>
                            <Select options={option} onChange={(e) => { setGender(e.value) }} className="panel-right-gender" placeholder='Gender' />
                            
                            <p className='title'>Birthday</p>
                            <input type="date" onChange={(e) => { setDate(e.target.value) }} placeholder='Date of Birth' className="panel-right-input panel-right-dob" />
                            
                            <p className='title'>Patient address</p>
                            <input type="text" onChange={(e) => { setAddress(e.target.value) }} placeholder='Address' className="panel-right-input panel-right-address" />

                            <p className='title'>Please assign doctor</p>
                            <Select options={doctors()} onChange={(e) => { setDoctor(e.value) }} className="panel-right-gender" placeholder='Assign doctor' />
                            
                            <p className='title'>Account password</p>
                            <input type="text" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' className="panel-right-input panel-right-address" />
                            
                            <div className="button-bar">
                                <button className="btn-back btn" onClick={() => {
                                    navigate('/home')
                                }}>Back</button>
                                <button className="btn-add btn" onClick={addNewPatient}>Add patient</button>
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
import React, { useEffect, useState, useRef } from 'react';
import './addPatient.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Select from 'react-select'

import { socketService } from '../../services/Socket.service'
import PatientModel from '../../models/patient.model'
import { TimeUtil } from '../../utils/Time.util'
import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { chainService } from '../../services/Blockchain.service'
import { patientService } from '../../services/Patient.service'
import { patientDetailSmartContract } from '../../smartcontract/PatientDetail.smc'
import { editPatientSmartContract } from '../../smartcontract/EditPatient.smc'

function AddPatient({ route, navigation }) {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const patientID = searchParams.get('id')
    /**
     * @type {PatientModel} patient
     */
    const patient = patientID ? patientDetailSmartContract.getDetail(patientID) : null

    const option = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ]

    const [status, setStatus] = useState('ACTIVE');
    const [name, setName] = useState(patient ? patient.name : '');
    const [gender, setGender] = useState(patient ? patient.gender : 'Male');
    const [date, setDate] = useState(patient ? patient.DOB : '');
    const [address, setAddress] = useState(patient ? patient.address : '');
    const [assignDoctor, setDoctor] = useState(patient ? patient.assignedDoctor : 'select-doctor');
    const [password, setPassword] = useState('');

    const editPatient = () => {
        let newPatient = new PatientModel()
        newPatient.name = name
        newPatient.ID = searchParams.get('id')
        newPatient.DOB = date
        newPatient.address = address
        newPatient.gender = gender

        if (assignDoctor != 'select-doctor') {
            newPatient.assignedDoctor = assignDoctor
        }

        if (password != '') {
            newPatient.setPassword(password)
        }
        else {
            newPatient.password = patient.password
        }

        return newPatient
    }

    const addNewPatient = () => {
        let newPatient = new PatientModel()
        newPatient.name = name
        newPatient.ID = TimeUtil.currentUTCTimestamp()
        newPatient.DOB = date
        newPatient.address = address
        newPatient.gender = gender

        if (password != '') {
            newPatient.setPassword(password)
        }

        if (assignDoctor != 'select-doctor') {
            newPatient.assignedDoctor = assignDoctor
        }

        return newPatient
    }

    const patientIsNotChange = () => {
        if (password != '') return false
        if (patient) {
            return (patient.name == name &&
                patient.gender == gender &&
                patient.address == address &&
                patient.assignedDoctor == assignDoctor&&
                patient.DOB == date && password.trim() == '')
        }

        return false
    }

    const onModifyPatient = () => {
        if (name !== '' && gender !== '' && date !== '' && address !== '') {
            /**
             * @type {PatientModel} patient
             */
            let newPatient;
            if (searchParams.get('id')) {
                if (patientIsNotChange() == false) {
                    newPatient = editPatient()
                    editPatientSmartContract.execute(null, null, {
                        userId: searchParams.get('id'),
                        patient: newPatient.toJson
                    })
                }
            }
            else {
                newPatient = addNewPatient()
                if (chainService.addBlockToChain(patientService.convertPatientToBlock(newPatient))) {
                    socketService.sendSyncData()
                }
            }

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

    useEffect(() => {
    })

    const buttonTitle = () => {
        if (searchParams.get('id')) return 'Edit patient'
        return 'Add patient'
    }

    return (
        <div className="add-patient" >
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
                            <p className='panel-name'>{name}</p>
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
                            <input
                                type="text"
                                onChange={e => setName(e.target.value)}
                                placeholder='Name' className="panel-right-input panel-right-name "
                                defaultValue={name}
                            />

                            <p className='title'>Patient gender</p>

                            <select
                                defaultValue={gender}
                                onChange={e => setGender(e.target.value)}
                                className="panel-right-input"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <p className='title'>Birthday</p>
                            <input
                                type="date"
                                onChange={(e) => { setDate(e.target.value) }}
                                placeholder='Date of Birth' className="panel-right-input panel-right-dob"
                                defaultValue={date}
                            />

                            <p className='title'>Patient address</p>
                            <input
                                type="text"
                                onChange={(e) => { setAddress(e.target.value) }}
                                placeholder='Address'
                                className="panel-right-input panel-right-address"
                                defaultValue={address}
                            />

                            <p className='title'>Please assign doctor</p>

                            <select
                                defaultValue={assignDoctor}
                                onChange={e => setDoctor(e.target.value)}
                                className="panel-right-input"
                            >
                                <option value={'select-doctor'} key={'none'}>{'Select doctor'}</option>
                                {
                                    getAllDoctorSmartContract.getAllDoctor() ? getAllDoctorSmartContract.getAllDoctor().map(e => {
                                        return (
                                            <option value={e.username} key={e.username}>{e.name}</option>
                                        )
                                    }) : null
                                }
                            </select>

                            <p className='title'>Account password</p>
                            <input type="text" onChange={(e) => { setPassword(e.target.value) }} placeholder='Password' className="panel-right-input panel-right-address" />

                            <div className="button-bar">
                                <button className="btn-back btn" onClick={() => {
                                    navigate('/home')
                                }}>Back</button>
                                <button className="btn-add btn" onClick={onModifyPatient}>{buttonTitle()}</button>
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
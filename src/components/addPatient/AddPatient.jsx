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
    const selectInputRef = useRef();

    const option = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ]

    const [status, setStatus] = useState('ACTIVE');
    const [name, setName] = useState(patient ? patient.name : '');
    const [gender, setGender] = useState(patient ? patient.gender : null);
    const [date, setDate] = useState(patient ? patient.DOB : '');
    const [address, setAddress] = useState(patient ? patient.address : '');
    const [assignDoctor, setDoctor] = useState('');
    const [password, setPassword] = useState('');

    const editPatient = () => {
        let patient = new PatientModel()
        patient.name = name
        patient.ID = searchParams.get('id')
        patient.DOB = date
        patient.address = address
        patient.gender = gender
        return patient
    }

    const addNewPatient = () => {
        let patient = new PatientModel()
        patient.name = name
        patient.ID = TimeUtil.currentUTCTimestamp()
        patient.DOB = date
        patient.address = address
        patient.gender = gender

        if (password != '') {
            patient.password = password
        }

        return patient
    }

    const onModifyPatient = () => {
        if (name !== '' && gender !== '' && date !== '' && address !== '') {
            /**
             * @type {PatientModel} patient
             */
            let patient;
            if (searchParams.get('id')) {
                patient = editPatient()
                editPatientSmartContract.execute(null, null, {
                    userId: searchParams.get('id'),
                    patient: patient.toJson
                })
            }
            else {
                patient = addNewPatient()
                if (chainService.addBlockToChain(patientService.convertPatientToBlock(patient))) {
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

    const doctors = () => {
        return getAllDoctorSmartContract.getAllDoctor().map(e => {
            return { value: e.username, label: e.name }
        })
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
                            <Select
                                options={option}
                                onChange={(e) => { setGender(e.value) }}
                                className="panel-right-gender"
                                placeholder='Gender'
                                // value={option.find(e => e.value == (patient ? patient.gender : gender))}
                            />

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
                            <Select options={doctors()} onChange={(e) => { setDoctor(e.value) }} className="panel-right-gender" placeholder='Assign doctor' />

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
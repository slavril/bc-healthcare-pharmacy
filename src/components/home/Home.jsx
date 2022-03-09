import React, { useState, useEffect, useContext } from 'react';
import './Home.scss';
import { useNavigate, Link, Route } from 'react-router-dom';

import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { allPatientSmartContract } from '../../smartcontract/AllPatient.smc'
import { chainService } from '../../services/Blockchain.service'
import DoctorModel from '../../models/Doctor.model'
import { patientService } from '../../services/Patient.service'
import { socketService } from '../../services/Socket.service'

function Home() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    
    /**
     * @type {DoctorModel[]} doctors
     */
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        chainService.onChainSynced = () => {
            setDoctors(getAllDoctorSmartContract.getAllDoctor())
            setPatients(allPatientSmartContract.getAllPatients())
        }

        if (chainService.isSyncing == false) {
            setDoctors(getAllDoctorSmartContract.getAllDoctor())
            setPatients(allPatientSmartContract.getAllPatients())
        }
    }, [])

    const toDetail = async (e) => {
        //await sharingData(e)
        //navigate('/patientdetail')
    }

    const addNewDoctor = () => {
        navigate('/add-doctor')
    }

    const addNewPatient = () => {
        navigate('/add-patient')
    }

    const onPatientClick = (ID) => {
        //console.log(ID);
        //navigate('/edit-patient', { patientID: ID })
    }

    return (
        <div className="content">
            <div className='doctor'>
                <div className='header'>
                    <div className="title">Doctors</div>
                    <button className='button' onClick={addNewDoctor} style={{ marginLeft: 8 }}>New doctor</button>
                </div>
                <div className='list'>
                    {doctors ? doctors.map(e => {
                        return (
                            <div className='doctor-cell' key={e.username}>
                                <div className='text-title'>Doctor {e.name}</div>
                                <div className='text'>@{e.username}</div>
                            </div>
                        )
                    }) : 'no data'}
                </div>
            </div>

            <div>
                <div className='header'>
                <div className="title">Patients</div>
                    <button className='button' onClick={addNewPatient} style={{ marginLeft: 8 }}>New patient</button>
                </div>
                <div className='list-patient'>
                    {patients ? patients.map(e => {
                        return (
                            <Link to={'../edit-patient?id=' + e.ID} className='patient-cell' key={e.ID} onClick={() => { onPatientClick(e.ID) }}>
                                <div className='text-title'>{e.name}</div>
                                <div className='text-gender'>ID {e.ID}</div>
                                <div className='text'>{e.gender}</div>
                                <div className='text'>{e.DOB}</div>
                                <div className='text'>{e.address}</div>
                                <div className='text'>Assigned doctor: {e.assignedDoctor}</div>
                            </Link>
                        )
                    }) : 'no data'}
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home
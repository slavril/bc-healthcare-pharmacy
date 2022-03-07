import React, { useState, useEffect, useContext } from 'react';
import './Home.scss';
import { useNavigate } from 'react-router-dom';

import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { allPatientSmartContract } from '../../smartcontract/AllPatient.smc'
import { chainService } from '../../services/Blockchain.service'
import DoctorModel from '../../models/Doctor.model'
import { patientService } from '../../services/Patient.service'
import { socketService} from '../../services/Socket.service'

function Home() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

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
        navigate('/addDoctor')
    }

    const addNewPatient = () => {
        navigate('/addPatient')
    }


    return (
        <div className="content">
            <div className='doctor'>
                <div className='header'>
                    <h2>Doctors list</h2>
                </div>
                <div className='panel'>
                    <div>
                        <button className='button' onClick={addNewDoctor} style={{ marginLeft: 8 }}>New doctor</button>
                    </div>
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
                    <h2>Patients</h2>
                </div>
                <div className='panel'>
                    <div>
                        <button className='button' onClick={addNewPatient} style={{ marginLeft: 8 }}>New patient</button>
                    </div>
                </div>
                <div className='list-patient'>
                    {patients ? patients.map(e => {
                        return (
                            <div className='patient-cell' key={e.ID}>
                                <div className='text-title'>{e.name}</div>
                                <div className='text-gender'>ID {e.ID}</div>
                                <div className='text'>{e.gender}</div>
                                <div className='text'>{e.DOB}</div>
                                <div className='text'>{e.address}</div>
                            </div>
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
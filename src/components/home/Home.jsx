import React, { useState, useEffect, useContext } from 'react';
import './Home.scss';
import { useNavigate, Link, Route } from 'react-router-dom';

import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { allPatientSmartContract } from '../../smartcontract/AllPatient.smc'
import { chainService } from '../../services/Blockchain.service'
import DoctorModel from '../../models/Doctor.model'

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
        <div className="body-all">
            <div className="top">
                <div className="top-title font-gg">Pharmacy Website</div>
                <button className='button font-gg' onClick={addNewDoctor} style={{ marginLeft: 8 }}>New doctor</button>
                <button className='button font-gg' onClick={addNewPatient} style={{ marginLeft: 8 }}>New patient</button>
            </div>
            <div className="content">
                <div className='doctor'>
                    <div className='sector'>
                        <div className="title font-gg">Doctors</div>
                    </div>
                    <div className='list'>
                        {doctors ? doctors.map(e => {
                            return (
                                <div className='doctor-cell' key={e.username}>
                                    <div className='text-title font-gg'>Doctor {e.name}</div>
                                    <div className='text font-gg'>@{e.username}</div>
                                </div>
                            )
                        }) : 'no data'}
                    </div>
                </div>

                <div>
                    <div className='sector'>
                        <div className="title font-gg">Patients</div>
                    </div>
                    <div className='list-patient'>
                        {patients ? patients.map(e => {
                            return (
                                <Link to={'../edit-patient?id=' + e.ID} className='patient-cell' key={e.ID} onClick={() => { onPatientClick(e.ID) }}>
                                    <div className='text-title font-gg'>{e.name}</div>
                                    <div className='text-gender font-gg'>{e.ID}</div>
                                    <div className='text font-gg'>{e.gender}</div>
                                    <div className='text font-gg'>{e.DOB}</div>
                                    <div className='text font-gg'>{e.address}</div>
                                    <div className='text font-gg'>Doctor: {e.assignedDoctor}</div>
                                </Link>
                            )
                        }) : 'no data'}
                    </div>
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home
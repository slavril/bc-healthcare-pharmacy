import React, { useState, useEffect, useContext } from 'react';
import './Home.scss';
import { useNavigate, Link, Route } from 'react-router-dom';

import { getAllDoctorSmartContract } from '../../smartcontract/GetAllDoctors.smc'
import { allPatientSmartContract } from '../../smartcontract/AllPatient.smc'
import { chainService } from '../../services/Blockchain.service'
import DoctorModel from '../../models/Doctor.model'

import icon from '../../resources/icon_doctor.png'

function Home() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [isLoading, setLoading] = React.useState(true);

    /**
     * @type {DoctorModel[]} doctors
     */
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        chainService.onChainSynced = () => {
            setLoading(false)
            setDoctors(getAllDoctorSmartContract.getAllDoctor())
            setPatients(allPatientSmartContract.getAllPatients())
        }

        if (chainService.isSyncing == false) {
            setLoading(false)
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

    const renderDatas = () => {
        if (isLoading) {
            return (
                <div className="body-all">
                    <div className="top">
                        <div className="top-title font-gg">Pharmacy Website</div>
                    <button className='button font-gg' onClick={addNewDoctor} style={{ marginLeft: 8 }}><img src={require('../../resources/icon_doctor.png')} className="icon" /><div>New doctor</div></button>
                    <button className='button font-gg' onClick={addNewPatient} style={{ marginLeft: 8 }}><img src={require('../../resources/icon_patient.png')} className="icon" /><div>New patient</div></button>
                    </div>
                    <div className="content">
                        <div>
                            {'Getting data, please wait'}
                            <img src={require('../../resources/walking.gif')} alt="loading..." className="loading-icon" />
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="body-all">
                <div className="top">
                    <div className="top-title font-gg">Pharmacy Website</div>
                    <button className='button font-gg' onClick={addNewDoctor} style={{ marginLeft: 8 }}><img src={require('../../resources/icon_doctor.png')} className="icon" /><div>New doctor</div></button>
                    <button className='button font-gg' onClick={addNewPatient} style={{ marginLeft: 8 }}><img src={require('../../resources/icon_patient.png')} className="icon" /><div>New patient</div></button>
                </div>
                <div className="content">
                    <div className='doctor'>
                        <div className='sector'>
                            <div className="title font-gg">Meet our Doctors</div>
                        </div>
                        <div className='list'>
                            {doctors ? doctors.map(e => {
                                return (
                                    <div className='doctor-cell' key={e.username}>
                                        <div className="doctor-cell-content">
                                            <div className='text-title center-text font-gg'>Doctor {e.name}</div>
                                            <div className='text font-gg center-text'>@{e.username}</div>
                                        </div>
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
                                        <div className='text font-gg'>{e.password}</div>
                                    </Link>
                                )
                            }) : 'no data'}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return renderDatas()
}

Home.propTypes = {

}

export default Home
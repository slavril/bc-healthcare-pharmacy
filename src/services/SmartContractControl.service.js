
import { allPatientSmartContract } from '../smartcontract/AllPatient.smc'
import { patientDetailSmartContract } from '../smartcontract/PatientDetail.smc'
import { addNewPatientSmartContract } from '../smartcontract/AddNewPatient.smc'
import { addPrescriptionSmartContract } from '../smartcontract/AddPrescription.smc'
import { getDoctorDetailSmartContract } from '../smartcontract/GetDoctorDetail.smc'
import { getAllDoctorSmartContract } from '../smartcontract/GetAllDoctors.smc'
import { loginSmartContract } from '../smartcontract/Login.smc'
import { changeDoctorPasswordSmartContract } from '../smartcontract/ChangeDoctorPassword.smc'
import BaseSMC from '../smartcontract/BaseSmartcontract.smc'

class SmartContractService {

    /**
     * @type {BaseSMC[]}
     */
    smartcontracts = [
        allPatientSmartContract,
        patientDetailSmartContract,
        addNewPatientSmartContract,
        addPrescriptionSmartContract,
        getDoctorDetailSmartContract,
        getAllDoctorSmartContract,
        loginSmartContract,
        changeDoctorPasswordSmartContract
    ]

    constructor() {

    }

    execute = (creatorKey, smcKey, inputParams) => {
        console.log('Run smart contract process ', inputParams);
        const exe = this.smartcontracts.find(e => {
            return e.contractKey === smcKey
        })

        console.log('-> ', exe.contractKey);
        exe.execute(creatorKey, smcKey, inputParams)
    }
}

export let smartcontractService = Object.seal(new SmartContractService())
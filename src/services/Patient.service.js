import { chainService } from './Blockchain.service.js'
import BlockModel, { TRANSACTION_TYPE } from '../models/Block.model.js'
import PatientModel from '../models/patient.model.js'
import DoctorModel from '../models/Doctor.model.js'

class PatientService {

    /**
     * @type {PatientModel[]}
     */
    patients = []

    get allPatientsJsonString() {
        return ''
    }


    /**
     * 
     * @param {Object} patientJson
     */
    addNewRawPatient = (patientJson, done) => {

        done(true)
    }

    /**
     * 
     * @param {BlockModel[]} chains 
     */
    parsePatientList = () => {
        chainService.chains.forEach(element => {
            if (element.type === TRANSACTION_TYPE.patient) {
                this.patients.push(PatientModel.initFromJson(JSON.parse(element.transaction)))
            }
        });
    }

    /**
     * 
     * @param {PatientModel} patientObject
     * @returns {BlockModel}
     */
    convertPatientToBlock = (patientObject) => {
        let block = new BlockModel()
        block.previousHash = chainService.lastBlock.computeHash
        block.transaction = patientObject.toJson
        block.index = patientObject.ID
        block.type = TRANSACTION_TYPE.patient
        return block
    }

    /**
     * 
     * @param {DoctorModel} doctorObject
     * @returns {BlockModel}
     */
    convertDoctorToBlock = (doctorObject) => {
        let block = new BlockModel()
        block.previousHash = chainService.lastBlock.computeHash
        block.transaction = doctorObject.toJson
        block.index = doctorObject.username
        block.type = TRANSACTION_TYPE.doctor
        
        return block
    }

}

export let patientService = Object.seal(new PatientService())
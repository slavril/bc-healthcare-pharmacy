import PrescriptionModel from './Prescription.model'
import { encrypt, decrypt } from '../utils/Encryptor'
import { TimeUtil } from '../utils/Time.util'
export default class Patient {

    ID = null;
    name = null;
    DOB = null;
    address = null;
    gender = null;
    isDeleted = false

    // encrypted value
    password = null

    assignedDoctor = null

    /**
     * @type {PrescriptionModel[]}
     */
    prescriptions = []

    get jsonString() {
        return JSON.stringify(this.toJson)
    }

    constructor() {
        this.setPassword(TimeUtil.currentUTCTimestamp().toString())
    }

    get toJson() {
        let json = {
            ID: this.ID,
            name: this.name,
            DOB: this.DOB,
            address: this.address,
            gender: this.gender,
            isDeleted: this.isDeleted,
            assignedDoctor: this.assignedDoctor
        }

        if (this.password) json.password = this.password

        return json
    }

    get toJsonAndPrescription() {        
        let json = this.toJson

        json.prescriptions = this.prescriptions.map(e => {
            return e.toJson
        })

        return json
    }

    static initFromJson = (json) => {
        let patient = new Patient()
        patient.ID = json.ID
        patient.name = json.name
        patient.DOB = json.DOB
        patient.address = json.address
        patient.gender = json.gender
        patient.isDeleted = json.isDeleted
        patient.password = json.password
        patient.assignedDoctor = json.assignedDoctor
        return patient
    }

    isVerified = (password) => {
        if (!password || !this.password) {
            return false
        }

        if (decrypt(password, this.password) == 'verified') {
            return true
        }

        return false
    }

    setPassword = (newValue) => {
        if (newValue)
            this.password = encrypt(newValue, 'verified')
    }

}
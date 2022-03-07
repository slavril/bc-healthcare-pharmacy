import MedicationModel from './Medication.model'
import { TimeUtil } from '../utils/Time.util'

export default class Prescription {

    ID = null;
    name = null;
    doctor = null;
    createdDate = null;
    patientID = null;

    /**
     * @type {MedicationModel[]} medications
     */
    medications = []

    constructor() {
        this.ID = TimeUtil.currentUTCTimestamp()
        this.createdDate = TimeUtil.currentUTCTimestamp()
    }

    get toJson() {
        const medicationJson = this.medications.map(e => {
            return e.toJson
        })

        return {
            ID: this.ID,
            name: this.name,
            doctor: this.doctor,
            createdDate: this.createdDate,
            patientID: this.patientID,
            medications: medicationJson
        }
    }

    static initFromJson = (json) => {
        let patient = new Prescription()
        patient.ID = json.ID
        patient.name = json.name
        patient.doctor = json.doctor
        patient.createdDate = json.createdDate
        patient.patientID = json.patientID

        if (json.medications && json.medications.length > 0) {
            patient.medications = json.medications.map(e => {
                return MedicationModel.initFromJson(e)
            })
        }

        return patient
    }

}
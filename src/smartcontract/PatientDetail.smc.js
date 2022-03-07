import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import PrescriptionModel from '../models/Prescription.model'

class PatientDetail extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'PatientDetailSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }
        if (!param || !param.patientId) { return }

        let comparePassword = false
        if (!param || param.password) { 
            comparePassword = true
        }

        console.log('Param: ', param);

        const result = chainService.chains.filter(e => {
            return (e.type === 'patient')
        }).find(e => {
            const patient = PatientModel.initFromJson(e.transaction)

            if (patient.ID === param.patientId) {
                if (param.password) {
                    if (patient.isVerified(param.password)) {
                        return true
                    }
                }
                else {
                    return true
                }
            }
            
            return false
        })

        if (result) {
            let patient = PatientModel.initFromJson(result.transaction)

            if (this.allPrescription) {
                patient.prescriptions = this.allPrescription.filter(e => e.patientID == patient.ID)
            }

            const transaction = TransactionModel.init(param.socketId, {
                smcKey: 'PatientDetailSmartContract',
                patient: patient.toJsonAndPrescription
            })

            socketService.sendSMCReturn(transaction.toJson())
        }
    }

    /**
     * @type {PrescriptionModel[]} allPrescription
     */
    get allPrescription() {
        return chainService.chains.filter(e => e.type == 'prescription').map(e => {
            return PrescriptionModel.initFromJson(e.transaction)
        })
    }

    getAllPrescriptions = (patientId) => {
        chainService.chains.filter(e => e.type == 'prescription').find(e => e.transaction.patientId == patientId )
    }

}

export let patientDetailSmartContract= Object.seal(new PatientDetail())
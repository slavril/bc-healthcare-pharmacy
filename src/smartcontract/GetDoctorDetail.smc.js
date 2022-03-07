import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import { decrypt } from '../utils/Encryptor'
import doctorModel from '../models/Doctor.model'


class DoctorDetail extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'GetDoctorDetailSmartContract'
    }

    /**
     * 
     * @param {Object} block 
     * @param {String} username 
     * @param {String} password 
     */
    verifyDoctor = (block, username, password) => {
        const purecode = decrypt(password, block.transaction.password)

        if (purecode != password || block.transaction.username != username) return false

        return true
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }
        if (!param || !param.doctorUsername) { return }
        if (!param || !param.doctorPassword) { return }

        let block = null
        if (param.doctorUsername) {
            block = chainService.chains.find(e => e.index === param.doctorUsername)
        }

        if (block) {
            const doctor = this.verifyDoctor(block, param.doctorUsername, param.doctorPassword)
            if (doctor !== false) {
                const transaction = TransactionModel.init(param.socketId, {
                    smcKey: 'GetDoctorDetailSmartContract',
                    doctor: doctor
                })

                socketService.sendSMCReturn(transaction.toJson())

                return;
            }
        }

        // else
        const transaction = TransactionModel.init(param.socketId, {
            smcKey: 'GetDoctorDetailSmartContract',
            doctor: null
        })

        socketService.sendSMCReturn(transaction.toJson())
    }

}

export let getDoctorDetailSmartContract = Object.seal(new DoctorDetail())
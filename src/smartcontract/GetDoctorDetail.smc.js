import BaseSmartContract from './BaseSmartcontract.smc'
import { chainService } from '../services/Blockchain.service'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'
import PatientModel from '../models/patient.model'
import { decryptDR, encryptDR } from '../utils/Encryptor'
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
        const purecode = decryptDR(block.transaction.password)
        return (purecode == password && block.transaction.username == username)
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }
        if (!param || !param.doctorUsername) { return }
        if (!param || !param.doctorPassword) { return }

        const doctor = this.getDetail(param.doctorUsername, param.doctorPassword)
        if (doctor) {
            const transaction = TransactionModel.init(param.socketId, {
                smcKey: 'GetDoctorDetailSmartContract',
                doctor: doctor.toJson
            })

            socketService.sendSMCReturn(transaction.toJson())

            return;
        }

        // else
        const transaction = TransactionModel.init(param.socketId, {
            smcKey: 'GetDoctorDetailSmartContract',
            doctor: null
        })

        socketService.sendSMCReturn(transaction.toJson())
    }

    /**
     * 
     * @param {*} ID 
     * @param {*} password 
     * @returns {doctorModel}
     */
    getDetail = (ID, password) => {
        let block = this.getDetailBlock(ID)
        if (block) {

            if (block.direction) {
                block = chainService.getShadowOf(block.direction)
            }

            const confirmed = this.verifyDoctor(block, ID, password)
            if (confirmed == true) {
                const object = doctorModel.initFromJson(block.transaction)
                return object
            }
        }

        console.log('Can not get doctor information, wrong password or userId');
        return undefined
    }

    getDetailBlock = (ID) => {
        const block = chainService.chains.find(e => e.index === ID)
        return block
    }

}

export let getDoctorDetailSmartContract = Object.seal(new DoctorDetail())
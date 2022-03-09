import BaseSmartContract from './BaseSmartcontract.smc'
import TransactionModel from '../models/Transaction.model'
import { socketService } from '../services/Socket.service'

import { getDoctorDetailSmartContract } from './GetDoctorDetail.smc'
import { patientDetailSmartContract } from './PatientDetail.smc'

class Login extends BaseSmartContract {

    constructor() {
        super()
        this.creatorKey = 'FF'
        this.contractKey = 'LoginSmartContract'
    }

    execute = (creatorKey, contractKey, param) => {
        if (!param || !param.socketId) { return }
        if (!param || !param.userId) { return }
        if (!param || !param.password) { return }

        let transaction = TransactionModel.init(param.socketId, {
            smcKey: 'LoginSmartContract'
        })

        const doctor = getDoctorDetailSmartContract.getDetail(param.userId, param.password)
        if (doctor) {
            transaction.data.doctor = doctor
            socketService.sendSMCReturn(transaction.toJson())
            return;
        }

        const patient = patientDetailSmartContract.getDetail(param.userId, param.password)
        if (patient) {
            transaction.data.patient = patient
        }

        socketService.sendSMCReturn(transaction.toJson())
    }

}

export let loginSmartContract = Object.seal(new Login())